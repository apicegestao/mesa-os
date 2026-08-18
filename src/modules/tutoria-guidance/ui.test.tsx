import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { TutorIAAssistant } from "./ui";

describe("TutorIA floating conversation", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("opens a contextual conversation without asking the member to select an objective", () => {
    render(<TutorIAAssistant />);
    expect(screen.getByRole("button", { name: "TutorIA" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Como posso ajudar?")).not.toBeInTheDocument();
  });

  it("does not offer a human escalation action in the TutorIA experience", () => {
    render(<TutorIAAssistant />);
    expect(screen.queryByRole("button", { name: "Falar com a equipe" })).not.toBeInTheDocument();
  });

  it("keeps a draft conversation available while the member navigates in the same session", async () => {
    render(<TutorIAAssistant />);
    fireEvent.click(screen.getByRole("button", { name: "TutorIA" }));
    fireEvent.change(screen.getByLabelText("Mensagem para a TutorIA"), { target: { value: "Preciso decidir como organizar meu financeiro." } });
    await waitFor(() => expect(window.sessionStorage.getItem("mesa-os:tutoria:conversation:v1")).toContain("organizar meu financeiro"));
  });
});
