import { z } from "zod";

const evidenceKindSchema = z.enum(["reported", "calculated", "comparison", "methodology"]);
const deliveryItemSchema = z.object({
  kind: z.enum(["fact", "calculation", "inference", "question", "recommendation"]),
  title: z.string().trim().min(3).max(140),
  detail: z.string().trim().min(8).max(1_500),
  evidence: z.array(z.object({ kind: evidenceKindSchema, reference: z.string().trim().min(2).max(180) })).max(8),
  confidence: z.enum(["high", "medium", "low"]),
}).strict();

export const expertDeliverySchema = z.object({
  summary: z.string().trim().min(12).max(1_200),
  items: z.array(deliveryItemSchema).min(1).max(12),
  nextSteps: z.array(z.string().trim().min(4).max(280)).min(1).max(5),
  limitations: z.array(z.string().trim().min(4).max(280)).max(8),
  escalationRequired: z.boolean(),
}).strict();

export type ExpertDelivery = z.infer<typeof expertDeliverySchema>;

/** Applies the non-negotiable delivery standard independently of the model.
 * Facts/calculations need provenance; inference needs an honest confidence;
 * low confidence must be visible as a limitation or escalated. */
export function validateExpertDelivery(input: unknown): { valid: true; delivery: ExpertDelivery } | { valid: false; reason: string } {
  const parsed = expertDeliverySchema.safeParse(input);
  if (!parsed.success) return { valid: false, reason: "invalid_structure" };
  const delivery = parsed.data;
  for (const item of delivery.items) {
    if (["fact", "calculation"].includes(item.kind) && item.evidence.length === 0) return { valid: false, reason: "missing_evidence" };
    if (item.kind === "inference" && item.confidence === "high" && item.evidence.length === 0) return { valid: false, reason: "unsupported_inference" };
  }
  const hasLowConfidence = delivery.items.some((item) => item.confidence === "low");
  if (hasLowConfidence && !delivery.escalationRequired && delivery.limitations.length === 0) return { valid: false, reason: "low_confidence_not_disclosed" };
  return { valid: true, delivery };
}
