"use server";

import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { genericLoginMessage, loginSchema, type LoginState } from "../domain/auth";
import { getPublicEnv } from "@/shared/config/env";

export async function requestMagicLink(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "error", message: "Informe um e-mail válido." };

  const env = getPublicEnv();
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/app`,
    },
  });

  return { status: "sent", message: genericLoginMessage };
}
