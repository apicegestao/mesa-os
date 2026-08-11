"use client";

import { useActionState } from "react";
import { requestMagicLink } from "../actions/request-magic-link";
import type { LoginState } from "../domain/auth";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(requestMagicLink, initialState);

  return (
    <form action={action} className="auth-form">
      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <button type="submit" disabled={pending}>{pending ? "Enviando…" : "Enviar link de acesso"}</button>
      {state.message ? <p className={`feedback feedback-${state.status}`} role="status">{state.message}</p> : null}
    </form>
  );
}
