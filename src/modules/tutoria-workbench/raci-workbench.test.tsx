import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RaciWorkbench } from "./raci-workbench";
import { RACI_WORKBENCH_SPEC } from "./tool-spec";

describe("RACI workbench", () => {
  it("starts with one structured role and lets the owner add another", () => {
    render(<RaciWorkbench workspace={{ revisionId: "raci-1", spec: RACI_WORKBENCH_SPEC, payload: {}, updatedAt: null }} />);
    expect(screen.getByRole("heading", { name: "Mapa de papéis e decisões" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar papel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar mapa de papéis" })).toBeInTheDocument();
  });
});
