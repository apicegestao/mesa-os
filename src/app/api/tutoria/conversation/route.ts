import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

type ConversationRow = { id: string; role: "member" | "tutoria"; content: string; created_at: string };

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rpc = supabase.rpc as unknown as (name: string) => Promise<{ data: ConversationRow[] | null; error: unknown }>;
  const { data, error } = await rpc("get_my_tutoria_conversation");
  return error ? NextResponse.json({ error: "unavailable" }, { status: 503 }) : NextResponse.json({ messages: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}
