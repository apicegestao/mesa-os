"use server";

import { revalidatePath } from "next/cache";
import type { Json } from "@/shared/infrastructure/supabase/database.types";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function saveToolDraft(missionId: string, payload: Json) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_mission_tool_draft", {
    target_mission_id: missionId,
    submitted_payload: payload,
  });

  if (error) {
    return {
      ok: false as const,
      message: "Não foi possível salvar o rascunho. Revise os campos e tente novamente.",
    };
  }

  revalidatePath("/app");
  return { ok: true as const, message: "Rascunho salvo." };
}
