"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { passwordLoginSchema, type LoginState } from "../domain/auth";

export async function signInWithPassword(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = passwordLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { status: "error", message: "Confira o e-mail e use uma senha com pelo menos 12 caracteres." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: "Não foi possível entrar. Confira seus dados ou use o link de acesso." };
  redirect("/app");
}
