import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const acceptedEvents = new Set(["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED", "PAYMENT_OVERDUE", "PAYMENT_REFUNDED", "PAYMENT_DELETED"]);

type AsaasEvent = {
  id?: unknown;
  event?: unknown;
  payment?: { id?: unknown; externalReference?: unknown; value?: unknown };
};

function response(status: number, body: Record<string, boolean | string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function equalTokens(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return response(405, { error: "method_not_allowed" });
  const webhookToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
  const receivedToken = request.headers.get("asaas-access-token");
  if (!webhookToken) return response(503, { error: "webhook_not_configured" });
  if (!receivedToken || !equalTokens(receivedToken, webhookToken)) return response(401, { error: "unauthorized" });

  const rawBody = await request.text();
  if (rawBody.length === 0 || rawBody.length > 65_536) return response(400, { error: "invalid_request" });
  let payload: AsaasEvent;
  try { payload = JSON.parse(rawBody) as AsaasEvent; } catch { return response(400, { error: "invalid_request" }); }

  const eventId = typeof payload.id === "string" ? payload.id.trim() : "";
  const eventType = typeof payload.event === "string" ? payload.event.trim() : "";
  const externalReference = typeof payload.payment?.externalReference === "string" ? payload.payment.externalReference.trim() : "";
  const paymentReference = typeof payload.payment?.id === "string" ? payload.payment.id.trim() : "";
  const amount = typeof payload.payment?.value === "number" && Number.isFinite(payload.payment.value) ? payload.payment.value : null;
  if (!eventId || !acceptedEvents.has(eventType) || !externalReference) return response(400, { error: "unsupported_event" });

  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.rpc("reconcile_asaas_payment_event", {
    target_provider_event_id: eventId,
    target_event_type: eventType,
    target_external_reference: externalReference,
    target_payment_reference: paymentReference,
    target_payload_sha256: await sha256(rawBody),
    target_amount: amount,
  });
  if (error) return response(500, { error: "reconciliation_failed" });
  return response(200, { accepted: true, disposition: data });
});
