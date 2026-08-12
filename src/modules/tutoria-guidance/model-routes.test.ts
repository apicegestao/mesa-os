import { describe, expect, it } from "vitest";
import { dreRequestBudgetAllowed, estimateModelCostUsdMicros, orientationRequestBudgetAllowed, TUTORIA_DRE_MAX_COST_USD_MICROS, TUTORIA_MODEL_ROUTES } from "./model-routes";

describe("TutorIA model routes", () => {
  it("keeps one primary route and prepares alternatives without invoking them", () => {
    expect(TUTORIA_MODEL_ROUTES.gemini_flash.status).toBe("primary");
    expect(TUTORIA_MODEL_ROUTES.gpt5_mini.status).toBe("prepared");
    expect(TUTORIA_MODEL_ROUTES.claude_haiku.status).toBe("prepared");
  });

  it("estimates usage in USD micros using captured token counts", () => {
    expect(estimateModelCostUsdMicros("gemini_flash", 1_000_000, 1_000_000)).toBe(2_800_000);
  });

  it("blocks inference until a per-request ceiling is explicitly configured", () => {
    expect(orientationRequestBudgetAllowed()).toBe(false);
    expect(orientationRequestBudgetAllowed({ TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST: "1" })).toBe(false);
    expect(orientationRequestBudgetAllowed({ TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST: "2000" })).toBe(true);
  });

  it("requires a separate, adequate budget gate for deeper DRE analysis", () => {
    expect(dreRequestBudgetAllowed()).toBe(false);
    expect(dreRequestBudgetAllowed({ TUTORIA_DRE_MAX_COST_USD_MICROS_PER_REQUEST: String(TUTORIA_DRE_MAX_COST_USD_MICROS - 1) })).toBe(false);
    expect(dreRequestBudgetAllowed({ TUTORIA_DRE_MAX_COST_USD_MICROS_PER_REQUEST: String(TUTORIA_DRE_MAX_COST_USD_MICROS) })).toBe(true);
  });
});
