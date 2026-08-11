import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { Priority } from "../domain/priority";

export async function loadPriority(supabase: SupabaseClient<Database>, organizationId: string): Promise<Priority | null> {
  const { data } = await supabase.from("priorities").select("id,dimension_label,source_score,rationale,confirmed_at").eq("organization_id", organizationId).maybeSingle();
  return data;
}
