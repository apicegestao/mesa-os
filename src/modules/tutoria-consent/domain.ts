export type AutoContextEligibility = { policyEnabled: boolean; acceptedCurrentVersion: boolean };
export function canDeriveTutorIAContext(input: AutoContextEligibility) { return input.policyEnabled && input.acceptedCurrentVersion; }
