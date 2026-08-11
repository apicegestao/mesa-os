import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToolPanel } from "./tool-panel";

vi.mock("./actions", () => ({ saveToolDraft: vi.fn() }));

describe("ToolPanel", () => {
  it("renders fields from the published schema", () => {
    render(
      <ToolPanel
        missionId="mission-1"
        workspace={{
          name: "Mapa de Papéis e Decisões",
          updatedAt: null,
          entries: [],
          schema: {
            type: "repeatable_object",
            key: "entries",
            minItems: 1,
            maxItems: 20,
            fields: [
              {
                key: "role_name",
                label: "Papel ou área",
                help: "Informe o papel.",
                control: "input",
                required: true,
                maxLength: 80,
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Mapa de Papéis e Decisões" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Papel ou área/)).toHaveAttribute("maxlength", "80");
    expect(screen.getByText(/Salvar não conclui a Missão/)).toBeInTheDocument();
  });
});
