import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DRE_WORKBENCH_SPEC } from "./tool-spec";
import { DreWorkbench } from "./dre-workbench";

describe("DRE workbench", () => {
  it("presents the structured financial fields inside the guided workspace", () => {
    render(<DreWorkbench workspace={{ revisionId: "revision-1", spec: DRE_WORKBENCH_SPEC, payload: {}, updatedAt: null }} />);
    expect(screen.getByRole("heading", { name: "DRE gerencial" })).toBeInTheDocument();
    expect(screen.getByText("Receita líquida *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar rascunho para análise" })).toBeInTheDocument();
  });
});
