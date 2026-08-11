import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type Cycle = {
  id: string;
  title: string;
  starts_on: string;
  ends_on: string;
  status: "active";
};

export async function loadCycle(
  supabase: SupabaseClient<Database>,
  organizationId: string,
) {
  const { data } = await supabase
    .from("cycles")
    .select("id,title,starts_on,ends_on,status")
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .maybeSingle();

  return data as Cycle | null;
}
