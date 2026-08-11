import { describe, expect, it } from "vitest";
import { estimateModelCostUsdMicros, TUTORIA_MODEL_ROUTES } from "./model-routes";

describe("TutorIA model routes", () => {
  it("keeps one primary route and prepares alternatives without invoking them", () => {
    expect(TUTORIA_MODEL_ROUTES.gemini_flash.status).toBe("primary");
    expect(TUTORIA_MODEL_ROUTES.gpt5_mini.status).toBe("prepared");
    expect(TUTORIA_MODEL_ROUTES.claude_haiku.status).toBe("prepared");
  });

  it("estimates usage in USD micros using captured token counts", () => {
    expect(estimateModelCostUsdMicros("gemini_flash", 1_000_000, 1_000_000)).toBe(2_800_000);
  });
});
