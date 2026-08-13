import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmailCodeLogin } from "./email-code-login";

const signInWithOtp = vi.fn();
const verifyOtp = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/shared/infrastructure/supabase/browser", () => ({
  createSupabaseBrowserClient: () => ({ auth: { signInWithOtp, verifyOtp } }),
}));

describe("email code login", () => {
  beforeEach(() => {
    signInWithOtp.mockReset().mockResolvedValue({ error: null });
    verifyOtp.mockReset();
  });

  it("requests an OTP without allowing user creation", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "Rafael@Mesa.Example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    await vi.waitFor(() => expect(signInWithOtp).toHaveBeenCalledWith({ email: "rafael@mesa.example", options: { shouldCreateUser: false } }));
    expect(await screen.findByLabelText("Código de acesso")).toBeInTheDocument();
  });

  it("refuses malformed codes before calling Supabase", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "rafael@mesa.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    fireEvent.change(await screen.findByLabelText("Código de acesso"), { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(verifyOtp).not.toHaveBeenCalled();
  });
});
