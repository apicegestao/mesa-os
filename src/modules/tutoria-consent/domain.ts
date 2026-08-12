export type AutoContextEligibility = { policyEnabled: boolean; acceptedCurrentVersion: boolean };
export function canDeriveTutorIAContext(input: AutoContextEligibility) { return input.policyEnabled && input.acceptedCurrentVersion; }

export function requiresTutorIAContextChoice(latestEvent: "accepted" | "withdrawn" | null) {
  return latestEvent === null;
}
