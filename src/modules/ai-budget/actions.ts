"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { aiBudgetFormSchema, toBudgetPolicyValues, type AIBudgetFormState } from "./domain";
export async function saveMemberAIBudgetPolicy(_state: AIBudgetFormState, formData: FormData): Promise<AIBudgetFormState> {
  const parsed = aiBudgetFormSchema.safeParse({ monthlyLimitBrl: formData.get("monthlyLimitBrl"), usdPerBrl: formData.get("usdPerBrl") });
  if (!parsed.success) return { status: "error", message: "Informe um limite mensal e uma cotação de referência válidos." };
  const supabase = await createSupabaseServerClient(); const { data: claims } = await supabase.auth.getClaims(); const actorId = claims?.claims?.sub;
  if (!actorId) return { status: "error", message: "Sua sessão expirou. Entre novamente." };
  const { data: membership } = await supabase.from("memberships").select("organization_id,role,status").eq("identity_id", actorId).eq("status", "active").maybeSingle();
  if (!membership || membership.role !== "owner") return { status: "error", message: "Somente o responsável da organização pode alterar essa política." };
  const { error } = await supabase.from("ai_member_budget_policy_revisions").insert({ organization_id: membership.organization_id, created_by_identity_id: actorId, effective_at: new Date().toISOString(), ...toBudgetPolicyValues(parsed.data) });
  if (error) return { status: "error", message: "Não foi possível registrar a política agora. Tente novamente." };
  revalidatePath("/app"); return { status: "success", message: "Política de IA atualizada. A alteração ficou registrada no histórico." };
}
