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
