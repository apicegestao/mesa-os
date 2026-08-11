"use server";

import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { passwordSetupSchema, type LoginState } from "../domain/auth";

export async function setPassword(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = passwordSetupSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Use uma senha válida." };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return { status: "error", message: "Sua sessão expirou. Entre novamente antes de criar a senha." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "Não foi possível criar a senha. Use uma combinação diferente e tente novamente." };
  return { status: "success", message: "Senha criada. Nos próximos acessos, entre diretamente com e-mail e senha." };
}
