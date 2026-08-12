import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type CoreLoopWorkspace = {
  implementation: { status: "draft" | "implemented"; summary: string; implementedOn: string } | null;
  evidenceSubmitted: boolean;
  evidenceStatus?: "submitted" | "approved" | "changes_requested" | "escalated" | null;
};

export type EvidenceRecord = {
  id: string;
  missionTitle: string;
  status: "submitted" | "approved" | "changes_requested" | "escalated";
  reviewerKind: "tutoria" | "human" | "system" | null;
  description: string;
  occurredOn: string;
};

export async function loadCoreLoopWorkspace(supabase: SupabaseClient<Database>, missionId: string) {
  const [{ data: implementation }, { data: evidence }] = await Promise.all([
    supabase.from("mission_implementations").select("status,summary,implemented_on").eq("mission_id", missionId).maybeSingle(),
    supabase.from("current_evidence_status").select("id,review_status").eq("mission_id", missionId).maybeSingle(),
  ]);
  return {
    implementation: implementation ? { status: implementation.status as "draft" | "implemented", summary: implementation.summary, implementedOn: implementation.implemented_on } : null,
    evidenceSubmitted: Boolean(evidence),
    evidenceStatus: evidence?.review_status === "approved" || evidence?.review_status === "changes_requested" || evidence?.review_status === "escalated" ? evidence.review_status : evidence ? "submitted" : null,
  } satisfies CoreLoopWorkspace;
}

export async function loadEvidenceRecords(supabase: SupabaseClient<Database>, organizationId: string, cycleId?: string) {
  let missionQuery = supabase.from("missions").select("id,title").eq("organization_id", organizationId);
  if (cycleId) missionQuery = missionQuery.eq("cycle_id", cycleId);
  const { data: missions } = await missionQuery;
  const missionIds = (missions ?? []).map((mission) => mission.id);
  if (!missionIds.length) return [] satisfies EvidenceRecord[];
  const { data: evidence } = await supabase
    .from("current_evidence_status")
    .select("id,mission_id,review_status,reviewer_kind,description,occurred_on")
    .eq("organization_id", organizationId)
    .in("mission_id", missionIds)
    .order("submitted_at", { ascending: false });
  const titleByMission = new Map((missions ?? []).map((mission) => [mission.id, mission.title]));
  return (evidence ?? []).flatMap((item) => {
    if (!item.id || !item.description || !item.occurred_on) return [];
    const status = item.review_status === "approved" || item.review_status === "changes_requested" || item.review_status === "escalated" ? item.review_status : "submitted";
    const reviewerKind = item.reviewer_kind === "tutoria" || item.reviewer_kind === "human" || item.reviewer_kind === "system" ? item.reviewer_kind : null;
    return [{ id: item.id, missionTitle: item.mission_id ? titleByMission.get(item.mission_id) ?? "Missão do ciclo" : "Missão do ciclo", status, reviewerKind, description: item.description, occurredOn: item.occurred_on }];
  }) satisfies EvidenceRecord[];
}
