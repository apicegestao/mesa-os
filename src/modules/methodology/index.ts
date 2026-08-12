import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type PublishedMethodologyMap = {
  stages: { id: string; code: string; label: string; position: number }[];
  pillars: { id: string; code: string; label: string; position: number; outcomes: { id: string; stageId: string; title: string }[] }[];
};

export async function loadPublishedMethodologyMap(supabase: SupabaseClient<Database>) {
  const { data: definition } = await supabase
    .from("methodology_definitions")
    .select("id")
    .eq("code", "mesa_dos_donos")
    .maybeSingle();
  if (!definition) return null;
  const { data: revision } = await supabase
    .from("methodology_revisions")
    .select("id")
    .eq("definition_id", definition.id)
    .eq("status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!revision) return null;
  const [{ data: stages }, { data: pillars }, { data: outcomes }] = await Promise.all([
    supabase.from("methodology_stages").select("id,code,label,position").eq("revision_id", revision.id).order("position"),
    supabase.from("methodology_pillars").select("id,code,label,position").eq("revision_id", revision.id).order("position"),
    supabase.from("development_outcomes").select("id,stage_id,pillar_id,title").eq("revision_id", revision.id),
  ]);
  if (!stages?.length || !pillars?.length || !outcomes?.length) return null;
  return {
    stages: stages.map((stage) => ({ id: stage.id, code: stage.code, label: stage.label, position: stage.position })),
    pillars: pillars.map((pillar) => ({
      id: pillar.id,
      code: pillar.code,
      label: pillar.label,
      position: pillar.position,
      outcomes: outcomes.filter((outcome) => outcome.pillar_id === pillar.id).map((outcome) => ({ id: outcome.id, stageId: outcome.stage_id, title: outcome.title })),
    })),
  } satisfies PublishedMethodologyMap;
}
