import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OpsSupportConsole } from "./ops-support-console";

afterEach(() => vi.restoreAllMocks());

describe("OpsSupportConsole", () => {
  it("identifies a TutorIA escalation and confirms a human complement request", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ requests: [{ id: "support-1", organization_name: "Regalo", category: "management_decision", subject: "Revisão de Evidência solicitada pelo TutorIA", status: "open", source_evidence_id: "evidence-1", messages: [] }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ outcome: "changes_requested" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ requests: [] }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<OpsSupportConsole roles={["mentor"]} />);
    expect(await screen.findByText(/Evidência escalada pelo TutorIA/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Decisão humana"), { target: { value: "changes_requested" } });
    fireEvent.change(screen.getByLabelText("Justificativa ao membro"), { target: { value: "Inclua um registro que demonstre a rotina aplicada na empresa." } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar decisão" }));
    expect(await screen.findByText("Complemento solicitado ao membro. O histórico foi preservado.")).toBeInTheDocument();
  });

  it("keeps the methodological decision unavailable to Concierge", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ requests: [{ id: "support-1", organization_name: "Regalo", category: "management_decision", subject: "Revisão de Evidência solicitada pelo TutorIA", status: "open", source_evidence_id: "evidence-1", messages: [] }] }) }));
    render(<OpsSupportConsole roles={["concierge"]} />);
    expect(await screen.findByText(/A decisão metodológica será registrada por Mentor ou Admin/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Registrar decisão" })).not.toBeInTheDocument();
  });
});
