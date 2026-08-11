import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MissionPanel } from "./mission-panel";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("./actions", () => ({
  provisionMissions: vi.fn(),
}));

describe("MissionPanel", () => {
  it("shows only the available mission content", () => {
    render(
      <MissionPanel
        cycleId="cycle-1"
        missions={[
          {
            id: "mission-1",
            definition_id: "definition-1",
            position: 1,
            title: "Clareza de papéis e decisões",
            objective: "Tornar explícitas as responsabilidades essenciais.",
            rationale: "Clareza reduz dependência e retrabalho.",
            status: "available",
            completed_at: null,
          },
          {
            id: "mission-2",
            definition_id: "definition-2",
            position: 2,
            title: "Conteúdo protegido",
            objective: "Este conteúdo ainda não deve aparecer.",
            rationale: "A próxima missão permanece bloqueada.",
            status: "locked",
            completed_at: null,
          },
        ]}
      />,
    );

    expect(screen.getByText("Missão 1 de 2")).toBeInTheDocument();
    expect(screen.getByText("Clareza de papéis e decisões")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo protegido")).not.toBeInTheDocument();
  });
});
