import { z } from "zod";
import { orientationObjectiveSchema } from "./orientation";

export const orientationRequestSchema = z.object({ objective: orientationObjectiveSchema }).strict();
export type OrientationRequest = z.infer<typeof orientationRequestSchema>;

export type TutorIAUsageDecision =
  | { allowed: true; reasonCode: "methodology_objective_allowed"; request: OrientationRequest }
  | { allowed: false; reasonCode: "unsupported_or_freeform_request" };

/** The first TutorIA capability is intentionally not a general chat. Any field
 * beyond its two methodology objectives is rejected before model invocation. */
export function evaluateTutorIAUsage(input: unknown): TutorIAUsageDecision {
  const parsed = orientationRequestSchema.safeParse(input);
  return parsed.success
    ? { allowed: true, reasonCode: "methodology_objective_allowed", request: parsed.data }
    : { allowed: false, reasonCode: "unsupported_or_freeform_request" };
}
