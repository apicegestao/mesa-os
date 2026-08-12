"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export type TutorIAContextConsentActionState = { status: "idle" | "success" | "error"; message?: string };

export async function acceptMesaOSTerms(_: TutorIAContextConsentActionState, formData: FormData): Promise<TutorIAContextConsentActionState> {
  const documentVersionId = formData.get("documentVersionId");
  const informed = formData.get("informed");
  if (typeof documentVersionId !== "string" || informed !== "yes") return { status: "error", message: "Leia o aviso e confirme sua escolha antes de continuar." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("accept_my_mesa_os_terms", { target_document_version_id: documentVersionId });
  if (error) return { status: "error", message: "Não foi possível registrar seu aceite agora." };
  revalidatePath("/app");
  return { status: "success", message: "Termos aceitos, contexto do TutorIA ativado e recibo registrado." };
}

export async function withdrawMesaOSTutoriaContext(_: TutorIAContextConsentActionState, formData: FormData): Promise<TutorIAContextConsentActionState> {
  const documentVersionId = formData.get("documentVersionId");
  if (typeof documentVersionId !== "string") return { status: "error", message: "Não foi possível identificar a versão do aviso." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("withdraw_my_mesa_os_tutoria_context", { target_document_version_id: documentVersionId });
  if (error) return { status: "error", message: "Não foi possível registrar sua escolha agora." };
  revalidatePath("/app");
  return { status: "success", message: "Preferência registrada. O Mesa OS seguirá sem novas derivações automáticas para sua conta." };
}
