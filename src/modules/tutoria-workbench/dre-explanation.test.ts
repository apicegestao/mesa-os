import { describe, expect, it } from "vitest";
import { buildDreExplanationPrompt, parseDreExplanation } from "./dre-explanation";
import type { ExpertDelivery } from "./expert-delivery";

const factual: ExpertDelivery = { summary: "Base factual da DRE está disponível para leitura.", items: [{ kind: "calculation", title: "margem", detail: "Margem calculada: 30%.", evidence: [{ kind: "calculated", reference: "Cálculo da DRE — 2026-08" }], confidence: "high" }], nextSteps: ["Validar a margem com a operação."], limitations: [], escalationRequired: false };

describe("DRE specialist explanation contract", () => {
  it("keeps the model prompt bounded to the factual layer", () => {
    expect(buildDreExplanationPrompt({ factualDelivery: factual, question: "onde devo olhar?" })).toContain("camada factual");
  });

  it("accepts a grounded enrichment", () => {
    const output = { ...factual, items: [...factual.items, { kind: "recommendation", title: "validar margem", detail: "Revise descontos e custos variáveis antes de ampliar vendas.", evidence: [{ kind: "methodology", reference: "Leitura gerencial da DRE" }], confidence: "medium" }] };
    expect(parseDreExplanation(JSON.stringify(output), factual)?.items).toHaveLength(2);
  });

  it("rejects invented financial facts", () => {
    const output = { ...factual, items: [{ kind: "fact", title: "receita", detail: "A receita cresceu 30%.", evidence: [{ kind: "reported", reference: "DRE" }], confidence: "high" }] };
    expect(parseDreExplanation(JSON.stringify(output), factual)).toBeNull();
  });
});
