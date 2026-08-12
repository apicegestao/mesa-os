import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SwotWorkbench } from "./swot-workbench";
import { SWOT_WORKBENCH_SPEC } from "./tool-spec";

describe("SWOT workbench", () => {
  it("renders the four strategic quadrants with bounded inputs", () => {
    render(<SwotWorkbench workspace={{ revisionId: "swot-1", spec: SWOT_WORKBENCH_SPEC, payload: {}, updatedAt: null }} />);
    expect(screen.getByRole("heading", { name: "Leitura estratégica SWOT" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Forças" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ameaças" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar leitura SWOT" })).toBeInTheDocument();
  });
});
