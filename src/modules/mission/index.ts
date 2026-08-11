import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type Mission = {
  id: string;
  position: number;
  title: string;
  objective: string;
  rationale: string;
  status: "locked" | "available";
};

export async function loadMissions(
  supabase: SupabaseClient<Database>,
  cycleId: string,
) {
  const { data } = await supabase
    .from("missions")
    .select("id,position,title,objective,rationale,status")
    .eq("cycle_id", cycleId)
    .order("position");

  return (data ?? []) as Mission[];
}
