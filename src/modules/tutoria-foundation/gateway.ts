import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import { evaluateTutorIAPolicy, type TutorIATool } from "./policy";

type GatewayInput = {
  supabase: SupabaseClient<Database>;
  authenticatedIdentityId?: string;
  organizationId: string;
  membershipActive: boolean;
  requestedTool: TutorIATool;
  sourceCodes: string[];
  absentFields?: string[];
};

/** Records the permitted scope of a future TutorIA read. No model or business
 * action runs here; the audit trail intentionally stores only stable codes. */
export async function recordTutorIAReadGateway(input: GatewayInput) {
  const actorIdentityId = input.authenticatedIdentityId ?? "00000000-0000-0000-0000-000000000000";
  const policy = evaluateTutorIAPolicy({
    authenticatedIdentityId: input.authenticatedIdentityId,
    actorIdentityId,
    organizationId: input.organizationId,
    membershipActive: input.membershipActive,
    requestedTool: input.requestedTool,
  });
  if (policy.outcome !== "allow") return policy;
  const auditUnavailable = () => ({ outcome: "escalate" as const, reasonCode: "audit_unavailable" as const });

  const { data: context, error: contextError } = await input.supabase
    .from("tutoria_context_audits")
    .insert({
      organization_id: input.organizationId,
      actor_identity_id: actorIdentityId,
      purpose: "screen_presence",
      source_codes: input.sourceCodes,
      absent_fields: input.absentFields ?? [],
    })
    .select("id")
    .single();
  if (contextError || !context) return auditUnavailable();

  const { data: decision, error: decisionError } = await input.supabase
    .from("tutoria_policy_decisions")
    .insert({
      context_audit_id: context.id,
      organization_id: input.organizationId,
      actor_identity_id: actorIdentityId,
      requested_tool: input.requestedTool,
      outcome: policy.outcome,
      reason_code: policy.reasonCode,
    })
    .select("id")
    .single();
  if (decisionError || !decision) return auditUnavailable();

  const { error: toolAuditError } = await input.supabase.from("tutoria_tool_audits").insert({
    policy_decision_id: decision.id,
    organization_id: input.organizationId,
    actor_identity_id: actorIdentityId,
    tool_name: input.requestedTool,
    outcome: "success",
    result_codes: ["context_scope_recorded"],
    duration_ms: 0,
  });
  if (toolAuditError) return auditUnavailable();
  return policy;
}
