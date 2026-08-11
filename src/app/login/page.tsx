import { redirect } from "next/navigation";
import { LoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/app");

  return <main className="shell"><section className="status login-card"><p className="eyebrow">Acesso seguro</p><h1>Entrar no Mesa OS</h1><p className="summary">Entre diretamente com sua senha. O link por e-mail permanece como alternativa de recuperação.</p><LoginForm /></section></main>;
}
