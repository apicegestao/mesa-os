import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("createOffer"), code: z.string().trim().regex(/^[a-z0-9][a-z0-9-]{1,62}$/), name: z.string().trim().min(2).max(180), amount: z.coerce.number().nonnegative(), currency: z.string().trim().regex(/^[A-Z]{3}$/).default("BRL") }),
  z.object({ action: z.literal("createProposal"), opportunityId: z.string().uuid(), priceVersionId: z.string().uuid(), expiresOn: z.string().date().nullable().optional() }),
  z.object({ action: z.literal("confirmPayment"), proposalId: z.string().uuid(), dueOn: z.string().date().nullable().optional(), methodLabel: z.string().trim().max(80).nullable().optional(), externalReference: z.string().trim().min(2).max(160).nullable().optional() }),
]);

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const action = parsed.data;
  const result = action.action === "createOffer"
    ? await supabase.rpc("create_finance_offer", { target_code: action.code, target_name: action.name, target_amount: action.amount, target_currency: action.currency })
    : action.action === "createProposal"
      ? await supabase.rpc("create_finance_proposal", { target_crm_opportunity_id: action.opportunityId, target_price_version_id: action.priceVersionId, target_expires_on: action.expiresOn ?? null })
      : await supabase.rpc("confirm_finance_payment", { target_proposal_id: action.proposalId, target_due_on: action.dueOn ?? null, target_method_label: action.methodLabel ?? null, target_external_reference: action.externalReference ?? null });
  return result.error || !result.data ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ id: result.data }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
