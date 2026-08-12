import { describe, expect, it } from "vitest";
import { validateExpertDelivery } from "./expert-delivery";

const base = {
  summary: "A margem caiu e a próxima análise deve confirmar a composição dos custos variáveis.",
  items: [{ kind: "calculation", title: "Margem de contribuição", detail: "A margem calculada é menor que no período anterior.", evidence: [{ kind: "calculated", reference: "DRE de agosto" }], confidence: "high" }],
  nextSteps: ["Revisar custo variável por produto."],
  limitations: [],
  escalationRequired: false,
};

describe("TutorIA expert delivery contract", () => {
  it("accepts an actionable and attributable specialist delivery", () => {
    expect(validateExpertDelivery(base)).toEqual({ valid: true, delivery: base });
  });

  it("rejects a factual claim without a source", () => {
    expect(validateExpertDelivery({ ...base, items: [{ ...base.items[0], evidence: [] }] })).toEqual({ valid: false, reason: "missing_evidence" });
  });

  it("requires low confidence to be disclosed or escalated", () => {
    expect(validateExpertDelivery({ ...base, items: [{ ...base.items[0], kind: "inference", confidence: "low", evidence: [] }] })).toEqual({ valid: false, reason: "low_confidence_not_disclosed" });
  });
});
