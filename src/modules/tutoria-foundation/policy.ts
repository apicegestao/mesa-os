import { isTutorIATool, type TutorIATool } from "./tools";
export type { TutorIATool } from "./tools";
export type TutorIAPolicyOutcome = "allow" | "deny" | "escalate";

export type TutorIAPolicyInput = {
  authenticatedIdentityId?: string;
  actorIdentityId: string;
  organizationId: string;
  membershipActive: boolean;
  requestedTool: TutorIATool | string;
};

export type TutorIAPolicyDecision = {
  outcome: TutorIAPolicyOutcome;
  reasonCode: "identity_required" | "identity_mismatch" | "membership_inactive" | "tool_not_catalogued" | "audit_unavailable" | "read_only_allowed";
};

/**
 * This is deliberately deterministic. It governs a future model; it is not
 * itself a model decision and does not grant a broader database capability.
 */
export function evaluateTutorIAPolicy(input: TutorIAPolicyInput): TutorIAPolicyDecision {
  if (!input.authenticatedIdentityId) return { outcome: "deny", reasonCode: "identity_required" };
  if (input.authenticatedIdentityId !== input.actorIdentityId) return { outcome: "deny", reasonCode: "identity_mismatch" };
  if (!input.membershipActive) return { outcome: "deny", reasonCode: "membership_inactive" };
  if (!isTutorIATool(input.requestedTool)) return { outcome: "escalate", reasonCode: "tool_not_catalogued" };
  return { outcome: "allow", reasonCode: "read_only_allowed" };
}
