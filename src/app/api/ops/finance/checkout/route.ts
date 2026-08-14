import { NextResponse } from "next/server";
import { z } from "zod";
import { AsaasCheckoutError, createAsaasSandboxCheckout, isSandboxAsaasKey } from "@/modules/finance/asaas/adapter";
import { getPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { log } from "@/shared/observability/logger";

const schema = z.object({ proposalId: z.string().uuid() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    log("warn", "finance_asaas_checkout_invalid_request");
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const env = getPublicEnv();
  if (env.NEXT_PUBLIC_APP_ENV !== "staging") {
    log("warn", "finance_asaas_checkout_wrong_environment");
    return NextResponse.json({ error: "sandbox_only" }, { status: 403 });
  }
  const apiKey = process.env.ASAAS_API_KEY?.trim();
  if (!apiKey || !isSandboxAsaasKey(apiKey)) {
    log("warn", "finance_asaas_checkout_configuration_unavailable", { hasApiKey: Boolean(apiKey) });
    return NextResponse.json({ error: "checkout_unavailable" }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    log("warn", "finance_asaas_checkout_forbidden");
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: prepared, error: prepareError } = await supabase.rpc("prepare_asaas_checkout", { target_proposal_id: parsed.data.proposalId });
  const checkout = prepared?.[0];
  if (prepareError || !checkout) {
    log("warn", "finance_asaas_checkout_preparation_failed", { databaseCode: prepareError?.code ?? null });
    const reason = prepareError?.code === "42501" ? "permission" : prepareError?.code === "22023" ? "contact" : "unavailable";
    return NextResponse.json({ error: "checkout_unavailable", reason }, { status: 422 });
  }

  const { data: claimed, error: claimError } = await supabase.rpc("claim_asaas_checkout", { target_checkout_id: checkout.checkout_id });
  if (claimError || !claimed) {
    log("warn", "finance_asaas_checkout_claim_unavailable", { databaseCode: claimError?.code ?? null });
    return NextResponse.json({ error: "checkout_in_progress" }, { status: 409 });
  }

  try {
    const asaas = await createAsaasSandboxCheckout({
      apiKey,
      amount: checkout.amount,
      currencyCode: checkout.currency_code,
      externalReference: checkout.external_reference,
      offerName: checkout.offer_name,
      payerEmail: checkout.payer_email,
      payerName: checkout.payer_name,
      callbackBaseUrl: request.url,
    });
    const { error: recordError } = await supabase.rpc("record_asaas_checkout", {
      target_checkout_id: checkout.checkout_id,
      target_provider_checkout_id: asaas.id,
      target_checkout_link: asaas.link,
      target_expires_at: null,
    });
    if (recordError) throw new Error("checkout_record_failed");
    return NextResponse.json({ checkoutUrl: asaas.link }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    await supabase.rpc("fail_asaas_checkout", { target_checkout_id: checkout.checkout_id });
    const providerCodes = error instanceof AsaasCheckoutError ? error.validationCodes : [];
    log("warn", "finance_asaas_checkout_failed", {
      reason: error instanceof Error ? error.message : "unknown",
      providerCodes: providerCodes.join(",") || null,
    });
    return NextResponse.json({
      error: "checkout_unavailable",
      reason: error instanceof AsaasCheckoutError ? "provider_rejected" : "unavailable",
      providerCodes,
    }, { status: 422 });
  }
}
