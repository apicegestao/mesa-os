import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/shared/infrastructure/supabase/database.types";

export type ToolField = {
  key: string;
  label: string;
  help: string;
  control: "input" | "textarea";
  required: boolean;
  maxLength: number;
};

export type ToolSchema = {
  type: "repeatable_object";
  key: "entries";
  minItems: number;
  maxItems: number;
  fields: ToolField[];
};

export type ToolEntry = Record<string, string>;

export type ToolWorkspace = {
  name: string;
  schema: ToolSchema;
  entries: ToolEntry[];
  updatedAt: string | null;
};

export async function loadToolWorkspace(
  supabase: SupabaseClient<Database>,
  missionId: string,
  missionDefinitionId: string,
) {
  const { data: binding } = await supabase
    .from("mission_tool_bindings")
    .select("tool_revision_id,tool_definition_revisions(name,schema)")
    .eq("mission_definition_id", missionDefinitionId)
    .maybeSingle();

  if (!binding) return null;

  const revision = Array.isArray(binding.tool_definition_revisions)
    ? binding.tool_definition_revisions[0]
    : binding.tool_definition_revisions;
  if (!revision) return null;

  const { data: instance } = await supabase
    .from("tool_instances")
    .select("payload,updated_at")
    .eq("mission_id", missionId)
    .maybeSingle();

  const payload = instance?.payload as { entries?: ToolEntry[] } | undefined;
  return {
    name: revision.name,
    schema: revision.schema as ToolSchema,
    entries: payload?.entries ?? [],
    updatedAt: instance?.updated_at ?? null,
  } satisfies ToolWorkspace;
}

export function asToolPayload(entries: ToolEntry[]): Json {
  return { entries };
}
