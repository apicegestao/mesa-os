"use client";

import { EmailCodeLogin } from "./email-code-login";

export function OpsLoginForm({ emailCodeEnabled }: { emailCodeEnabled: boolean }) {
  if (!emailCodeEnabled) {
    return <p className="feedback feedback-error">O código de acesso ainda não está disponível neste ambiente.</p>;
  }

  return <EmailCodeLogin nextPath="/ops" />;
}
