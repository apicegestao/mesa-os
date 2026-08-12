import { z } from "zod";

export const memoryKinds = ["organization_fact", "decision", "commitment", "learning_gap", "guidance_preference"] as const;
export const memoryKindLabels: Record<(typeof memoryKinds)[number], string> = { organization_fact: "Fato da empresa", decision: "Decisão", commitment: "Compromisso", learning_gap: "Lacuna de aprendizagem", guidance_preference: "Preferência de condução" };
export const memoryFormSchema = z.object({ memoryId: z.string().uuid().optional(), kind: z.enum(memoryKinds), content: z.string().trim().min(3).max(2000), confidence: z.coerce.number().int().min(1).max(100), validUntil: z.string().datetime({ offset: true }).optional().or(z.literal("")) });
export type TutorIAMemory = { id: string; kind: (typeof memoryKinds)[number]; content: string; confidence: number; state: "active" | "contested" | "superseded" | "expired"; validUntil: string | null; version: number; updatedAt: string };
