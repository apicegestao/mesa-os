import { describe, expect, it } from "vitest";
import { decideEvidenceReview } from "./policy";

describe("evidence autonomy policy", () => {
  const safe = { confidence: 0.9, criteriaMet: true, riskDetected: false, memberRequestedHuman: false, repeatedUnresolvedQuestion: false };

  it("approves only a high-confidence, criteria-complete evidence", () => {
    expect(decideEvidenceReview(safe)).toBe("approved");
  });

  it("asks for completion without escalating when confidence is sufficient", () => {
    expect(decideEvidenceReview({ ...safe, criteriaMet: false })).toBe("changes_requested");
  });

  it("escalates low confidence, risk, direct request, or persistent doubt", () => {
    expect(decideEvidenceReview({ ...safe, confidence: 0.84 })).toBe("escalated");
    expect(decideEvidenceReview({ ...safe, riskDetected: true })).toBe("escalated");
    expect(decideEvidenceReview({ ...safe, memberRequestedHuman: true })).toBe("escalated");
    expect(decideEvidenceReview({ ...safe, repeatedUnresolvedQuestion: true })).toBe("escalated");
  });
});
