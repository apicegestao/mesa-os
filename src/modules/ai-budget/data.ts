import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
export async function loadMemberAIBudgetPolicy(supabase: SupabaseClient<Database>, organizationId: string) {
  const { data } = await supabase.from("ai_member_budget_policy_revisions").select("id,monthly_limit_brl_cents,usd_micros_per_brl,effective_at").eq("organization_id", organizationId).order("effective_at", { ascending: false });
  return data ?? [];
}
