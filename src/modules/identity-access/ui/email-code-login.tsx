"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/shared/infrastructure/supabase/browser";
import { loginSchema } from "../domain/auth";

type Step = "request" | "verify";

const neutralRequestMessage = "Se este e-mail estiver autorizado, enviaremos um código de acesso em instantes.";
const neutralVerifyMessage = "Não foi possível confirmar o código. Solicite um novo e tente novamente.";

export function EmailCodeLogin({ nextPath = "/app" }: { nextPath?: "/app" | "/ops" }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email });
    if (!parsed.success) {
      setMessage("Informe um e-mail válido.");
      return;
    }

    setEmail(parsed.data.email);
    setPending(true);
    setMessage(null);
    try {
      await createSupabaseBrowserClient().auth.signInWithOtp({
        email: parsed.data.email,
        options: { shouldCreateUser: false },
      });
    } catch {
      // A resposta continua neutra para não enumerar e-mails autorizados.
    } finally {
      setPending(false);
      setStep("verify");
      setMessage(neutralRequestMessage);
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d+$/.test(token.trim())) {
      setMessage("Informe somente os algarismos do código recebido por e-mail.");
      return;
    }

    setPending(true);
    setMessage(null);
    const { error } = await createSupabaseBrowserClient().auth.verifyOtp({
      email,
      token: token.trim(),
      type: "email",
    });
    if (error) {
      setPending(false);
      setMessage(neutralVerifyMessage);
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  if (step === "verify") {
    return <form className="auth-form" onSubmit={verifyCode}>
      <p className="auth-code-context">Enviamos um código para <strong>{email}</strong>.</p>
      <label htmlFor="access-code">Código de acesso</label>
      <input id="access-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" value={token} onChange={(event) => setToken(event.target.value.replace(/\D/g, ""))} required />
      <button type="submit" disabled={pending}>{pending ? "Confirmando…" : "Entrar"}</button>
      <button type="button" className="button-quiet" onClick={() => { setStep("request"); setToken(""); setMessage(null); }} disabled={pending}>Usar outro e-mail</button>
      {message && <p className="feedback feedback-error" role="status">{message}</p>}
    </form>;
  }

  return <form className="auth-form" onSubmit={requestCode}>
    <label htmlFor="access-email">Seu e-mail</label>
    <input id="access-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <button type="submit" disabled={pending}>{pending ? "Enviando…" : "Receber código de acesso"}</button>
    {message && <p className="feedback feedback-success" role="status">{message}</p>}
  </form>;
}
