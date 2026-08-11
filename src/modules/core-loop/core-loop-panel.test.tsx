import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CoreLoopPanel } from "./core-loop-panel";

vi.mock("./actions", () => ({ saveImplementation: vi.fn(), submitEvidence: vi.fn() }));

describe("CoreLoopPanel", () => {
  it("shows implementation as the next action before confirmation", () => {
    render(<CoreLoopPanel missionId="mission-1" workspace={{ implementation: null, evidenceSubmitted: false }} />);
    expect(screen.getByText("Coloque o mapa em prática")).toBeInTheDocument();
    expect(screen.queryByText("Registre uma evidência")).not.toBeInTheDocument();
  });

  it("shows evidence only after implementation confirmation", () => {
    render(<CoreLoopPanel missionId="mission-1" workspace={{ implementation: { status: "implemented", summary: "Papéis comunicados e utilizados na operação.", implementedOn: "2026-08-11" }, evidenceSubmitted: false }} />);
    expect(screen.getByText("Registre uma evidência")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrar evidência e concluir Missão" })).toBeInTheDocument();
  });
});
