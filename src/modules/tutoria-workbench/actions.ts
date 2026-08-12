"use server";

import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { loadWorkbenchWorkspace } from "./data";
import { validateWorkbenchPayload, type WorkbenchPayload } from "./tool-spec";
import { recordTutorIAReadGateway } from "@/modules/tutoria-foundation";
import { buildDreExpertDelivery } from "./dre-delivery";
import { buildDreExplanationPrompt, parseDreExplanation } from "./dre-explanation";
import { dreRequestBudgetAllowed, estimateModelCostUsdMicros, orientationGatewayEnabled, TUTORIA_DRE_MAX_COST_USD_MICROS } from "@/modules/tutoria-guidance";

const MODEL = "gemini-2.5-flash";

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

export async function explainSavedDre() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const actorIdentityId = claims?.claims?.sub;
  if (!actorIdentityId) return { ok: false as const, message: "Entre novamente para aprofundar a análise." };
  const { data: membership } = await supabase.from("memberships").select("organization_id,status").eq("identity_id", actorIdentityId).eq("status", "active").maybeSingle();
  if (!membership) return { ok: false as const, message: "Seu vínculo ativo não foi encontrado." };
  const workspace = await loadWorkbenchWorkspace(supabase, "dre_management_v1");
  const factualDelivery = workspace ? buildDreExpertDelivery(workspace.payload) : null;
  if (!factualDelivery) return { ok: false as const, message: "Salve todos os campos obrigatórios da DRE antes de aprofundar a análise." };
  const policy = await recordTutorIAReadGateway({ supabase, authenticatedIdentityId: actorIdentityId, organizationId: membership.organization_id, membershipActive: true, requestedTool: "read_workbench_tool", sourceCodes: ["workbench_dre_structured", "dre_factual_layer"] });
  if (policy.outcome !== "allow") return { ok: false as const, message: "A análise precisa de uma nova verificação de segurança." };
  const audit = (outcome: "served" | "unavailable" | "escalated", options: { durationMs?: number; valid?: boolean; failureCode?: string; provider?: "netlify_ai_gateway" | "none" } = {}) => supabase.from("tutoria_workbench_analysis_audits").insert({ organization_id: membership.organization_id, actor_identity_id: actorIdentityId, tool_code: "dre_management_v1", provider_code: options.provider ?? "none", model_code: options.provider === "netlify_ai_gateway" ? MODEL : null, outcome, response_schema_valid: options.valid ?? false, duration_ms: options.durationMs ?? 0, failure_code: options.failureCode ?? null });
  if (!orientationGatewayEnabled() || process.env.TUTORIA_DRE_ANALYSIS_ENABLED !== "true" || !dreRequestBudgetAllowed()) {
    await audit("unavailable", { failureCode: "dre_analysis_not_enabled" });
    return { ok: false as const, message: "A análise especializada está em homologação e ainda não está disponível neste ambiente." };
  }
  const { count } = await supabase.from("tutoria_workbench_analysis_audits").select("id", { count: "exact", head: true }).eq("organization_id", membership.organization_id).eq("actor_identity_id", actorIdentityId).gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((count ?? 0) >= 2) { await audit("escalated", { failureCode: "rate_limited" }); return { ok: false as const, message: "Você fez muitas tentativas agora. Aguarde um instante e tente novamente." }; }
  const { data: reservations, error: reservationError } = await supabase.rpc("reserve_tutoria_member_budget", { requested_capability_code: "tutoria_dre_analysis", maximum_cost_usd_micros: TUTORIA_DRE_MAX_COST_USD_MICROS });
  const reservation = reservations?.[0];
  if (reservationError || !reservation?.allowed || !reservation.reservation_id) { await audit("unavailable", { failureCode: reservation?.denial_code ?? "budget_reservation_failed" }); return { ok: false as const, message: "A análise não está disponível dentro do orçamento configurado." }; }
  const startedAt = Date.now();
  try {
    const response = await new GoogleGenAI({}).models.generateContent({ model: MODEL, contents: buildDreExplanationPrompt({ factualDelivery }), config: { responseMimeType: "application/json", maxOutputTokens: 900, temperature: 0.2, httpOptions: { timeout: 20_000 } } });
    const delivery = parseDreExplanation(response.text ?? "", factualDelivery);
    const inputTokens = Math.max(0, response.usageMetadata?.promptTokenCount ?? 0);
    const outputTokens = Math.max(0, response.usageMetadata?.candidatesTokenCount ?? 0);
    const cost = estimateModelCostUsdMicros("gemini_flash", inputTokens, outputTokens);
    await supabase.rpc("settle_tutoria_member_budget", { target_reservation_id: reservation.reservation_id, observed_cost_usd_micros: cost });
    await supabase.from("ai_usage_events").insert({ organization_id: membership.organization_id, actor_identity_id: actorIdentityId, capability_code: "tutoria_dre_analysis", model_route_code: "gemini_flash", resolution: delivery ? "served" : "escalated", input_tokens: inputTokens, output_tokens: outputTokens, estimated_cost_usd_micros: cost });
    if (!delivery || delivery.escalationRequired) { await audit("escalated", { provider: "netlify_ai_gateway", durationMs: Date.now() - startedAt, failureCode: delivery ? "low_confidence" : "invalid_model_output" }); return { ok: false as const, message: "Para aprofundar com segurança, a TutorIA precisa de mais dados ou de apoio humano." }; }
    await audit("served", { provider: "netlify_ai_gateway", durationMs: Date.now() - startedAt, valid: true });
    return { ok: true as const, delivery };
  } catch {
    await supabase.rpc("settle_tutoria_member_budget", { target_reservation_id: reservation.reservation_id, observed_cost_usd_micros: 0 });
    await audit("unavailable", { provider: "netlify_ai_gateway", durationMs: Date.now() - startedAt, failureCode: "provider_unavailable" });
    return { ok: false as const, message: "A análise especializada não está disponível agora. Tente novamente em instantes." };
  }
}
