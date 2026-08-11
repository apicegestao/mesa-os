"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { log } from "@/shared/observability/logger";
import { rationaleSchema } from "../domain/priority";

export async function confirmPriority(executionId: string, rationale: string) {
  const parsed = rationaleSchema.safeParse(rationale);
  if (!parsed.success) return { ok: false as const, message: "Explique em pelo menos 10 caracteres por que esta prioridade importa agora." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("confirm_priority", { target_execution_id: executionId, priority_rationale: parsed.data });
  if (error) {
    log("warn", "priority.confirm_failed", { code: error.code, executionId });
    return { ok: false as const, message: error.code === "23514" ? "Há um empate. O desempate pelo TutorIA será definido em um próximo incremento." : "Não foi possível confirmar agora. Tente novamente." };
  }
  log("info", "priority.confirmed", { executionId });
  revalidatePath("/app");
  return { ok: true as const };
}
