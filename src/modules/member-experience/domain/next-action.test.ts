import { describe, expect, it } from "vitest";
import { deriveNextAction, type MemberJourneyState } from "./next-action";

const completed: MemberJourneyState = { diagnosticStatus: "completed", hasPriority: true, priorityTied: false, hasCycle: true, hasMissions: true, hasAvailableMission: true, hasToolDraft: true, implementationStatus: "implemented" };

describe("deriveNextAction", () => {
  const cases: [MemberJourneyState, string, string][] = [
    [{ ...completed, hasPriority: false, priorityTied: false }, "TutorIA está preparando seu foco", "/app?view=journey#prioridade"],
    [{ ...completed, hasPriority: false, priorityTied: true }, "TutorIA está definindo o ponto de partida", "/app?view=journey#prioridade"],
    [{ ...completed, hasCycle: false }, "Inicie o ciclo de 90 dias", "/app?view=journey#ciclo"],
    [{ ...completed, hasMissions: false }, "Conheça sua primeira Missão", "/app?view=journey#missao"],
    [{ ...completed, hasToolDraft: false }, "Construa a ferramenta da Missão", "/app?view=journey#workspace"],
    [{ ...completed, implementationStatus: "draft" }, "Coloque a ferramenta em prática", "/app?view=journey#implementacao"],
    [completed, "Comprove o avanço", "/app?view=journey#implementacao"],
  ];

  it.each(cases)("derives a reachable canonical next step", (state, title, href) => {
    const action = deriveNextAction(state);
    expect(action.title).toBe(title);
    expect(action.href).toBe(href);
  });
});
