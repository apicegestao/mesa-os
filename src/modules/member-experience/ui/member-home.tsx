import type { ReactNode } from "react";
import type { NextAction } from "../domain/next-action";
import { memberGreeting } from "../domain/greeting";

type PulseItem = { label: string; value: string; progress?: number; tone: "blue" | "gold" | "plum" | "green" };

export function MemberHome({
  memberName,
  nextAction,
  additionalActions = [],
  highlightedPending,
  cycle,
  priorityLabel,
  missionTitle,
  completedSteps,
  totalSteps,
  localHour,
}: {
  memberName: string;
  nextAction: NextAction;
  additionalActions?: NextAction[];
  highlightedPending?: ReactNode;
  cycle: { title: string; starts_on: string; ends_on: string } | null;
  priorityLabel?: string;
  missionTitle?: string;
  completedSteps: number;
  totalSteps: number;
  localHour?: number;
}) {
  const progress = Math.round((completedSteps / totalSteps) * 100);
  const actions = [nextAction, ...additionalActions];
  const firstName = memberName.trim().split(/\s+/)[0] || "membro";
  const greeting = memberGreeting(localHour ?? new Date().getHours());
  const pulse: PulseItem[] = [
    { label: "Core loop", value: `${completedSteps} de ${totalSteps} etapas`, progress, tone: "blue" },
    { label: "Prioridade", value: priorityLabel ?? "Aguardando diagnóstico", tone: "gold" },
    { label: "Missão atual", value: missionTitle ?? "Ainda não definida", tone: "green" },
  ];

  return <section id="hoje" className="member-today" aria-labelledby="today-title">
    <header className="today-greeting">
      <p className="eyebrow">Hoje</p>
      <h1 id="today-title">{greeting}, {firstName}.</h1>
      <p>Seu foco está organizado abaixo: contexto, próxima ação e o que já avançou.</p>
    </header>

    <div className="cycle-overview">
      <div className="cycle-column"><article className="cycle-card">
        <div><p className="eyebrow light">Ciclo atual · T1</p><span className="cycle-status">{cycle ? "Em andamento" : "Preparação"}</span></div>
        <h2>{cycle?.title ?? "Fundamentos de gestão"}</h2>
        <p>{cycle ? `${formatDate(cycle.starts_on)} até ${formatDate(cycle.ends_on)}` : "O ciclo começa depois da confirmação da prioridade."}</p>
        <div className="cycle-progress"><i style={{ width: `${progress}%` }} /></div>
        <footer><strong>{progress}% concluído</strong><span>{completedSteps} de {totalSteps} etapas</span></footer>
      </article>{highlightedPending}</div>

      <article className="result-card">
        <p className="eyebrow">Resultado do ciclo</p>
        <h2>{priorityLabel ?? "Definir o ponto de partida"}</h2>
        <p>{missionTitle ?? "Conclua o Raio-X para que o sistema identifique o foco metodológico inicial."}</p>
        <div className="result-status"><span className="status-dot" />{cycle ? "Ciclo ativo" : "Ainda não medido"}</div>
      </article>
    </div>

    <div className="today-grid">
      <section className="actions-column" aria-labelledby="actions-title">
        <div className="compact-heading"><div><p className="eyebrow">Próximas ações</p><h2 id="actions-title">O que precisa acontecer agora</h2></div><span>{actions.length} {actions.length === 1 ? "pendência" : "pendências"}</span></div>
        <div className="action-list">{actions.map((action, index) => <article className="action-card" key={`${action.href}-${action.title}`}>
          <span className="action-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="action-copy"><p className="eyebrow">{action.eyebrow}</p><h3>{action.title}</h3><p>{action.description}</p><div className="action-meta"><span>{index === 0 ? "Foco atual" : "Pendente"}</span><span>{index === 0 ? "Agora" : "Na sequência"}</span></div></div>
          <div className="action-buttons"><a href={action.href}>{action.label}<span aria-hidden="true">→</span></a></div>
        </article>)}</div>
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
