"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function startCycle(priorityId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: cycleId, error } = await supabase.rpc("start_cycle", {
    target_priority_id: priorityId,
  });

  if (error) {
    return {
      ok: false as const,
      message: "Não foi possível iniciar o ciclo. Tente novamente.",
    };
  }

  const { error: missionError } = await supabase.rpc("provision_cycle_missions", {
    target_cycle_id: cycleId,
  });

  if (missionError) {
    return {
      ok: false as const,
      message: "O ciclo foi iniciado, mas a primeira Missão não pôde ser liberada agora. Atualize a página e tente novamente.",
    };
  }

  revalidatePath("/app");
  return { ok: true as const };
}
