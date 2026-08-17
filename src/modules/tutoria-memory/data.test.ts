import { describe, expect, it } from "vitest";
import { loadTutorIAOrientationContext } from "./data";

describe("TutorIA longitudinal context", () => {
  it("keeps the Supabase client binding when reading the conversation", async () => {
    const memoryQuery = {
      select: () => memoryQuery,
      eq: () => memoryQuery,
      in: () => memoryQuery,
      order: () => memoryQuery,
      limit: async () => ({ data: [{ content: "Ciclo T1 ativo", source_kind: "cycle_started" }] }),
    };
    const client = {
      rest: {},
      from: () => memoryQuery,
      rpc(this: { rest?: unknown }, name: string) {
        if (!this.rest) throw new Error("Supabase client binding was lost");
        expect(name).toBe("get_my_tutoria_conversation");
        return Promise.resolve({ data: [{ role: "member", content: "Como priorizo esta semana?" }], error: null });
      },
    };

    await expect(loadTutorIAOrientationContext(client as never, true)).resolves.toEqual([
      "Ciclo T1 ativo",
      "Membro: Como priorizo esta semana?",
    ]);
  });
});
