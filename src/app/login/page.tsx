import { redirect } from "next/navigation";
import { LoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) {
    const { data: internalAccess } = await supabase.rpc("get_my_internal_operator_state");
    redirect(internalAccess?.[0]?.active ? "/ops" : "/app");
  }
  const error = (await searchParams).error;
  const feedback = error === "signup-disabled"
    ? "Este acesso ainda não está liberado para teste. Solicite a criação do seu acesso na homologação."
    : error === "invalid-link"
      ? "Não foi possível concluir o acesso. Tente novamente ou use outra forma de entrada."
      : null;
  const summary = "Informe seu e-mail para receber um código de acesso. O Mesa OS identifica seu acesso e direciona você automaticamente.";

  return <main className="mesa-access">
    <section className="mesa-access-story" aria-label="Mesa dos Donos">
      <div className="mesa-access-brand"><span className="mesa-bars" aria-hidden="true"><i /><i /><i /></span><span><strong>MESA</strong><small>DOS DONOS</small></span></div>
      <div className="mesa-access-copy">
        <p>Sistema de evolução empresarial</p>
        <h1>Uma trilha. Quatro pilares. Evolução que pode ser provada.</h1>
        <span>O ambiente conecta diagnóstico, desenvolvimento trimestral, ferramentas e evidências em uma única jornada.</span>
      </div>
      <ol className="mesa-access-pillars">
        <li><small>01</small>Financeiro e indicadores</li>
        <li><small>02</small>Equipe, cultura e liderança</li>
        <li><small>03</small>Marketing e vendas</li>
        <li><small>04</small>Processos internos</li>
      </ol>
    </section>
    <section className="mesa-access-entry">
      <div className="mesa-access-card">
        <div className="mesa-access-card-brand"><span className="mesa-bars mesa-bars-dark" aria-hidden="true"><i /><i /><i /></span><span><strong>MESA</strong><small>DOS DONOS</small></span></div>
        <p className="eyebrow">Acesso à plataforma</p>
        <h1>Entre no seu ambiente</h1>
        <p className="summary">{summary}</p>
        {feedback && <p className="feedback feedback-error" role="alert">{feedback}</p>}
        <LoginForm />
        <p className="mesa-access-note"><strong>Acesso inteligente</strong> Seu perfil é identificado após o código e libera somente as permissões correspondentes.</p>
      </div>
    </section>
  </main>;
}
