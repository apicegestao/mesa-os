import { describe, expect, it } from "vitest";
import { memoryFormSchema } from "./domain";
describe("TutorIA memory contract", () => {
  it("accepts only explicit structured memory", () => expect(memoryFormSchema.safeParse({ kind: "decision", content: "Manter margem mínima de 30% nas propostas.", confidence: "90", validUntil: "" }).success).toBe(true));
  it("rejects empty or unsupported memory", () => expect(memoryFormSchema.safeParse({ kind: "chat", content: "", confidence: "101" }).success).toBe(false));
});
