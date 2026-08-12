import { describe, expect, it } from "vitest";
import { canDeriveTutorIAContext } from "./domain";
describe("automatic TutorIA context eligibility", () => {
  it("requires both a policy gate and a valid acceptance", () => {
    expect(canDeriveTutorIAContext({ policyEnabled: false, acceptedCurrentVersion: true })).toBe(false);
    expect(canDeriveTutorIAContext({ policyEnabled: true, acceptedCurrentVersion: false })).toBe(false);
    expect(canDeriveTutorIAContext({ policyEnabled: true, acceptedCurrentVersion: true })).toBe(true);
  });
});
