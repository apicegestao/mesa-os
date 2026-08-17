import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";
import type { DiagnosticResult, DiagnosticWorkspace } from "../domain/diagnostic";

type RevisionCandidate = { id: string; status: Database["public"]["Enums"]["diagnostic_revision_status"]; version: number };
type ExecutionCandidate = { revision_id: string; updated_at: string };

/**
 * Existing organizations keep the questionnaire that produced their diagnosis.
 * Organizations without an execution receive the newest published definition.
 */
export function selectDiagnosticRevision(
  revisions: RevisionCandidate[],
  executions: ExecutionCandidate[],
) {
  const revisionsById = new Map(revisions.map((revision) => [revision.id, revision]));
  const existing = [...executions]
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
    .map((execution) => revisionsById.get(execution.revision_id))
    .find(Boolean);

  if (existing) return existing;
  return revisions
    .filter((revision) => revision.status === "published")
    .sort((left, right) => right.version - left.version)[0] ?? null;
}

export async function loadDiagnosticWorkspace(
  supabase: SupabaseClient<Database>,
  organizationId: string,
): Promise<DiagnosticWorkspace | null> {
  const { data: definition, error: definitionError } = await supabase
    .from("diagnostic_definitions")
    .select("id")
    .eq("code", "raio_x_empresario")
    .maybeSingle();
  if (definitionError || !definition) return null;

  const { data: revisions, error: revisionsError } = await supabase
    .from("diagnostic_revisions")
    .select("id,status,version")
    .eq("definition_id", definition.id)
    .in("status", ["published", "retired"]);
  if (revisionsError || !revisions?.length) return null;

  const { data: executions } = await supabase
    .from("diagnostic_executions")
    .select("id,revision_id,status,result_snapshot,updated_at")
    .eq("organization_id", organizationId)
    .in("revision_id", revisions.map((revision) => revision.id))
    .order("updated_at", { ascending: false });

  const revision = selectDiagnosticRevision(revisions, executions ?? []);
  if (!revision) return null;
  const execution = (executions ?? []).find((candidate) => candidate.revision_id === revision.id) ?? null;

  const [{ data: dimensions }, { data: questions }, { data: options }] = await Promise.all([
    supabase.from("diagnostic_dimensions").select("id,code,label,position").eq("revision_id", revision.id).order("position"),
    supabase.from("diagnostic_questions").select("id,dimension_id,prompt,position").eq("revision_id", revision.id).order("position"),
    supabase.from("diagnostic_options").select("value,label,position").eq("revision_id", revision.id).order("position"),
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
