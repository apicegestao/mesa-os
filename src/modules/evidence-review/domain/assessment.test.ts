import { describe, expect, it } from "vitest";
import { buildEvidenceAssessmentPrompt, parseEvidenceAssessment, recoveryEvidenceAssessment } from "./assessment";

describe("TutorIA evidence assessment contract", () => {
  const safe = { confidence: 0.9, criteria_met: true, risk_detected: false, member_requested_human: false, repeated_unresolved_question: false, rationale: "A evidência descreve um uso observável e aderente à implementação.", complement_questions: [] };

  it("accepts only valid structured output and applies the independent policy", () => {
    expect(parseEvidenceAssessment(JSON.stringify(safe))?.decision).toBe("approved");
    expect(parseEvidenceAssessment(JSON.stringify({ ...safe, confidence: 0.2 }))?.decision).toBe("changes_requested");
    expect(parseEvidenceAssessment("not-json")).toBeNull();
  });

  it("keeps malformed model output in the autonomous TutorIA loop", () => {
    expect(recoveryEvidenceAssessment().decision).toBe("changes_requested");
  });

  it("keeps the prompt bounded to the evidence and permitted mission context", () => {
    const prompt = buildEvidenceAssessmentPrompt({ evidenceType: "decision_example", description: "A diretoria aplicou o RACI na reunião semanal.", occurredOn: "2026-08-15", implementationSummary: "Papéis registrados", missionTitle: "Clareza de papéis" });
    expect(prompt).toContain("evidence_untrusted");
    expect(prompt).toContain("permitted_context");
    expect(prompt).toContain("Não invente fatos");
  });
});
