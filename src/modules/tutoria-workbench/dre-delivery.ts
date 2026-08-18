import { analyzeDre } from "./dre-analysis";
import { validateWorkbenchPayload, DRE_WORKBENCH_SPEC, type WorkbenchPayload } from "./tool-spec";
import type { ExpertDelivery } from "./expert-delivery";

function value(payload: WorkbenchPayload, code: string) {
  const item = payload[code];
  return typeof item === "number" && Number.isFinite(item) ? item : null;
}

/** Builds the auditable factual layer that a future model may explain, but
 * cannot overwrite. This makes every financial conclusion traceable to a
 * reported number or a declared calculation. */
export function buildDreExpertDelivery(payload: WorkbenchPayload): ExpertDelivery | null {
  const validation = validateWorkbenchPayload(DRE_WORKBENCH_SPEC, payload);
  if (!validation.valid) return null;
  const period = typeof payload.period === "string" ? payload.period : "período informado";
  const analysis = analyzeDre({
    label: period,
    revenue: value(payload, "revenue"),
    variableCosts: value(payload, "variable_costs"),
    fixedCosts: value(payload, "fixed_costs"),
    operatingExpenses: value(payload, "operating_expenses"),
    financialResult: value(payload, "financial_result"),
    taxes: value(payload, "taxes"),
  });
  const items: ExpertDelivery["items"] = analysis.findings.map((finding) => ({
    kind: finding.kind === "attention" ? "recommendation" : finding.kind,
    title: finding.code.replaceAll("_", " "),
    detail: finding.message,
    evidence: [{ kind: finding.source, reference: finding.source === "reported" ? "Campos estruturados da DRE" : `Cálculo da DRE — ${period}` }],
    confidence: finding.kind === "question" ? "low" : "high",
  }));
  if (items.length === 0) return null;
  const hasNegativeResult = analysis.findings.some((finding) => finding.code === "negative_result");
  return {
    summary: analysis.missingData.length
      ? `A DRE de ${period} está parcialmente preenchida; a leitura abaixo distingue o que já pode ser calculado do que ainda precisa ser confirmado.`
      : `A DRE de ${period} foi estruturada para uma leitura gerencial com cálculos verificáveis de margem e resultado.`,
    items,
    nextSteps: hasNegativeResult
      ? ["Valide preço, descontos, mix e custos variáveis antes de decidir crescer vendas.", "Revise despesas e estrutura de custos com os responsáveis pelo resultado."]
      : ["Compare esta DRE com o próximo período para identificar tendência de margem e resultado.", "Use os indicadores calculados na próxima decisão financeira do ciclo."],
    limitations: analysis.missingData.length ? [`Dados ainda ausentes: ${analysis.missingData.join(", ")}.`] : [],
    escalationRequired: false,
  };
}
