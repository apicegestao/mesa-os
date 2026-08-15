import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildEvidenceAssessmentPrompt, parseEvidenceAssessment } from "@/modules/evidence-review/domain/assessment";
import { writeTrustedEvidenceDecision } from "@/modules/evidence-review/server/decision-writer";
import { orientationGatewayEnabled } from "@/modules/tutoria-guidance";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const requestSchema = z.object({ evidenceId: z.string().uuid() });
const MODEL = "gemini-2.5-flash";

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ code: "invalid_request" }, { status: 400 });
  if (!orientationGatewayEnabled()) return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ code: "authentication_required" }, { status: 401 });
  const { data: evidence } = await supabase.from("current_evidence_status").select("id,mission_id,evidence_type,description,occurred_on").eq("id", parsed.data.evidenceId).maybeSingle();
  if (!evidence?.id || !evidence.mission_id || !evidence.evidence_type || !evidence.description || !evidence.occurred_on) return NextResponse.json({ code: "evidence_not_found" }, { status: 404 });
  const [{ data: mission }, { data: implementation }] = await Promise.all([
    supabase.from("missions").select("title").eq("id", evidence.mission_id).maybeSingle(),
    supabase.from("mission_implementations").select("summary").eq("mission_id", evidence.mission_id).eq("status", "implemented").maybeSingle(),
  ]);
  if (!mission?.title || !implementation?.summary) return NextResponse.json({ code: "review_unavailable" }, { status: 409 });
  try {
    const response = await new GoogleGenAI({}).models.generateContent({ model: MODEL, contents: buildEvidenceAssessmentPrompt({ evidenceType: evidence.evidence_type, description: evidence.description, occurredOn: evidence.occurred_on, implementationSummary: implementation.summary, missionTitle: mission.title }), config: { responseMimeType: "application/json", maxOutputTokens: 420, temperature: 0.1, httpOptions: { timeout: 15_000 } } });
    const assessment = parseEvidenceAssessment(response.text ?? "");
    if (!assessment) return NextResponse.json({ code: "review_escalated" }, { status: 409 });
    const written = await writeTrustedEvidenceDecision({ evidenceId: evidence.id, assessment, modelReference: MODEL });
    if (!written.ok) return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
    return NextResponse.json({ outcome: written.outcome, nextMissionId: written.nextMissionId });
  } catch {
    return NextResponse.json({ code: "review_unavailable" }, { status: 503 });
  }
}
