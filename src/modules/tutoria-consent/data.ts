import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type MesaOSTermsState = {
  documentVersionId: string;
  title: string;
  bodyMarkdown: string;
  contentSha256: string;
  latestEvent: "accepted" | "withdrawn" | null;
  automationEnabled: boolean;
};

export async function loadMesaOSTermsState(supabase: SupabaseClient<Database>): Promise<MesaOSTermsState | null> {
  const { data, error } = await supabase.rpc("get_my_mesa_os_terms_state");
  if (error || !data?.[0]) return null;
  const state = data[0];
  return {
    documentVersionId: state.document_version_id,
    title: state.title,
    bodyMarkdown: state.body_markdown,
    contentSha256: state.content_sha256,
    latestEvent: state.latest_event,
    automationEnabled: state.automation_enabled,
  };
}
