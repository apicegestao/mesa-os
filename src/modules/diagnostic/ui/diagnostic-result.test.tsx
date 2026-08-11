import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DiagnosticResult } from "./diagnostic-result";

describe("DiagnosticResult", () => {
  it("renders the approved score, stage and accessible chart description", () => {
    render(<DiagnosticResult workspace={{
      revisionId: "r1", executionId: "e1", status: "completed", options: [{ value: 4, label: "Com frequência" }],
      answers: { q1: 4 },
      dimensions: [{ id: "d1", code: "financial", label: "Financeiro", position: 1, questions: [{ id: "q1", prompt: "Pergunta financeira", position: 1 }] }],
      result: { ime: 80, stageCode: "autogerenciavel", stageLabel: "Autogerenciável", dimensions: [{ code: "financial", label: "Financeiro", score: 80 }] },
    }} />);
    expect(screen.getByText("80", { selector: ".ime-score" })).toBeInTheDocument();
    expect(screen.getByText("Autogerenciável")).toBeInTheDocument();
    expect(screen.getByText("Financeiro: 80 de 100", { selector: "desc" })).toBeInTheDocument();
  });
});
