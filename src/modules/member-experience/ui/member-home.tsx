import type { NextAction } from "../domain/next-action";

type PulseItem = { label: string; value: string; progress?: number; tone: "blue" | "gold" | "plum" | "green" };

export function MemberHome({
  memberName,
  nextAction,
  cycle,
  priorityLabel,
  missionTitle,
  completedSteps,
  totalSteps,
}: {
  memberName: string;
  nextAction: NextAction;
  cycle: { title: string; starts_on: string; ends_on: string } | null;
  priorityLabel?: string;
  missionTitle?: string;
  completedSteps: number;
  totalSteps: number;
}) {
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const firstName = memberName.trim().split(/\s+/)[0] || "membro";
  const pulse: PulseItem[] = [
    { label: "Core loop", value: `${completedSteps} de ${totalSteps} etapas`, progress, tone: "blue" },
    { label: "Prioridade", value: priorityLabel ?? "Aguardando diagnóstico", tone: "gold" },
    { label: "Missão atual", value: missionTitle ?? "Ainda não definida", tone: "green" },
  ];

  return <section id="hoje" className="member-today" aria-labelledby="today-title">
    <header className="today-greeting">
      <p className="eyebrow">Hoje</p>
      <h1 id="today-title">Bom dia, {firstName}.</h1>
      <p>Seu foco está organizado abaixo: contexto, próxima ação e o que já avançou.</p>
    </header>

    <div className="cycle-overview">
      <article className="cycle-card">
        <div><p className="eyebrow light">Ciclo atual · T1</p><span className="cycle-status">{cycle ? "Em andamento" : "Preparação"}</span></div>
        <h2>{cycle?.title ?? "Fundamentos de gestão"}</h2>
        <p>{cycle ? `${formatDate(cycle.starts_on)} até ${formatDate(cycle.ends_on)}` : "O ciclo começa depois da confirmação da prioridade."}</p>
        <div className="cycle-progress"><i style={{ width: `${progress}%` }} /></div>
        <footer><strong>{progress}% concluído</strong><span>{completedSteps} de {totalSteps} etapas</span></footer>
      </article>

      <article className="result-card">
        <p className="eyebrow">Resultado do ciclo</p>
        <h2>{priorityLabel ?? "Definir o ponto de partida"}</h2>
        <p>{missionTitle ?? "Conclua o Raio-X para que o sistema identifique o foco metodológico inicial."}</p>
        <div className="result-status"><span className="status-dot" />{cycle ? "Ciclo ativo" : "Ainda não medido"}</div>
      </article>
    </div>

    <div className="today-grid">
      <section className="actions-column" aria-labelledby="actions-title">
        <div className="compact-heading"><div><p className="eyebrow">Próximas ações</p><h2 id="actions-title">O que precisa acontecer agora</h2></div><span>1 prioridade</span></div>
        <article className="action-card">
          <span className="action-number">01</span>
          <div className="action-copy"><p className="eyebrow">{nextAction.eyebrow}</p><h3>{nextAction.title}</h3><p>{nextAction.description}</p><div className="action-meta"><span>Foco atual</span><span>Agora</span></div></div>
          <div className="action-buttons"><button type="button" className="tutoria-help" disabled title="TutorIA será ativado em incremento próprio">Pedir ajuda à TutorIA</button><a href={nextAction.href}>{nextAction.label}<span aria-hidden="true">→</span></a></div>
        </article>
      </section>

      <aside className="pulse-card" aria-labelledby="pulse-title">
        <div className="compact-heading"><div><p className="eyebrow">Indicadores-chave</p><h2 id="pulse-title">Pulso do ciclo</h2></div></div>
        <div className="pulse-list">{pulse.map((item) => <div className="pulse-item" key={item.label}><div><span>{item.label}</span><strong>{item.value}</strong></div><div className="pulse-track"><i className={item.tone} style={{ width: item.progress === undefined ? "0%" : `${item.progress}%` }} /></div></div>)}</div>
      </aside>
    </div>
  </section>;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}
