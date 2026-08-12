"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { loadWorkbenchWorkspace } from "./data";
import { validateWorkbenchPayload, type WorkbenchPayload } from "./tool-spec";

export async function saveWorkbenchDraft(toolCode: string, payload: WorkbenchPayload) {
  const supabase = await createSupabaseServerClient();
  const workspace = await loadWorkbenchWorkspace(supabase, toolCode);
  if (!workspace) return { ok: false, message: "A ferramenta não está disponível neste momento." };
  const validation = validateWorkbenchPayload(workspace.spec, payload);
  if (!validation.valid) return { ok: false, message: "Revise os campos obrigatórios e os formatos informados." };
  const { error } = await supabase.rpc("save_workbench_tool_draft", { target_tool_revision_id: workspace.revisionId, submitted_payload: validation.payload });
  if (error) return { ok: false, message: "Não foi possível salvar este rascunho agora." };
  revalidatePath("/app");
  return { ok: true, message: "Rascunho salvo. O TutorIA pode usar estes dados para aprofundar sua análise." };
}
