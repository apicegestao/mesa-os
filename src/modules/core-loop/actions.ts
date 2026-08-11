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
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("submit_mission_evidence_and_advance", {
    target_mission_id: missionId,
    submitted_evidence_type: type,
    evidence_description: description,
    evidence_date: occurredOn,
  });
  if (error) return { ok: false, message: "Não foi possível registrar a evidência. Confirme a implementação e revise os campos." };
  revalidatePath("/app");
  return { ok: true, message: "Evidência registrada. Missão concluída e próxima Missão liberada." };
}
