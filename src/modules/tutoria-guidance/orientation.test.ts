import { describe, expect, it } from "vitest";
import { buildOrientationPrompt, orientationGatewayEnabled, parseOrientationOutput } from "./orientation";

const state = { diagnosticWorkspace: "available", priority: "defined", cycle: "active", availableMission: "available", evidence: "absent" } as const;
const methodology = { status: "published", stageCount: 4, pillarCount: 4, outcomeCount: 16 } as const;

describe("TutorIA guided orientation contract", () => {
  it("builds a prompt from the derived minimum context only", () => {
    expect(buildOrientationPrompt({ objective: "understand_next_step", memberState: state, methodology })).toContain('"outcomeCount":16');
    expect(buildOrientationPrompt({ objective: "understand_next_step", memberState: state, methodology })).not.toContain("evidence_description");
  });

  it("accepts only the bounded response schema", () => {
    expect(parseOrientationOutput('{"resumo":"Você iniciou o ciclo.","proxima_acao":"Conclua a Missão disponível.","justificativa_metodologica":"A jornada avança por implementação.","confidence_band":"high","escalation_required":false}')).toMatchObject({ confidence_band: "high" });
    expect(parseOrientationOutput('{"resumo":"ok"}')).toBeNull();
  });

  it("keeps model access off unless every server-only gate is present", () => {
    expect(orientationGatewayEnabled({ TUTORIA_ORIENTATION_ENABLED: "true" })).toBe(false);
    expect(orientationGatewayEnabled({ TUTORIA_ORIENTATION_ENABLED: "true", GEMINI_API_KEY: "gateway", GOOGLE_GEMINI_BASE_URL: "https://gateway.example" })).toBe(true);
  });
});
