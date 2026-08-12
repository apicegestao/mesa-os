"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export type TutorIAContextConsentActionState = { status: "idle" | "success" | "error"; message?: string };

export async function activateTutorIAContext(_: TutorIAContextConsentActionState, formData: FormData): Promise<TutorIAContextConsentActionState> {
  const documentVersionId = formData.get("documentVersionId");
  const informed = formData.get("informed");
  if (typeof documentVersionId !== "string" || informed !== "yes") return { status: "error", message: "Leia o aviso e confirme sua escolha antes de continuar." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("activate_my_organization_tutoria_context", { target_document_version_id: documentVersionId });
  if (error) return { status: "error", message: "Não foi possível ativar o contexto do TutorIA agora." };
  revalidatePath("/app");
  return { status: "success", message: "Contexto automático ativado e recibo registrado." };
}

export async function withdrawTutorIAContext(_: TutorIAContextConsentActionState, formData: FormData): Promise<TutorIAContextConsentActionState> {
  const documentVersionId = formData.get("documentVersionId");
  if (typeof documentVersionId !== "string") return { status: "error", message: "Não foi possível identificar a versão do aviso." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("withdraw_my_tutoria_context_consent", { target_document_version_id: documentVersionId });
  if (error) return { status: "error", message: "Não foi possível registrar sua escolha agora." };
  revalidatePath("/app");
  return { status: "success", message: "Preferência registrada. O Mesa OS seguirá sem novas derivações automáticas para sua conta." };
}
