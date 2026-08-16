export type EvidenceReviewCandidate = {
  confidence: number;
  criteriaMet: boolean;
  riskDetected: boolean;
  memberRequestedHuman: boolean;
  repeatedUnresolvedQuestion: boolean;
};

export type EvidenceReviewDecision = "approved" | "changes_requested" | "escalated";

export const EVIDENCE_AUTO_APPROVAL_MIN_CONFIDENCE = 0.85;

export function decideEvidenceReview(candidate: EvidenceReviewCandidate): EvidenceReviewDecision {
  if (!Number.isFinite(candidate.confidence) || candidate.confidence < EVIDENCE_AUTO_APPROVAL_MIN_CONFIDENCE) return "escalated";
  if (candidate.riskDetected || candidate.memberRequestedHuman || candidate.repeatedUnresolvedQuestion) return "escalated";
  return candidate.criteriaMet ? "approved" : "changes_requested";
}
