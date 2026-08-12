export type AIUsageEventMetric = {
  organizationId: string;
  actorIdentityId: string;
  capabilityCode: string;
  modelRouteCode: string;
  resolution: "served" | "unavailable" | "escalated";
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsdMicros: number;
};

export type AIUsageInternalSummary = {
  requests: number;
  served: number;
  escalated: number;
  unavailable: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsdMicros: number;
  estimatedCostPerResolutionUsdMicros: number | null;
};

/** Internal-only aggregation. It intentionally never exposes member identity or
 * individual cost data in the member experience. */
export function summarizeAIUsage(events: AIUsageEventMetric[]): AIUsageInternalSummary {
  const summary = events.reduce<Omit<AIUsageInternalSummary, "estimatedCostPerResolutionUsdMicros">>((total, event) => ({
    requests: total.requests + 1,
    served: total.served + Number(event.resolution === "served"),
    escalated: total.escalated + Number(event.resolution === "escalated"),
    unavailable: total.unavailable + Number(event.resolution === "unavailable"),
    inputTokens: total.inputTokens + Math.max(0, event.inputTokens),
    outputTokens: total.outputTokens + Math.max(0, event.outputTokens),
    estimatedCostUsdMicros: total.estimatedCostUsdMicros + Math.max(0, event.estimatedCostUsdMicros),
  }), { requests: 0, served: 0, escalated: 0, unavailable: 0, inputTokens: 0, outputTokens: 0, estimatedCostUsdMicros: 0 });
  return { ...summary, estimatedCostPerResolutionUsdMicros: summary.served ? Math.round(summary.estimatedCostUsdMicros / summary.served) : null };
}
