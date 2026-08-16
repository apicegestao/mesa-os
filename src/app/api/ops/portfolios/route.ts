import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("assign"), organizationId: z.string().uuid(), assigneeIdentityId: z.string().uuid(), kind: z.enum(["concierge", "mentor"]), reason: z.string().trim().min(3).max(500).nullable().optional() }),
  z.object({ action: z.literal("revoke"), assignmentId: z.string().uuid() }),
]);

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = parsed.data.action === "assign"
    ? await supabase.rpc("assign_internal_portfolio", { target_organization_id: parsed.data.organizationId, target_assignee_identity_id: parsed.data.assigneeIdentityId, target_kind: parsed.data.kind, target_reason: parsed.data.reason ?? null })
    : await supabase.rpc("revoke_internal_portfolio", { target_assignment_id: parsed.data.assignmentId });
  return result.error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
