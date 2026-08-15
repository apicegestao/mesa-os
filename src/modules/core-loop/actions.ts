"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function saveImplementation(missionId: string, summary: string, implementedOn: string, confirm: boolean) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_mission_implementation", {
    target_mission_id: missionId,
    implementation_summary: summary,
    implementation_date: implementedOn,
    confirm_implementation: confirm,
  });
  if (error) return { ok: false, message: "Não foi possível salvar a implementação. Revise os campos e tente novamente." };
  revalidatePath("/app");
  return { ok: true, message: confirm ? "Implementação confirmada. Agora registre uma evidência." : "Rascunho da implementação salvo." };
}

export async function submitEvidence(missionId: string, type: string, description: string, occurredOn: string) {
  const allowedTypes = new Set(["decision_example", "operational_record", "meeting_routine", "observed_result"]);
  const normalizedDescription = description.trim();
  if (!allowedTypes.has(type)) return { ok: false, message: "Selecione um tipo de evidência válido." };
  if (normalizedDescription.length < 20) return { ok: false, message: "Descreva a evidência com pelo menos 20 caracteres." };
  if (normalizedDescription.length > 1000) return { ok: false, message: "A descrição deve ter no máximo 1.000 caracteres." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurredOn)) return { ok: false, message: "Informe uma data válida para a evidência." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_mission_evidence_for_tutoria_review", {
    target_mission_id: missionId,
    submitted_evidence_type: type,
    evidence_description: normalizedDescription,
    evidence_date: occurredOn,
  });
  if (error) return { ok: false, message: "Não foi possível registrar a evidência. Confirme a implementação e revise os campos." };
  revalidatePath("/app");
  return { ok: true, message: "Evidência registrada. A TutorIA está preparando a decisão de validação." };
}
