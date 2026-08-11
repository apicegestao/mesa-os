import { describe, expect, it } from "vitest";
import { evaluateTutorIAPolicy } from "./policy";

const base = { authenticatedIdentityId: "member-a", actorIdentityId: "member-a", organizationId: "org-a", membershipActive: true, requestedTool: "read_member_state" as const };

describe("TutorIA foundation policy", () => {
  it("allows only a signed-in active actor to use a read-only tool", () => {
    expect(evaluateTutorIAPolicy(base)).toEqual({ outcome: "allow", reasonCode: "read_only_allowed" });
  });

  it("denies an unauthenticated request", () => {
    expect(evaluateTutorIAPolicy({ ...base, authenticatedIdentityId: undefined })).toEqual({ outcome: "deny", reasonCode: "identity_required" });
  });

  it("denies identity substitution instead of trusting client-provided scope", () => {
    expect(evaluateTutorIAPolicy({ ...base, actorIdentityId: "member-b" })).toEqual({ outcome: "deny", reasonCode: "identity_mismatch" });
  });

  it("denies an inactive organizational membership", () => {
    expect(evaluateTutorIAPolicy({ ...base, membershipActive: false })).toEqual({ outcome: "deny", reasonCode: "membership_inactive" });
  });

  it("escalates a request outside the approved tool catalogue", () => {
    expect(evaluateTutorIAPolicy({ ...base, requestedTool: "write_evidence" })).toEqual({ outcome: "escalate", reasonCode: "tool_not_catalogued" });
  });
});
