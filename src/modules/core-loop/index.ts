import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type CoreLoopWorkspace = {
  implementation: { status: "draft" | "implemented"; summary: string; implementedOn: string } | null;
  evidenceSubmitted: boolean;
};

export async function loadCoreLoopWorkspace(supabase: SupabaseClient<Database>, missionId: string) {
  const [{ data: implementation }, { data: evidence }] = await Promise.all([
    supabase.from("mission_implementations").select("status,summary,implemented_on").eq("mission_id", missionId).maybeSingle(),
    supabase.from("mission_evidence").select("id").eq("mission_id", missionId).maybeSingle(),
  ]);
  return {
    implementation: implementation ? { status: implementation.status as "draft" | "implemented", summary: implementation.summary, implementedOn: implementation.implemented_on } : null,
    evidenceSubmitted: Boolean(evidence),
  } satisfies CoreLoopWorkspace;
}
