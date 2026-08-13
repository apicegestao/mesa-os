import { redirect } from "next/navigation";
import { OpsLoginForm } from "@/modules/identity-access";
import { getPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function OpsLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) redirect("/ops");

  const env = getPublicEnv();
  return <main className="shell"><section className="status login-card"><p className="eyebrow">Mesa dos Donos · operação interna</p><h1>Acesso da equipe</h1><p className="summary">Use o código enviado ao seu e-mail institucional. Este ambiente não dá acesso automático aos dados dos membros.</p><OpsLoginForm emailCodeEnabled={env.NEXT_PUBLIC_EMAIL_CODE_LOGIN_ENABLED} /></section></main>;
}
