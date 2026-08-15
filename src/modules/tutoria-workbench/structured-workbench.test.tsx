import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StructuredWorkbench } from "./structured-workbench";
import { CRITICAL_PROCESS_MAP_WORKBENCH_SPEC, SALES_FUNNEL_WORKBENCH_SPEC } from "./tool-spec";

describe("structured editorial workbench", () => {
  it("renders the sales funnel revision with a structured opportunity", () => {
    render(<StructuredWorkbench workspace={{ revisionId: "sales-1", spec: SALES_FUNNEL_WORKBENCH_SPEC, payload: {}, updatedAt: null }} />);
    expect(screen.getByRole("heading", { name: "Funil comercial e proposta" })).toBeInTheDocument();
    expect(screen.getByText("Empresa ou oportunidade *")).toBeInTheDocument();
  });

  it("renders the critical-process revision with its primary fields", () => {
    render(<StructuredWorkbench workspace={{ revisionId: "process-1", spec: CRITICAL_PROCESS_MAP_WORKBENCH_SPEC, payload: {}, updatedAt: null }} />);
    expect(screen.getByLabelText("Processo crítico *")).toBeInTheDocument();
    expect(screen.getByText("Ponto de controle *")).toBeInTheDocument();
  });
});
