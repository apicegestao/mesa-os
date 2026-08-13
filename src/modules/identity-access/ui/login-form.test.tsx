import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/shared/infrastructure/supabase/browser", () => ({
  createSupabaseBrowserClient: () => ({ auth: { signInWithOtp: vi.fn(), verifyOtp: vi.fn() } }),
}));

describe("member login form", () => {
  it("offers only access by email code", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "Receber código de acesso" })).toBeInTheDocument();
    expect(screen.queryByText(/GitHub|senha|link de acesso/i)).not.toBeInTheDocument();
  });
});
