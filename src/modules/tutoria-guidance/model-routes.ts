export type ModelRouteCode = "gemini_flash" | "gpt5_mini" | "claude_haiku";

export const TUTORIA_MODEL_ROUTES: Record<ModelRouteCode, { provider: "google" | "openai" | "anthropic"; model: string; inputUsdMicrosPerMillion: number; outputUsdMicrosPerMillion: number; status: "primary" | "prepared" }> = {
  gemini_flash: { provider: "google", model: "gemini-2.5-flash", inputUsdMicrosPerMillion: 300_000, outputUsdMicrosPerMillion: 2_500_000, status: "primary" },
  gpt5_mini: { provider: "openai", model: "gpt-5-mini", inputUsdMicrosPerMillion: 250_000, outputUsdMicrosPerMillion: 2_000_000, status: "prepared" },
  claude_haiku: { provider: "anthropic", model: "claude-haiku-4-5", inputUsdMicrosPerMillion: 1_000_000, outputUsdMicrosPerMillion: 5_000_000, status: "prepared" },
};

export function estimateModelCostUsdMicros(route: ModelRouteCode, inputTokens: number, outputTokens: number) {
  const model = TUTORIA_MODEL_ROUTES[route];
  return Math.ceil((Math.max(0, inputTokens) * model.inputUsdMicrosPerMillion + Math.max(0, outputTokens) * model.outputUsdMicrosPerMillion) / 1_000_000);
}

export const TUTORIA_ORIENTATION_MAX_INPUT_TOKENS = 1_200;
export const TUTORIA_ORIENTATION_MAX_OUTPUT_TOKENS = 360;

export const TUTORIA_ORIENTATION_MAX_COST_USD_MICROS = estimateModelCostUsdMicros("gemini_flash", TUTORIA_ORIENTATION_MAX_INPUT_TOKENS, TUTORIA_ORIENTATION_MAX_OUTPUT_TOKENS);
export const TUTORIA_DRE_MAX_INPUT_TOKENS = 1_800;
export const TUTORIA_DRE_MAX_OUTPUT_TOKENS = 1_200;
export const TUTORIA_DRE_MAX_COST_USD_MICROS = estimateModelCostUsdMicros("gemini_flash", TUTORIA_DRE_MAX_INPUT_TOKENS, TUTORIA_DRE_MAX_OUTPUT_TOKENS);

export const TUTORIA_QUALITY_PROFILES = {
  orientation: { depth: "direct", qualityFloor: "resposta útil e contextual, ou pergunta/escalonamento honesto", capability: "tutoria_orientation" },
  dre_specialist: { depth: "professional", qualityFloor: "fatos e cálculos preservados, recomendações acionáveis e limites explícitos", capability: "tutoria_dre_analysis" },
} as const;

export function orientationRequestBudgetAllowed(env: Partial<Record<"TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST", string | undefined>> = process.env as Partial<Record<"TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST", string | undefined>>) {
  const limit = Number(env.TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST ?? "0");
  return Number.isSafeInteger(limit) && limit >= TUTORIA_ORIENTATION_MAX_COST_USD_MICROS;
}

export function dreRequestBudgetAllowed(env: Partial<Record<"TUTORIA_DRE_MAX_COST_USD_MICROS_PER_REQUEST", string | undefined>> = process.env as Partial<Record<"TUTORIA_DRE_MAX_COST_USD_MICROS_PER_REQUEST", string | undefined>>) {
  const limit = Number(env.TUTORIA_DRE_MAX_COST_USD_MICROS_PER_REQUEST ?? "0");
  return Number.isSafeInteger(limit) && limit >= TUTORIA_DRE_MAX_COST_USD_MICROS;
}
