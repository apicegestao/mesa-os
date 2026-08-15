import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/shared/config/env";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { EvidenceAssessment } from "../domain/assessment";

export async function writeTrustedEvidenceDecision(input: { evidenceId: string; assessment: EvidenceAssessment; modelReference: string }) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return { ok: false as const, code: "service_unavailable" as const };
  const env = getPublicEnv();
  if (env.NEXT_PUBLIC_APP_ENV !== "staging") return { ok: false as const, code: "review_not_enabled" as const };
  const service = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await (service.rpc as unknown as (name: string, args: Record<string, unknown>) => Promise<{ data: { outcome?: string; next_mission_id?: string | null } | null; error: { code?: string } | null }>)("apply_tutoria_evidence_decision", {
    target_evidence_id: input.evidenceId,
    target_outcome: input.assessment.decision,
    target_confidence: input.assessment.confidence,
    target_rationale: input.assessment.rationale,
    target_escalation_reason: input.assessment.decision === "escalated" ? input.assessment.rationale : null,
    target_model_reference: input.modelReference,
  });
  if (error || !data) return { ok: false as const, code: error?.code ?? "write_failed" };
  return { ok: true as const, outcome: data.outcome ?? input.assessment.decision, nextMissionId: data.next_mission_id ?? null };
}
