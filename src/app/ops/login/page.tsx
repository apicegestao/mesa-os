import { OpsLoginForm, logoutToOpsLogin } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function OpsLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) {
    return <main className="shell"><section className="status login-card"><p className="eyebrow">Mesa dos Donos · operação interna</p><h1>Trocar acesso</h1><p className="summary">Há uma sessão ativa neste navegador. Encerre-a para entrar com o e-mail institucional autorizado.</p><form className="auth-form" action={logoutToOpsLogin}><button type="submit">Encerrar sessão e continuar</button></form></section></main>;
  }

  return <main className="shell"><section className="status login-card"><p className="eyebrow">Mesa dos Donos · operação interna</p><h1>Acesso da equipe</h1><p className="summary">Use o código enviado ao seu e-mail institucional. Este ambiente não dá acesso automático aos dados dos membros.</p><OpsLoginForm /></section></main>;
}
