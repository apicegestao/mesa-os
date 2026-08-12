import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { TutorIAMemory } from "./domain";

export async function loadMyTutorIAMemories(supabase: SupabaseClient<Database>): Promise<TutorIAMemory[]> {
  const { data } = await supabase.from("tutoria_member_memories").select("id,kind,content,source_kind,confidence,state,valid_until,version,updated_at").order("updated_at", { ascending: false });
  return (data ?? []).map((memory) => ({ id: memory.id, kind: memory.kind, content: memory.content, sourceKind: memory.source_kind as TutorIAMemory["sourceKind"], confidence: memory.confidence, state: memory.state, validUntil: memory.valid_until, version: memory.version, updatedAt: memory.updated_at }));
}
