export type DrePeriod = {
  label: string;
  revenue: number | null;
  variableCosts: number | null;
  fixedCosts: number | null;
  operatingExpenses: number | null;
  financialResult: number | null;
  taxes: number | null;
};

export type DreFinding = {
  kind: "fact" | "attention" | "question";
  code: string;
  message: string;
  source: "reported" | "calculated" | "comparison";
};

export type DreSpecialistAnalysis = {
  period: string;
  calculations: { grossProfit: number | null; contributionMarginPct: number | null; operatingResult: number | null; netResult: number | null };
  findings: DreFinding[];
  missingData: string[];
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
const isAmount = (value: number | null): value is number => typeof value === "number" && Number.isFinite(value);

/** Deterministic financial reading used as factual ground for TutorIA. It never
 * fills missing figures or turns an inference into a reported fact. */
export function analyzeDre(current: DrePeriod, previous?: DrePeriod): DreSpecialistAnalysis {
  const missingData: string[] = [];
  const findings: DreFinding[] = [];
  const requireAmount = (value: number | null, label: string) => {
    if (!isAmount(value)) missingData.push(label);
    return value;
  };
  const revenue = requireAmount(current.revenue, "receita");
  const variableCosts = requireAmount(current.variableCosts, "custos variáveis");
  const fixedCosts = requireAmount(current.fixedCosts, "custos fixos");
  const operatingExpenses = requireAmount(current.operatingExpenses, "despesas operacionais");
  const financialResult = requireAmount(current.financialResult, "resultado financeiro");
  const taxes = requireAmount(current.taxes, "tributos");

  const grossProfit = isAmount(revenue) && isAmount(variableCosts) ? revenue - variableCosts : null;
  const contributionMarginPct = grossProfit !== null && isAmount(revenue) && revenue !== 0 ? grossProfit / revenue : null;
  const operatingResult = grossProfit !== null && isAmount(fixedCosts) && isAmount(operatingExpenses) ? grossProfit - fixedCosts - operatingExpenses : null;
  const netResult = operatingResult !== null && isAmount(financialResult) && isAmount(taxes) ? operatingResult + financialResult - taxes : null;

  if (grossProfit !== null) findings.push({ kind: "fact", code: "gross_profit", source: "calculated", message: `Lucro bruto calculado: ${money.format(grossProfit)}.` });
  if (contributionMarginPct !== null) findings.push({ kind: "fact", code: "contribution_margin", source: "calculated", message: `Margem de contribuição calculada: ${percent.format(contributionMarginPct)}.` });
  if (netResult !== null) findings.push({ kind: "fact", code: "net_result", source: "calculated", message: `Resultado líquido calculado: ${money.format(netResult)}.` });
  if (netResult !== null && netResult < 0) findings.push({ kind: "attention", code: "negative_result", source: "calculated", message: "O período encerra com resultado líquido negativo; valide se a pressão vem de margem, estrutura ou despesas." });
  if (contributionMarginPct !== null && contributionMarginPct < 0) findings.push({ kind: "attention", code: "negative_contribution", source: "calculated", message: "A margem de contribuição é negativa; antes de crescer vendas, revise preço, descontos, mix e custos variáveis." });

  if (previous && isAmount(revenue) && isAmount(previous.revenue) && previous.revenue !== 0) {
    const revenueChange = (revenue - previous.revenue) / Math.abs(previous.revenue);
    findings.push({ kind: "fact", code: "revenue_change", source: "comparison", message: `Receita variou ${percent.format(revenueChange)} em relação a ${previous.label}.` });
    if (revenueChange > 0 && netResult !== null && analyzeDre(previous).calculations.netResult !== null && netResult < analyzeDre(previous).calculations.netResult!) findings.push({ kind: "attention", code: "growth_without_result", source: "comparison", message: "A receita cresceu, mas o resultado líquido piorou; investigue margem, despesas e resultado financeiro." });
  }

  if (missingData.length) findings.push({ kind: "question", code: "missing_data", source: "reported", message: `Para uma leitura completa, ainda preciso de: ${missingData.join(", ")}.` });
  return { period: current.label, calculations: { grossProfit, contributionMarginPct, operatingResult, netResult }, findings, missingData };
}
