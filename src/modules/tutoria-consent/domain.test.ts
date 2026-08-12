import { describe, expect, it } from "vitest";
import { canDeriveTutorIAContext, requiresTutorIAContextChoice } from "./domain";
describe("automatic TutorIA context eligibility", () => {
  it("requires both a policy gate and a valid acceptance", () => {
    expect(canDeriveTutorIAContext({ policyEnabled: false, acceptedCurrentVersion: true })).toBe(false);
    expect(canDeriveTutorIAContext({ policyEnabled: true, acceptedCurrentVersion: false })).toBe(false);
    expect(canDeriveTutorIAContext({ policyEnabled: true, acceptedCurrentVersion: true })).toBe(true);
  });
});

describe("TutorIA context first-access choice", () => {
  it("asks once, then preserves either explicit choice", () => {
    expect(requiresTutorIAContextChoice(null)).toBe(true);
    expect(requiresTutorIAContextChoice("accepted")).toBe(false);
    expect(requiresTutorIAContextChoice("withdrawn")).toBe(false);
  });
});
