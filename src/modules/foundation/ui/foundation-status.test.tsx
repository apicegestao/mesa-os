import { render, screen } from "@testing-library/react";
import { FoundationStatus } from "./foundation-status";

describe("FoundationStatus", () => {
  it("identifica o bootstrap sem apresentar funcionalidades de negócio", () => {
    render(<FoundationStatus />);
    expect(screen.getByRole("heading", { name: "Mesa OS" })).toBeInTheDocument();
    expect(screen.getByText(/Clean Bootstrap/i)).toBeInTheDocument();
  });
});
