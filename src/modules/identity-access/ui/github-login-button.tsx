"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/shared/infrastructure/supabase/browser";

export function GitHubLoginButton() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn() {
    setPending(true);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/app` },
    });
    if (error) {
      setPending(false);
      setMessage("Não foi possível iniciar o acesso com GitHub. Tente novamente.");
    }
  }

  return <div className="oauth-access">
    <button type="button" className="github-login" onClick={signIn} disabled={pending}>
      <span aria-hidden="true">GH</span>{pending ? "Conectando…" : "Entrar com GitHub"}
    </button>
    {message && <p className="feedback feedback-error" role="status">{message}</p>}
  </div>;
}
