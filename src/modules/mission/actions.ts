"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function provisionMissions(cycleId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("provision_cycle_missions", {
    target_cycle_id: cycleId,
  });

  if (error) {
    return {
      ok: false as const,
      message: "Não foi possível preparar as Missões. Tente novamente.",
    };
  }

  revalidatePath("/app");
  return { ok: true as const };
}
