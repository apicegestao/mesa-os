import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.object({
  accountName: z.string().trim().min(2).max(180), source: z.string().trim().min(2).max(80), contactName: z.string().trim().max(180).nullable().optional(), contactEmail: z.string().email().max(254).nullable().optional(),
  title: z.string().trim().min(2).max(180), expectedValue: z.coerce.number().nonnegative().nullable().optional(), nextAction: z.string().trim().min(2).max(500), nextActionDueOn: z.string().date().nullable().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { data, error } = await supabase.rpc("create_crm_opportunity", {
    target_account_name: parsed.data.accountName, target_source: parsed.data.source, target_contact_name: parsed.data.contactName ?? null, target_contact_email: parsed.data.contactEmail ?? null,
    target_title: parsed.data.title, target_expected_value: parsed.data.expectedValue ?? null, target_next_action: parsed.data.nextAction, target_next_action_due_on: parsed.data.nextActionDueOn ?? null,
  });
  return error || !data ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ opportunityId: data }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

const stageSchema = z.object({ opportunityId: z.string().uuid(), stage: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]), nextAction: z.string().trim().min(2).max(500), nextActionDueOn: z.string().date().nullable().optional(), lostReason: z.string().trim().max(500).nullable().optional() });

export async function PATCH(request: Request) {
  const parsed = stageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { error } = await supabase.rpc("update_crm_opportunity_stage", { target_opportunity_id: parsed.data.opportunityId, target_stage: parsed.data.stage, target_next_action: parsed.data.nextAction, target_next_action_due_on: parsed.data.nextActionDueOn ?? null, target_lost_reason: parsed.data.lostReason ?? null });
  return error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: "updated" }, { headers: { "Cache-Control": "no-store" } });
}
