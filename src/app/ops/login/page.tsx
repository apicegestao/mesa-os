import { redirect } from "next/navigation";
import { OpsLoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function OpsLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) redirect("/ops");

  return <main className="shell"><section className="status login-card"><p className="eyebrow">Mesa dos Donos · operação interna</p><h1>Acesso da equipe</h1><p className="summary">Use o código enviado ao seu e-mail institucional. Este ambiente não dá acesso automático aos dados dos membros.</p><OpsLoginForm /></section></main>;
}
