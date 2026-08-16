import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.object({ evidenceId: z.string().uuid(), outcome: z.enum(["approved", "changes_requested"]), rationale: z.string().trim().min(20).max(2000) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rpc = supabase.rpc as unknown as (name: string, args: Record<string, unknown>) => Promise<{ data: { outcome?: string; next_mission_id?: string | null } | null; error: unknown }>;
  const { data, error } = await rpc("resolve_escalated_evidence_review", { target_evidence_id: parsed.data.evidenceId, target_outcome: parsed.data.outcome, target_rationale: parsed.data.rationale });
  return error || !data ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ outcome: data.outcome, nextMissionId: data.next_mission_id ?? null });
}
