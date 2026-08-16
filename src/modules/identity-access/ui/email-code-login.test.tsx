import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmailCodeLogin } from "./email-code-login";

const signInWithOtp = vi.fn();
const verifyOtp = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/shared/infrastructure/supabase/browser", () => ({
  createSupabaseBrowserClient: () => ({ auth: { signInWithOtp, verifyOtp }, rpc: vi.fn().mockResolvedValue({ data: [{ active: true }] }) }),
}));

describe("email code login", () => {
  beforeEach(() => {
    signInWithOtp.mockReset().mockResolvedValue({ error: null });
    verifyOtp.mockReset().mockResolvedValue({ error: null });
    replace.mockReset();
    refresh.mockReset();
  });

  it("requests an OTP without allowing user creation", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "Rafael@Mesa.Example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    await vi.waitFor(() => expect(signInWithOtp).toHaveBeenCalledWith({ email: "rafael@mesa.example", options: { shouldCreateUser: false } }));
    expect(await screen.findByLabelText("Código de acesso")).toBeInTheDocument();
  });

  it("keeps the code field available when the request has a transient failure", async () => {
    signInWithOtp.mockRejectedValueOnce(new Error("network"));
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "rafael@mesa.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    expect(await screen.findByLabelText("Código de acesso")).toBeInTheDocument();
    expect(screen.getByText(/Se este e-mail estiver autorizado/)).toBeInTheDocument();
  });

  it("refuses a code that contains no digits before calling Supabase", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "rafael@mesa.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    fireEvent.change(await screen.findByLabelText("Código de acesso"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(verifyOtp).not.toHaveBeenCalled();
  });

  it("routes an authorized internal user to the backoffice after OTP", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "operacao@mesa.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    fireEvent.change(await screen.findByLabelText("Código de acesso"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/ops"));
    expect(verifyOtp).toHaveBeenCalledWith({ email: "operacao@mesa.example", token: "123456", type: "email" });
  });

  it("delegates the configured numeric OTP length to Supabase", async () => {
    render(<EmailCodeLogin />);
    fireEvent.change(screen.getByLabelText("Seu e-mail"), { target: { value: "rafael@mesa.example" } });
    fireEvent.click(screen.getByRole("button", { name: "Receber código de acesso" }));
    fireEvent.change(await screen.findByLabelText("Código de acesso"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await vi.waitFor(() => expect(verifyOtp).toHaveBeenCalledWith({ email: "rafael@mesa.example", token: "12345678", type: "email" }));
  });
});
