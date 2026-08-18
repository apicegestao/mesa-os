export type EvidenceReviewCandidate = {
  confidence: number;
  criteriaMet: boolean;
  riskDetected: boolean;
  memberRequestedHuman: boolean;
  repeatedUnresolvedQuestion: boolean;
};

export type EvidenceReviewDecision = "approved" | "changes_requested";

export const EVIDENCE_AUTO_APPROVAL_MIN_CONFIDENCE = 0.85;

export function decideEvidenceReview(candidate: EvidenceReviewCandidate): EvidenceReviewDecision {
  // The TutorIA remains the reviewer. Uncertainty is made actionable through a
  // concrete complement request, never by placing the member in a human queue.
  if (!Number.isFinite(candidate.confidence) || candidate.confidence < EVIDENCE_AUTO_APPROVAL_MIN_CONFIDENCE) return "changes_requested";
  if (candidate.riskDetected || candidate.memberRequestedHuman || candidate.repeatedUnresolvedQuestion) return "changes_requested";
  return candidate.criteriaMet ? "approved" : "changes_requested";
}
