import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicEnv } from "@/shared/config/env";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import { log } from "@/shared/observability/logger";

const eventSchema = z.object({
  id: z.string().trim().min(2).max(200),
  event: z.enum(["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED", "PAYMENT_OVERDUE", "PAYMENT_REFUNDED", "PAYMENT_DELETED"]),
  payment: z.object({
    id: z.string().trim().min(2).max(160),
    externalReference: z.string().trim().min(8).max(200).nullable().optional(),
    checkoutSession: z.string().trim().uuid().nullable().optional(),
    value: z.coerce.number().nonnegative().finite(),
  }),
}).superRefine(({ payment }, context) => {
  if (!payment.externalReference && !payment.checkoutSession) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "missing_reconciliation_reference" });
  }
});

function hasValidToken(received: string | null, expected: string | undefined) {
  if (!received || !expected || expected.length < 32) return false;
  const left = Buffer.from(received); const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  // Redeploy after protected configuration changes so the runtime receives the current secret set.
  if (!hasValidToken(request.headers.get("asaas-access-token"), process.env.ASAAS_WEBHOOK_TOKEN)) {
    log("warn", "finance_asaas_webhook_unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const rawBody = await request.text();
  if (rawBody.length > 128_000) return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  let decoded: unknown = null;
  try { decoded = JSON.parse(rawBody); } catch { /* handled as an ignored malformed event */ }
  const payload = eventSchema.safeParse(decoded);
  if (!payload.success) {
    log("warn", "finance_asaas_webhook_invalid_payload");
    return NextResponse.json({ status: "ignored" }, { status: 200 });
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    log("error", "finance_asaas_webhook_service_unavailable");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  const env = getPublicEnv();
  const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("reconcile_asaas_payment_event", {
    target_provider_event_id: payload.data.id,
    target_event_type: payload.data.event,
    target_external_reference: payload.data.payment.externalReference ?? "",
    target_checkout_session_id: payload.data.payment.checkoutSession ?? "",
    target_payment_reference: payload.data.payment.id,
    target_payload_sha256: createHash("sha256").update(rawBody).digest("hex"),
    target_amount: payload.data.payment.value,
  });
  if (error) {
    log("error", "finance_asaas_webhook_reconciliation_failed", { databaseCode: error.code ?? null });
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  log("info", "finance_asaas_webhook_reconciled", { outcome: data });
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
