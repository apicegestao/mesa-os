"use server";

import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { authRedirectBaseUrl, genericLoginMessage, loginSchema, type LoginState } from "../domain/auth";
import { getPublicEnv } from "@/shared/config/env";

export async function requestMagicLink(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "error", message: "Informe um e-mail válido." };

  const env = getPublicEnv();
  const redirectBaseUrl = authRedirectBaseUrl(env.NEXT_PUBLIC_SITE_URL, process.env.DEPLOY_PRIME_URL, process.env.CONTEXT);
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${redirectBaseUrl}/auth/callback?next=/app`,
    },
  });

  return { status: "sent", message: genericLoginMessage };
}
