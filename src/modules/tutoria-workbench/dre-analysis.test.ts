import { describe, expect, it } from "vitest";
import { analyzeDre } from "./dre-analysis";

describe("DRE specialist analysis", () => {
  it("separates calculated facts from attention and preserves the source", () => {
    const analysis = analyzeDre({ label: "Julho", revenue: 100_000, variableCosts: 45_000, fixedCosts: 20_000, operatingExpenses: 30_000, financialResult: -2_000, taxes: 1_000 });
    expect(analysis.calculations).toEqual({ grossProfit: 55_000, contributionMarginPct: 0.55, operatingResult: 5_000, netResult: 2_000 });
    expect(analysis.findings).toContainEqual(expect.objectContaining({ code: "net_result", kind: "fact", source: "calculated" }));
  });

  it("does not invent missing figures and turns them into an explicit question", () => {
    const analysis = analyzeDre({ label: "Julho", revenue: 100_000, variableCosts: null, fixedCosts: 20_000, operatingExpenses: 30_000, financialResult: null, taxes: null });
    expect(analysis.calculations.grossProfit).toBeNull();
    expect(analysis.missingData).toEqual(["custos variáveis", "resultado financeiro", "tributos"]);
    expect(analysis.findings).toContainEqual(expect.objectContaining({ code: "missing_data", kind: "question" }));
  });

  it("flags growth that degrades the reported financial result", () => {
    const analysis = analyzeDre(
      { label: "Agosto", revenue: 120_000, variableCosts: 70_000, fixedCosts: 20_000, operatingExpenses: 35_000, financialResult: -3_000, taxes: 1_000 },
      { label: "Julho", revenue: 100_000, variableCosts: 45_000, fixedCosts: 20_000, operatingExpenses: 25_000, financialResult: -1_000, taxes: 1_000 },
    );
    expect(analysis.findings).toContainEqual(expect.objectContaining({ code: "growth_without_result", kind: "attention", source: "comparison" }));
  });
});
