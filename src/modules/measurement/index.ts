import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type MeasuredMetric = { value: number; effectiveOn: string };
export type MeasurementProjection = {
  ime?: MeasuredMetric;
  imeHistory: MeasuredMetric[];
  ownerOperationalHours?: MeasuredMetric;
  ownerDecisionConcentration?: MeasuredMetric;
  dimensionComparison: Array<{ code: string; label: string; baseline: number; current?: number; effectiveOn?: string }>;
};

export async function loadMeasurementProjection(supabase: SupabaseClient<Database>, organizationId: string) {
  const [{ data: observations }, { data: diagnostics }] = await Promise.all([supabase
    .from("metric_observations")
    .select("definition_id,numeric_value,effective_on")
    .eq("organization_id", organizationId)
    .eq("validation_status", "validated")
    .not("numeric_value", "is", null)
    .order("effective_on", { ascending: false })
    .order("created_at", { ascending: false }), supabase
    .from("diagnostic_executions")
    .select("episode_type,effective_on,result_snapshot")
    .eq("organization_id", organizationId)
    .eq("status", "completed")
    .not("result_snapshot", "is", null)
    .order("effective_on", { ascending: true })]);
  const definitionIds = [...new Set((observations ?? []).map((item) => item.definition_id))];
  const { data: definitions } = definitionIds.length
    ? await supabase.from("metric_definitions").select("id,code").in("id", definitionIds)
    : { data: [] };
  const codeByDefinition = new Map((definitions ?? []).map((definition) => [definition.id, definition.code]));
  const latest = new Map<string, MeasuredMetric>();
  const imeHistory: MeasuredMetric[] = [];
  for (const observation of observations ?? []) {
    const code = codeByDefinition.get(observation.definition_id);
    if (!code || observation.numeric_value === null) continue;
    const measured = { value: Number(observation.numeric_value), effectiveOn: observation.effective_on };
    if (!latest.has(code)) latest.set(code, measured);
    if (code === "ime") imeHistory.push(measured);
  }
  const parsedDiagnostics = (diagnostics ?? []).flatMap((diagnostic) => {
    const snapshot = diagnostic.result_snapshot as { dimensions?: Array<{ code?: string; label?: string; score?: number }> } | null;
    const dimensions = snapshot?.dimensions?.filter((dimension) => typeof dimension.code === "string" && typeof dimension.label === "string" && typeof dimension.score === "number") ?? [];
    return dimensions.length ? [{ episodeType: diagnostic.episode_type, effectiveOn: diagnostic.effective_on, dimensions: dimensions as Array<{ code: string; label: string; score: number }> }] : [];
  });
  const baseline = parsedDiagnostics.find((diagnostic) => diagnostic.episodeType === "entry") ?? parsedDiagnostics[0];
  const current = parsedDiagnostics.at(-1);
  const hasComparison = Boolean(baseline && current && current !== baseline);
  const currentByCode = new Map((hasComparison && current ? current.dimensions : []).map((dimension) => [dimension.code, dimension]));
  return {
    ime: latest.get("ime"),
    imeHistory: imeHistory.reverse(),
    ownerOperationalHours: latest.get("owner_operational_hours"),
    ownerDecisionConcentration: latest.get("owner_decision_concentration"),
    dimensionComparison: (baseline?.dimensions ?? []).map((dimension) => ({ code: dimension.code, label: dimension.label, baseline: dimension.score, current: currentByCode.get(dimension.code)?.score, effectiveOn: hasComparison ? current?.effectiveOn : undefined })),
  } satisfies MeasurementProjection;
}
