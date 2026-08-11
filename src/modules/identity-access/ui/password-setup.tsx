"use client";

import { useActionState } from "react";
import { setPassword } from "../actions/set-password";
import type { LoginState } from "../domain/auth";

const initialState: LoginState = { status: "idle" };

export function PasswordSetup() {
  const [state, action, pending] = useActionState(setPassword, initialState);
  return <section id="seguranca" className="security-card" aria-labelledby="security-title">
    <div><p className="eyebrow">Acesso sem espera</p><h2 id="security-title">Crie sua senha de acesso</h2><p>Use a sessão atual para definir uma senha. O link por e-mail continuará disponível como recuperação.</p></div>
    <form action={action} className="password-setup-form">
      <label htmlFor="new-password">Nova senha</label>
      <input id="new-password" name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required />
      <label htmlFor="confirm-password">Confirmar senha</label>
      <input id="confirm-password" name="confirmation" type="password" minLength={12} maxLength={128} autoComplete="new-password" required />
      <button type="submit" disabled={pending}>{pending ? "Salvando…" : "Criar senha"}</button>
      {state.message && <p className={`feedback feedback-${state.status}`} role="status">{state.message}</p>}
    </form>
  </section>;
}
