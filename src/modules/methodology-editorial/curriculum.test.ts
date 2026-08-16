import { describe, expect, it } from "vitest";
import { T1_EDITORIAL_CURRICULUM, validateT1EditorialCurriculum } from "./curriculum";

describe("T1 editorial curriculum", () => {
  it("keeps the four canonical T1 units linked to distinct primary tools", () => {
    const result = validateT1EditorialCurriculum(T1_EDITORIAL_CURRICULUM);
    expect(result.success).toBe(true);
    expect(new Set(T1_EDITORIAL_CURRICULUM.map((unit) => unit.primaryToolCode)).size).toBe(4);
  });

  it("keeps every unit measurable and bounded for TutorIA", () => {
    for (const unit of T1_EDITORIAL_CURRICULUM) {
      expect(unit.metrics.length).toBeGreaterThan(0);
      expect(unit.tutorLimits.length).toBeGreaterThan(0);
    }
  });
});
