export type ProgressStep = { label: string; complete: boolean; tone: "blue" | "gold" | "plum" | "green" };

export function JourneyProgress({ steps }: { steps: ProgressStep[] }) {
  const completed = steps.filter((step) => step.complete).length;
  return <section className="journey-progress" aria-label={`${completed} de ${steps.length} etapas concluídas`}>
    <div className="progress-summary"><div><p className="eyebrow">Progresso real da jornada</p><strong>{completed} de {steps.length} etapas</strong></div><span>{Math.round((completed / steps.length) * 100)}%</span></div>
    <div className="colored-progress" aria-hidden="true">{steps.map((step) => <i key={step.label} className={`${step.tone} ${step.complete ? "complete" : "pending"}`} />)}</div>
    <div className="progress-labels">{steps.map((step) => <span key={step.label} className={step.complete ? "complete" : ""}>{step.label}</span>)}</div>
  </section>;
}
