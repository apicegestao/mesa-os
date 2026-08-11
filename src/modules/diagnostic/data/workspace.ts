import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { DiagnosticResult, DiagnosticWorkspace } from "../domain/diagnostic";

export async function loadDiagnosticWorkspace(
  supabase: SupabaseClient<Database>,
  organizationId: string,
): Promise<DiagnosticWorkspace | null> {
  const { data: revision, error: revisionError } = await supabase
    .from("diagnostic_revisions")
    .select("id")
    .eq("status", "published")
    .eq("period_code", "m0")
    .maybeSingle();
  if (revisionError || !revision) return null;

  const [{ data: dimensions }, { data: questions }, { data: options }, { data: execution }] = await Promise.all([
    supabase.from("diagnostic_dimensions").select("id,code,label,position").eq("revision_id", revision.id).order("position"),
    supabase.from("diagnostic_questions").select("id,dimension_id,prompt,position").eq("revision_id", revision.id).order("position"),
    supabase.from("diagnostic_options").select("value,label,position").eq("revision_id", revision.id).order("position"),
    supabase.from("diagnostic_executions").select("id,status,result_snapshot").eq("organization_id", organizationId).eq("revision_id", revision.id).maybeSingle(),
  ]);

  const executionId = execution?.id ?? null;
  const { data: responses } = executionId
    ? await supabase.from("diagnostic_responses").select("question_id,value").eq("execution_id", executionId)
    : { data: [] };

  return {
    revisionId: revision.id,
    executionId,
    status: execution?.status ?? "not_started",
    dimensions: (dimensions ?? []).map((dimension) => ({
      ...dimension,
      questions: (questions ?? []).filter((question) => question.dimension_id === dimension.id).map(({ id, prompt, position }) => ({ id, prompt, position })),
    })),
    options: (options ?? []).map(({ value, label }) => ({ value, label })),
    answers: Object.fromEntries((responses ?? []).map((response) => [response.question_id, response.value])),
    result: (execution?.result_snapshot as DiagnosticResult | null) ?? null,
  };
}
