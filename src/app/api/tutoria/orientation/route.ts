import { NextResponse } from "next/server";
import { loadCycle } from "@/modules/cycle";
import { loadDiagnosticWorkspace } from "@/modules/diagnostic";
import { loadPublishedMethodologyMap } from "@/modules/methodology";
import { loadMissions } from "@/modules/mission";
import { loadPriority } from "@/modules/priority";
import { buildTutorIAMemberState, buildTutorIAMethodologySummary, recordTutorIAReadGateway } from "@/modules/tutoria-foundation";
import { buildOrientationPrompt, estimateModelCostUsdMicros, evaluateTutorIAUsage, orientationGatewayEnabled, orientationRequestBudgetAllowed, parseOrientationOutput } from "@/modules/tutoria-guidance";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";

export async function POST(request: Request) {
  const usage = evaluateTutorIAUsage(await request.json().catch(() => null));
  if (!usage.allowed) return NextResponse.json({ code: usage.reasonCode }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const actorIdentityId = claims?.claims?.sub;
  if (!actorIdentityId) return NextResponse.json({ code: "authentication_required" }, { status: 401 });
  const { data: membership } = await supabase.from("memberships").select("organization_id,status").eq("identity_id", actorIdentityId).eq("status", "active").maybeSingle();
  if (!membership) return NextResponse.json({ code: "active_membership_required" }, { status: 403 });

  const workspace = await loadDiagnosticWorkspace(supabase, membership.organization_id);
  const priority = workspace?.status === "completed" ? await loadPriority(supabase, membership.organization_id) : null;
  const cycle = priority ? await loadCycle(supabase, membership.organization_id) : null;
  const missions = cycle ? await loadMissions(supabase, cycle.id) : [];
  const memberState = buildTutorIAMemberState({ hasDiagnosticWorkspace: Boolean(workspace), hasPriority: Boolean(priority), hasActiveCycle: Boolean(cycle), hasAvailableMission: missions.some((mission) => mission.status === "available"), hasSubmittedEvidence: false });
  const methodology = buildTutorIAMethodologySummary(await loadPublishedMethodologyMap(supabase));
  const policy = await recordTutorIAReadGateway({ supabase, authenticatedIdentityId: actorIdentityId, organizationId: membership.organization_id, membershipActive: membership.status === "active", requestedTool: usage.request.objective === "understand_next_step" ? "read_member_state" : "read_methodology_map", sourceCodes: ["member_state", "methodology_summary"], absentFields: methodology.status === "absent" ? ["published_methodology"] : [] });
  if (policy.outcome !== "allow") return NextResponse.json({ code: "orientation_escalated" }, { status: 409 });

  const audit = (event_kind: "invocation_started" | "invocation_finished", outcome: "served" | "unavailable" | "escalated", options: { duration_ms?: number; response_schema_valid?: boolean; failure_code?: string; provider_code?: "netlify_ai_gateway" | "none" } = {}) => supabase.from("tutoria_orientation_audits").insert({ organization_id: membership.organization_id, actor_identity_id: actorIdentityId, objective: usage.request.objective, event_kind, outcome, provider_code: options.provider_code ?? "none", model_code: options.provider_code === "netlify_ai_gateway" ? MODEL : null, response_schema_valid: options.response_schema_valid ?? false, duration_ms: options.duration_ms ?? 0, failure_code: options.failure_code ?? null });

  if (!orientationGatewayEnabled() || !orientationRequestBudgetAllowed()) {
    await audit("invocation_finished", "unavailable", { failure_code: orientationGatewayEnabled() ? "budget_not_configured" : "orientation_not_enabled" });
    return NextResponse.json({ code: "orientation_unavailable" }, { status: 503 });
  }
  const { count } = await supabase.from("tutoria_orientation_audits").select("id", { count: "exact", head: true }).eq("organization_id", membership.organization_id).eq("actor_identity_id", actorIdentityId).gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((count ?? 0) >= 4) {
    await audit("invocation_finished", "escalated", { failure_code: "rate_limited" });
    return NextResponse.json({ code: "orientation_rate_limited" }, { status: 429 });
  }
  const { error: startAuditError } = await audit("invocation_started", "unavailable", { provider_code: "netlify_ai_gateway", failure_code: "model_invocation_started" });
  if (startAuditError) return NextResponse.json({ code: "orientation_escalated" }, { status: 409 });

  const startedAt = Date.now();
  try {
    const baseUrl = process.env.GOOGLE_GEMINI_BASE_URL!.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/v1beta/models/${MODEL}:generateContent`, { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: buildOrientationPrompt({ objective: usage.request.objective, memberState, methodology }) }] }], generationConfig: { responseMimeType: "application/json", maxOutputTokens: 360, temperature: 0.2 } }), signal: AbortSignal.timeout(12_000) });
    const body = await response.json().catch(() => null) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } } | null;
    const text = body?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    const orientation = response.ok ? parseOrientationOutput(text) : null;
    const inputTokens = Math.max(0, body?.usageMetadata?.promptTokenCount ?? 0);
    const outputTokens = Math.max(0, body?.usageMetadata?.candidatesTokenCount ?? 0);
    const recordUsage = (resolution: "served" | "unavailable" | "escalated") => supabase.from("ai_usage_events").insert({ organization_id: membership.organization_id, actor_identity_id: actorIdentityId, capability_code: "tutoria_orientation", model_route_code: "gemini_flash", resolution, input_tokens: inputTokens, output_tokens: outputTokens, estimated_cost_usd_micros: estimateModelCostUsdMicros("gemini_flash", inputTokens, outputTokens) });
    if (!orientation || orientation.confidence_band === "low" || orientation.escalation_required) {
      await audit("invocation_finished", "escalated", { provider_code: "netlify_ai_gateway", duration_ms: Date.now() - startedAt, failure_code: orientation ? "low_confidence" : "invalid_model_output" });
      await recordUsage("escalated");
      return NextResponse.json({ code: "orientation_escalated" }, { status: 409 });
    }
    await audit("invocation_finished", "served", { provider_code: "netlify_ai_gateway", duration_ms: Date.now() - startedAt, response_schema_valid: true });
    await recordUsage("served");
    return NextResponse.json({ orientation });
  } catch {
    await audit("invocation_finished", "unavailable", { provider_code: "netlify_ai_gateway", duration_ms: Date.now() - startedAt, failure_code: "provider_unavailable" });
    return NextResponse.json({ code: "orientation_unavailable" }, { status: 503 });
  }
}
