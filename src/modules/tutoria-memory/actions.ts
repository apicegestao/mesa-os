"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { memoryFormSchema } from "./domain";

export type MemoryActionState = { status: "idle" | "success" | "error"; message?: string };
export async function saveTutorIAMemory(_: MemoryActionState, formData: FormData): Promise<MemoryActionState> {
  const parsed = memoryFormSchema.safeParse({ memoryId: formData.get("memoryId") || undefined, kind: formData.get("kind"), content: formData.get("content"), confidence: formData.get("confidence"), validUntil: formData.get("validUntil") || "" });
  if (!parsed.success) return { status: "error", message: "Revise o tipo, o conteúdo e a confiança da memória." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_my_tutoria_memory", { target_memory_id: parsed.data.memoryId ?? null, submitted_kind: parsed.data.kind, submitted_content: parsed.data.content, submitted_confidence: parsed.data.confidence, submitted_valid_until: parsed.data.validUntil || null });
  if (error) return { status: "error", message: "Não foi possível registrar esta memória agora." };
  revalidatePath("/app"); return { status: "success", message: "Memória registrada no seu contexto do TutorIA." };
}
export async function invalidateTutorIAMemory(formData: FormData) {
  const memoryId = formData.get("memoryId"); if (typeof memoryId !== "string") return;
  const supabase = await createSupabaseServerClient(); await supabase.rpc("invalidate_my_tutoria_memory", { target_memory_id: memoryId }); revalidatePath("/app");
}
