import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorIAAssistant } from "./ui";

describe("TutorIA floating conversation", () => {
  it("opens a contextual conversation without asking the member to select an objective", () => {
    render(<TutorIAAssistant />);
    expect(screen.getByRole("button", { name: "TutorIA" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("Como posso ajudar?")).not.toBeInTheDocument();
  });
});
