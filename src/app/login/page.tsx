import { redirect } from "next/navigation";
import { LoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/app");
  const error = (await searchParams).error;
  const feedback = error === "signup-disabled"
    ? "Este acesso ainda não está liberado para teste. Solicite a criação do seu acesso na homologação."
    : error === "invalid-link"
      ? "Não foi possível concluir o acesso. Tente novamente ou use outra forma de entrada."
      : null;

  return <main className="shell"><section className="status login-card"><p className="eyebrow">Acesso seguro</p><h1>Entrar no Mesa OS</h1><p className="summary">Entre diretamente com sua senha. O link por e-mail permanece como alternativa de recuperação.</p>{feedback && <p className="feedback feedback-error" role="alert">{feedback}</p>}<LoginForm /></section></main>;
}
