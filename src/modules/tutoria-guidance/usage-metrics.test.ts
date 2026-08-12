import { describe, expect, it } from "vitest";
import { summarizeAIUsage } from "./usage-metrics";

describe("internal AI usage metrics", () => {
  it("keeps cost per successful resolution distinct from failed attempts", () => {
    expect(summarizeAIUsage([
      { organizationId: "org", actorIdentityId: "member", capabilityCode: "tutoria_orientation", modelRouteCode: "gemini_flash", resolution: "served", inputTokens: 10, outputTokens: 5, estimatedCostUsdMicros: 20 },
      { organizationId: "org", actorIdentityId: "member", capabilityCode: "tutoria_orientation", modelRouteCode: "gemini_flash", resolution: "escalated", inputTokens: 8, outputTokens: 3, estimatedCostUsdMicros: 10 },
    ])).toEqual({ requests: 2, served: 1, escalated: 1, unavailable: 0, inputTokens: 18, outputTokens: 8, estimatedCostUsdMicros: 30, estimatedCostPerResolutionUsdMicros: 30 });
  });

  it("reports no cost per resolution when none was served", () => {
    expect(summarizeAIUsage([]).estimatedCostPerResolutionUsdMicros).toBeNull();
  });
});
