import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("bootstrap") }),
  z.object({ action: z.literal("assign"), identityId: z.string().uuid(), role: z.enum(["admin", "commercial", "concierge", "finance", "mentor"]) }),
]);

async function getOperatorClient() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return null;
  const { data: state } = await supabase.rpc("get_my_internal_operator_state");
  return state?.[0]?.active ? supabase : null;
}

export async function POST(request: Request) {
  const supabase = await getOperatorClient();
  if (!supabase) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const result = parsed.data.action === "bootstrap"
    ? await supabase.rpc("bootstrap_first_internal_admin")
    : await supabase.rpc("assign_internal_staff_role", { target_identity_id: parsed.data.identityId, target_role: parsed.data.role });
  return result.error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
