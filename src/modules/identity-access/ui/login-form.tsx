"use client";

import { useActionState } from "react";
import { requestMagicLink } from "../actions/request-magic-link";
import { signInWithPassword } from "../actions/sign-in-with-password";
import type { LoginState } from "../domain/auth";
import { GitHubLoginButton } from "./github-login-button";
import { EmailCodeLogin } from "./email-code-login";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [passwordState, passwordAction, passwordPending] = useActionState(signInWithPassword, initialState);
  const [linkState, linkAction, linkPending] = useActionState(requestMagicLink, initialState);

  return (
    <div className="login-options">
      <EmailCodeLogin />
      <GitHubLoginButton />
      <details className="password-option"><summary>Entrar com senha</summary><form action={passwordAction} className="auth-form">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" minLength={12} maxLength={128} autoComplete="current-password" required />
        <button type="submit" disabled={passwordPending}>{passwordPending ? "Entrando…" : "Entrar"}</button>
        {passwordState.message && <p className={`feedback feedback-${passwordState.status}`} role="status">{passwordState.message}</p>}
      </form></details>
      <details className="magic-link-option"><summary>Usar link de acesso</summary><form action={linkAction} className="auth-form"><label htmlFor="link-email">E-mail</label><input id="link-email" name="email" type="email" autoComplete="email" required /><button type="submit" className="button-secondary" disabled={linkPending}>{linkPending ? "Enviando…" : "Enviar link"}</button>{linkState.message && <p className={`feedback feedback-${linkState.status}`} role="status">{linkState.message}</p>}</form></details>
    </div>
  );
}
