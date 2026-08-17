import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { TutorIAMemory } from "./domain";

export async function loadMyTutorIAMemories(supabase: SupabaseClient<Database>): Promise<TutorIAMemory[]> {
  const { data } = await supabase.from("tutoria_member_memories").select("id,kind,content,source_kind,confidence,state,valid_until,version,updated_at").order("updated_at", { ascending: false });
  return (data ?? []).map((memory) => ({ id: memory.id, kind: memory.kind, content: memory.content, sourceKind: memory.source_kind as TutorIAMemory["sourceKind"], confidence: memory.confidence, state: memory.state, validUntil: memory.valid_until, version: memory.version, updatedAt: memory.updated_at }));
}

/** Only system-derived, low-detail facts can reach the guidance prompt. */
export async function loadTutorIAOrientationContext(supabase: SupabaseClient<Database>, enabled: boolean): Promise<string[]> {
  if (!enabled) return [];
  const { data } = await supabase.from("tutoria_member_memories").select("content,source_kind").eq("state", "active").in("source_kind", ["diagnostic_completed", "priority_confirmed", "cycle_started", "mission_available", "implementation_confirmed", "evidence_approved"]).order("updated_at", { ascending: false }).limit(8);
  const structuredContext = (data ?? []).map((memory) => memory.content);
  const rpc = supabase.rpc.bind(supabase) as unknown as (name: string) => Promise<{ data: Array<{ role: string; content: string }> | null; error: unknown }>;
  const { data: conversation } = await rpc("get_my_tutoria_conversation");
  const conversationContext = (conversation ?? []).slice(-8).map((message) => `${message.role === "member" ? "Membro" : "TutorIA"}: ${message.content.slice(0, 900)}`);
  return [...structuredContext, ...conversationContext];
}
