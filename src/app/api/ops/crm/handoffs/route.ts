import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("accept"), handoffId: z.string().uuid() }),
  z.object({ action: z.literal("create"), opportunityId: z.string().uuid(), conciergeIdentityId: z.string().uuid() }),
]);

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = parsed.data.action === "accept"
    ? await supabase.rpc("accept_crm_handoff", { target_handoff_id: parsed.data.handoffId })
    : await supabase.rpc("create_crm_handoff", { target_opportunity_id: parsed.data.opportunityId, target_concierge_identity_id: parsed.data.conciergeIdentityId, target_checklist: {} });
  return result.error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: parsed.data.action === "accept" ? "accepted" : "created" }, { headers: { "Cache-Control": "no-store" } });
}
