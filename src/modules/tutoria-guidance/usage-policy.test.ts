import { describe, expect, it } from "vitest";
import { evaluateTutorIAUsage } from "./usage-policy";

describe("TutorIA acceptable use policy", () => {
  it("allows only the approved methodology objectives", () => {
    expect(evaluateTutorIAUsage({ objective: "understand_next_step" })).toEqual({ allowed: true, reasonCode: "methodology_objective_allowed", request: { objective: "understand_next_step" } });
  });

  it("rejects free-form, creative and extra payloads before they reach a model", () => {
    expect(evaluateTutorIAUsage({ objective: "make_monkey_sticker" })).toEqual({ allowed: false, reasonCode: "unsupported_or_freeform_request" });
    expect(evaluateTutorIAUsage({ objective: "understand_methodology", question: "crie uma figurinha de macaco" })).toEqual({ allowed: false, reasonCode: "unsupported_or_freeform_request" });
  });
});
