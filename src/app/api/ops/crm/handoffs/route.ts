import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.object({ handoffId: z.string().uuid() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { error } = await supabase.rpc("accept_crm_handoff", { target_handoff_id: parsed.data.handoffId });
  return error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: "accepted" }, { headers: { "Cache-Control": "no-store" } });
}
