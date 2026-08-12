"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { loadWorkbenchWorkspace } from "./data";
import { validateWorkbenchPayload, type WorkbenchPayload } from "./tool-spec";
import { recordTutorIAReadGateway } from "@/modules/tutoria-foundation";
import { buildDreExpertDelivery } from "./dre-delivery";

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

/** Returns an auditable DRE reading only after the authenticated member's own
 * saved workspace passes the same validation used for persistence. */
export async function analyzeSavedDre() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const actorIdentityId = claims?.claims?.sub;
  if (!actorIdentityId) return { ok: false as const, message: "Entre novamente para analisar a DRE." };
  const { data: membership } = await supabase.from("memberships").select("organization_id,status").eq("identity_id", actorIdentityId).eq("status", "active").maybeSingle();
  if (!membership) return { ok: false as const, message: "Seu vínculo ativo não foi encontrado." };
  const workspace = await loadWorkbenchWorkspace(supabase, "dre_management_v1");
  if (!workspace) return { ok: false as const, message: "A DRE não está disponível neste momento." };
  const policy = await recordTutorIAReadGateway({
    supabase, authenticatedIdentityId: actorIdentityId, organizationId: membership.organization_id, membershipActive: membership.status === "active",
    requestedTool: "read_workbench_tool", sourceCodes: ["workbench_dre_structured"],
  });
  if (policy.outcome !== "allow") return { ok: false as const, message: "A análise precisa de uma nova verificação de segurança." };
  const delivery = buildDreExpertDelivery(workspace.payload);
  if (!delivery) return { ok: false as const, message: "Salve todos os campos obrigatórios da DRE antes da análise." };
  return { ok: true as const, delivery };
}
