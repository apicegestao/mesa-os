import { z } from "zod";
import { orientationObjectiveSchema } from "./orientation";

export const orientationRequestSchema = z.object({
  objective: orientationObjectiveSchema,
  question: z.string().trim().min(4).max(1_200).optional(),
}).strict();
export type OrientationRequest = z.infer<typeof orientationRequestSchema>;

export type TutorIAUsageDecision =
  | { allowed: true; reasonCode: "management_question_allowed"; request: OrientationRequest }
  | { allowed: false; reasonCode: "unsupported_request" };

const clearlyOutOfScopeRequest = /\b(figurinha|sticker|meme|piada|poema|desenhe|desenha|gere\s+(uma\s+)?imagem|crie\s+(uma\s+)?imagem)\b/i;

/** Members may describe a real management situation. Obvious entertainment is
 * declined locally; rate and budget gates protect every accepted question. */
export function evaluateTutorIAUsage(input: unknown): TutorIAUsageDecision {
  const parsed = orientationRequestSchema.safeParse(input);
  if (!parsed.success || (parsed.data.question && clearlyOutOfScopeRequest.test(parsed.data.question))) return { allowed: false, reasonCode: "unsupported_request" };
  return { allowed: true, reasonCode: "management_question_allowed", request: parsed.data };
}
