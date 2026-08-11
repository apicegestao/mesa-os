import { describe, expect, it } from "vitest";
import { deriveNextAction, type MemberJourneyState } from "./next-action";

const completed: MemberJourneyState = { diagnosticStatus: "completed", hasPriority: true, priorityTied: false, hasCycle: true, hasMissions: true, hasAvailableMission: true, hasToolDraft: true, implementationStatus: "implemented" };

describe("deriveNextAction", () => {
  const cases: [MemberJourneyState, string][] = [
    [{ ...completed, hasPriority: false, priorityTied: false }, "Confirme o foco do ciclo"],
    [{ ...completed, hasPriority: false, priorityTied: true }, "Aguardando desempate TutorIA"],
    [{ ...completed, hasCycle: false }, "Inicie o ciclo de 90 dias"],
    [{ ...completed, hasMissions: false }, "Conheça sua primeira Missão"],
    [{ ...completed, hasToolDraft: false }, "Construa a ferramenta da Missão"],
    [{ ...completed, implementationStatus: "draft" }, "Coloque a ferramenta em prática"],
    [completed, "Comprove o avanço"],
  ];

  it.each(cases)("derives the canonical next step", (state, title) => expect(deriveNextAction(state).title).toBe(title));
});
