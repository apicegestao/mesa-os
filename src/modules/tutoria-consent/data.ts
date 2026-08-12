import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

export type TutorIAContextConsentState = {
  documentVersionId: string;
  title: string;
  bodyMarkdown: string;
  contentSha256: string;
  latestEvent: "accepted" | "withdrawn" | null;
  automationEnabled: boolean;
};

export async function loadTutorIAContextConsentState(supabase: SupabaseClient<Database>): Promise<TutorIAContextConsentState | null> {
  const { data, error } = await supabase.rpc("get_my_tutoria_context_consent_state");
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
