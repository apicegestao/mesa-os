"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { log } from "@/shared/observability/logger";
import { answersSchema } from "../domain/diagnostic";

type ActionResult = { ok: true; executionId?: string } | { ok: false; message: string };
const genericError = "Não foi possível salvar agora. Tente novamente.";

export async function startDiagnostic(revisionId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("start_diagnostic", { target_revision_id: revisionId });
  if (error || !data) {
    log("warn", "diagnostic.start_failed", { code: error?.code });
    return { ok: false, message: genericError };
  }
  revalidatePath("/app");
  return { ok: true, executionId: data };
}

export async function saveDiagnostic(executionId: string, answers: Record<string, number>): Promise<ActionResult> {
  const parsed = answersSchema.safeParse(answers);
  if (!parsed.success) return { ok: false, message: "Revise as respostas antes de salvar." };
  const payload = Object.entries(parsed.data).map(([question_id, value]) => ({ question_id, value }));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_diagnostic_responses", { target_execution_id: executionId, submitted_answers: payload });
  if (error) {
    log("warn", "diagnostic.save_failed", { code: error.code, executionId });
    return { ok: false, message: genericError };
  }
  revalidatePath("/app");
  return { ok: true };
}

export async function submitDiagnostic(executionId: string, answers: Record<string, number>): Promise<ActionResult> {
  const saved = await saveDiagnostic(executionId, answers);
  if (!saved.ok) return saved;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_diagnostic", { target_execution_id: executionId });
  if (error) {
    log("warn", "diagnostic.submit_failed", { code: error.code, executionId });
    return { ok: false, message: "Responda todas as perguntas antes de concluir." };
  }
  log("info", "diagnostic.completed", { executionId });
  revalidatePath("/app");
  return { ok: true };
}
