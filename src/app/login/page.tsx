import { redirect } from "next/navigation";
import { LoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { getPublicEnv } from "@/shared/config/env";

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
  const env = getPublicEnv();
  const summary = env.NEXT_PUBLIC_EMAIL_CODE_LOGIN_ENABLED
    ? "Informe seu e-mail para receber um código de acesso. Senha e link permanecem como alternativas."
    : "Entre com um método de acesso já autorizado. O código por e-mail será liberado quando este ambiente estiver pronto.";

  return <main className="shell"><section className="status login-card"><p className="eyebrow">Acesso seguro</p><h1>Entrar no Mesa OS</h1><p className="summary">{summary}</p>{feedback && <p className="feedback feedback-error" role="alert">{feedback}</p>}<LoginForm emailCodeEnabled={env.NEXT_PUBLIC_EMAIL_CODE_LOGIN_ENABLED} /></section></main>;
}
