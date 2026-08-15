import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CoreLoopPanel } from "./core-loop-panel";

vi.mock("./actions", () => ({ saveImplementation: vi.fn(), submitEvidence: vi.fn(), submitEvidenceRevision: vi.fn() }));

describe("CoreLoopPanel", () => {
  it("shows implementation as the next action before confirmation", () => {
    render(<CoreLoopPanel missionId="mission-1" workspace={{ implementation: null, evidenceSubmitted: false }} />);
    expect(screen.getByText("Coloque o mapa em prática")).toBeInTheDocument();
    expect(screen.queryByText("Registre uma evidência")).not.toBeInTheDocument();
  });

  it("shows evidence only after implementation confirmation", () => {
    render(<CoreLoopPanel missionId="mission-1" workspace={{ implementation: { status: "implemented", summary: "Papéis comunicados e utilizados na operação.", implementedOn: "2026-08-11" }, evidenceSubmitted: false }} />);
    expect(screen.getByText("Registre uma evidência")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrar evidência para análise" })).toBeDisabled();
    expect(screen.getByText(/Mínimo de 20 caracteres/)).toBeInTheDocument();
  });

  it("holds a pending evidence and offers a versioned resend only after correction is requested", () => {
    const implementation = { status: "implemented" as const, summary: "Papéis comunicados e utilizados na operação.", implementedOn: "2026-08-11" };
    const { rerender } = render(<CoreLoopPanel missionId="mission-1" workspace={{ implementation, evidenceSubmitted: true, evidenceStatus: "submitted", evidenceId: "evidence-1" }} />);
    expect(screen.getByText("Evidência em análise")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Registrar evidência para análise" })).not.toBeInTheDocument();
    rerender(<CoreLoopPanel missionId="mission-1" workspace={{ implementation, evidenceSubmitted: true, evidenceStatus: "changes_requested", evidenceId: "evidence-1" }} />);
    expect(screen.getByText("Envie o complemento solicitado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reenviar para análise" })).toBeDisabled();
  });
});
