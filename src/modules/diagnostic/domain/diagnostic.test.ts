import { describe, expect, it } from "vitest";
import { calculateResult, isDiagnosticComplete, resultStage, type DiagnosticDimension } from "./diagnostic";

const dimensions: DiagnosticDimension[] = [
  { id: "d1", code: "one", label: "Um", position: 1, questions: [
    { id: "00000000-0000-4000-8000-000000000001", prompt: "Q1", position: 1 },
    { id: "00000000-0000-4000-8000-000000000002", prompt: "Q2", position: 2 },
  ] },
];

describe("diagnostic rules", () => {
  it("requires every question before completion", () => {
    expect(isDiagnosticComplete({ dimensions, answers: { "00000000-0000-4000-8000-000000000001": 5 } })).toBe(false);
  });

  it("calculates the approved integer score", () => {
    const result = calculateResult(dimensions, {
      "00000000-0000-4000-8000-000000000001": 4,
      "00000000-0000-4000-8000-000000000002": 3,
    });
    expect(result.ime).toBe(70);
    expect(result.dimensions[0]?.score).toBe(70);
    expect(result.stageLabel).toBe("Em Maturação");
  });

  it.each([[39, "Empresa Refém"], [40, "Em Transição"], [60, "Em Maturação"], [80, "Autogerenciável"]])(
    "maps %i to its approved stage",
    (score, stage) => expect(resultStage(score)).toBe(stage),
  );
});
