import type { SupabaseClient } from "@supabase/supabase-js";
import { workbenchToolSpecSchema, type WorkbenchPayload, type WorkbenchToolSpec } from "./tool-spec";
import type { Database, Json } from "@/shared/infrastructure/supabase/database.types";

export type WorkbenchWorkspace = { revisionId: string; spec: WorkbenchToolSpec; payload: WorkbenchPayload; updatedAt: string | null };

function outcome(row: { development_outcomes: { code: string } | { code: string }[] | null }) {
  return Array.isArray(row.development_outcomes) ? row.development_outcomes[0] : row.development_outcomes;
}

export function parseWorkbenchSpec(input: { code: string; version: number; title: string; spec: Json; development_outcomes: { code: string } | { code: string }[] | null }) {
  const item = outcome(input);
  const raw = input.spec as { fields?: unknown; analysis_dimensions?: unknown; export_formats?: unknown };
  return workbenchToolSpecSchema.parse({
    code: input.code, version: input.version, title: input.title, methodologyOutcomeCode: item?.code,
    fields: raw.fields, analysisDimensions: raw.analysis_dimensions, exportFormats: raw.export_formats,
  });
}

export async function loadWorkbenchWorkspace(supabase: SupabaseClient<Database>, code: string): Promise<WorkbenchWorkspace | null> {
  const { data: revision } = await supabase.from("workbench_tool_revisions")
    .select("id,code,version,title,spec,development_outcomes(code)").eq("code", code).eq("status", "published").maybeSingle();
  if (!revision) return null;
  const spec = parseWorkbenchSpec(revision);
  const { data: instance } = await supabase.from("workbench_tool_instances").select("payload,updated_at").eq("tool_revision_id", revision.id).maybeSingle();
  return { revisionId: revision.id, spec, payload: (instance?.payload as WorkbenchPayload | undefined) ?? {}, updatedAt: instance?.updated_at ?? null };
}
