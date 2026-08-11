"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function startCycle(priorityId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("start_cycle", {
    target_priority_id: priorityId,
  });

  if (error) {
    return {
      ok: false as const,
      message: "Não foi possível iniciar o ciclo. Tente novamente.",
    };
  }

  revalidatePath("/app");
  return { ok: true as const };
}
