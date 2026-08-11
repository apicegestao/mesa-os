import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type MeasuredMetric = { value: number; effectiveOn: string };
export type MeasurementProjection = {
  ime?: MeasuredMetric;
  imeHistory: MeasuredMetric[];
  ownerOperationalHours?: MeasuredMetric;
  ownerDecisionConcentration?: MeasuredMetric;
};

export async function loadMeasurementProjection(supabase: SupabaseClient<Database>, organizationId: string) {
  const { data: observations } = await supabase
    .from("metric_observations")
    .select("definition_id,numeric_value,effective_on")
    .eq("organization_id", organizationId)
    .eq("validation_status", "validated")
    .not("numeric_value", "is", null)
    .order("effective_on", { ascending: false })
    .order("created_at", { ascending: false });
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
  return {
    ime: latest.get("ime"),
    imeHistory: imeHistory.reverse(),
    ownerOperationalHours: latest.get("owner_operational_hours"),
    ownerDecisionConcentration: latest.get("owner_decision_concentration"),
  } satisfies MeasurementProjection;
}
