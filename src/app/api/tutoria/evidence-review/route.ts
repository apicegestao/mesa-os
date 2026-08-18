import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildEvidenceAssessmentPrompt, parseEvidenceAssessment, recoveryEvidenceAssessment } from "@/modules/evidence-review/domain/assessment";
import { writeTrustedEvidenceDecision } from "@/modules/evidence-review/server/decision-writer";
import { estimateModelCostUsdMicros, evidenceReviewRequestBudgetAllowed, orientationGatewayEnabled, TUTORIA_EVIDENCE_REVIEW_MAX_COST_USD_MICROS } from "@/modules/tutoria-guidance";
import { loadMesaOSTermsState } from "@/modules/tutoria-consent";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const requestSchema = z.object({ evidenceId: z.string().uuid() });
const MODEL = "gemini-2.5-flash";
const CAPABILITY = "tutoria_evidence_review";

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "invalid_request" }, { status: 400 });
  if (!orientationGatewayEnabled() || !evidenceReviewRequestBudgetAllowed()) return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const actorIdentityId = claims?.claims?.sub;
  if (!actorIdentityId) return NextResponse.json({ code: "authentication_required" }, { status: 401 });
  const { data: membership } = await supabase.from("memberships").select("organization_id,status").eq("identity_id", actorIdentityId).eq("status", "active").maybeSingle();
  if (!membership) return NextResponse.json({ code: "active_membership_required" }, { status: 403 });
  const terms = await loadMesaOSTermsState(supabase);
  if (terms?.latestEvent !== "accepted" || !terms.automationEnabled) return NextResponse.json({ code: "terms_acceptance_required" }, { status: 409 });
  const { data: evidence } = await supabase.from("current_evidence_status").select("id,organization_id,mission_id,evidence_type,description,occurred_on,submitted_by,review_status").eq("id", parsed.data.evidenceId).maybeSingle();
  if (!evidence?.id || !evidence.organization_id || evidence.organization_id !== membership.organization_id || evidence.submitted_by !== actorIdentityId || evidence.review_status !== "submitted" || !evidence.mission_id || !evidence.evidence_type || !evidence.description || !evidence.occurred_on) return NextResponse.json({ code: "evidence_not_found" }, { status: 404 });
  const { count } = await supabase.from("ai_usage_events").select("id", { count: "exact", head: true }).eq("organization_id", membership.organization_id).eq("actor_identity_id", actorIdentityId).eq("capability_code", CAPABILITY).gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((count ?? 0) >= 4) return NextResponse.json({ code: "review_rate_limited" }, { status: 429 });
  const [{ data: mission }, { data: implementation }] = await Promise.all([
    supabase.from("missions").select("title").eq("id", evidence.mission_id).maybeSingle(),
    supabase.from("mission_implementations").select("summary").eq("mission_id", evidence.mission_id).eq("status", "implemented").maybeSingle(),
  ]);
  if (!mission?.title || !implementation?.summary) return NextResponse.json({ code: "review_unavailable" }, { status: 409 });
  const { data: reservationRows, error: reservationError } = await supabase.rpc("reserve_tutoria_member_budget", { requested_capability_code: CAPABILITY, maximum_cost_usd_micros: TUTORIA_EVIDENCE_REVIEW_MAX_COST_USD_MICROS });
  const reservation = reservationRows?.[0];
  const reservationId = reservation?.reservation_id;
  if (reservationError || !reservation?.allowed || !reservationId) return NextResponse.json({ code: "review_budget_unavailable" }, { status: 503 });
  const settleBudget = (cost: number) => supabase.rpc("settle_tutoria_member_budget", { target_reservation_id: reservationId, observed_cost_usd_micros: cost });
  const recordUsage = (resolution: "served" | "unavailable" | "escalated", inputTokens = 0, outputTokens = 0, cost = 0) => supabase.from("ai_usage_events").insert({ organization_id: membership.organization_id, actor_identity_id: actorIdentityId, capability_code: CAPABILITY, model_route_code: "gemini_flash", resolution, input_tokens: inputTokens, output_tokens: outputTokens, estimated_cost_usd_micros: cost });
  try {
    const response = await new GoogleGenAI({}).models.generateContent({ model: MODEL, contents: buildEvidenceAssessmentPrompt({ evidenceType: evidence.evidence_type, description: evidence.description, occurredOn: evidence.occurred_on, implementationSummary: implementation.summary, missionTitle: mission.title }), config: { responseMimeType: "application/json", maxOutputTokens: 420, temperature: 0.1, httpOptions: { timeout: 15_000 } } });
    const inputTokens = Math.max(0, response.usageMetadata?.promptTokenCount ?? 0);
    const outputTokens = Math.max(0, response.usageMetadata?.candidatesTokenCount ?? 0);
    const observedCost = estimateModelCostUsdMicros("gemini_flash", inputTokens, outputTokens);
    const assessment = parseEvidenceAssessment(response.text ?? "") ?? recoveryEvidenceAssessment();
    const written = await writeTrustedEvidenceDecision({ evidenceId: evidence.id, assessment, modelReference: MODEL });
    if (!written.ok) {
      await settleBudget(observedCost);
      await recordUsage("unavailable", inputTokens, outputTokens, observedCost);
      return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
    }
    await settleBudget(observedCost);
    await recordUsage("served", inputTokens, outputTokens, observedCost);
    return NextResponse.json({ outcome: written.outcome, nextMissionId: written.nextMissionId });
  } catch {
    await settleBudget(0);
    await recordUsage("unavailable");
    return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
  }
}
