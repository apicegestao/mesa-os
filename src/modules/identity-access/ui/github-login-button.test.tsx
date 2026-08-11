import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GitHubLoginButton } from "./github-login-button";

describe("GitHubLoginButton", () => {
  it("offers GitHub as a direct access method", () => {
    render(<GitHubLoginButton />);
    expect(screen.getByRole("button", { name: "Entrar com GitHub" })).toBeInTheDocument();
  });
});
