"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDiagnostic, startDiagnostic, submitDiagnostic } from "../actions/diagnostic";
import { answeredCount, isDiagnosticComplete, isDimensionComplete, type DiagnosticWorkspace } from "../domain/diagnostic";

export function DiagnosticExperience({ initialWorkspace }: { initialWorkspace: DiagnosticWorkspace }) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, initialWorkspace.dimensions.findIndex((dimension) => !isDimensionComplete(dimension, initialWorkspace.answers))));
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeDimension = workspace.dimensions[activeIndex];
  const count = answeredCount(workspace.answers);
  const total = workspace.dimensions.reduce((sum, dimension) => sum + dimension.questions.length, 0);
  const estimatedMinutes = Math.max(8, Math.ceil(total * 0.375));
  const progress = Math.round((count / total) * 100);
  const complete = isDiagnosticComplete(workspace);
  const tones = ["blue", "gold", "plum", "green", "blue"] as const;

  const optionLabel = useMemo(() => Object.fromEntries(workspace.options.map((option) => [option.value, option.label])), [workspace.options]);

  function begin() {
    setMessage(null);
    startTransition(async () => {
      const result = await startDiagnostic(workspace.revisionId);
      if (!result.ok) return setMessage(result.message);
      if (!result.executionId) return setMessage("Não foi possível iniciar agora. Tente novamente.");
      const executionId = result.executionId;
      setWorkspace((current) => ({ ...current, executionId, status: "draft" }));
    });
  }

  function persist(onSuccess?: () => void) {
    if (!workspace.executionId) return;
    setMessage(null);
    startTransition(async () => {
      const result = await saveDiagnostic(workspace.executionId!, workspace.answers);
      setMessage(result.ok ? "Progresso salvo." : result.message);
      if (result.ok) onSuccess?.();
    });
  }

  function conclude() {
    if (!workspace.executionId || !complete) return;
    setMessage(null);
    startTransition(async () => {
      const result = await submitDiagnostic(workspace.executionId!, workspace.answers);
      if (!result.ok) return setMessage(result.message);
      router.refresh();
    });
  }

  if (workspace.status === "not_started") return <section className="diagnostic-layout">
    <div className="welcome-card card"><p className="eyebrow">Sua próxima ação</p><h1>Descubra o ponto de partida da sua empresa</h1>
      <p>O Raio-X percorre {workspace.dimensions.length} pilares da gestão. São {total} perguntas e leva cerca de {estimatedMinutes} minutos.</p>
      <ul><li>Responda pela prática atual, não pelo que pretende implantar.</li><li>Considere cadência, responsável e evidência de uso ao escolher sua resposta.</li><li>Você pode salvar e continuar depois.</li><li>O resultado fica registrado após a conclusão.</li></ul>
      <button onClick={begin} disabled={isPending}>{isPending ? "Preparando…" : "Iniciar diagnóstico"}</button>
      {message && <p className="feedback feedback-error" role="alert">{message}</p>}
    </div>
  </section>;

  if (!activeDimension) return <p className="feedback feedback-error">O diagnóstico não está disponível.</p>;

  return <section className="diagnostic-layout" aria-labelledby="diagnostic-title">
    <header className="diagnostic-heading"><div><p className="eyebrow">Raio-X do Empresário · Mês 0</p><h1 id="diagnostic-title">Enxergue a empresa com clareza</h1><p>Responda com base na realidade atual. Seu progresso fica visível em cada pilar.</p></div><div className="diagnostic-heading-actions"><button type="button" className="diagnostic-tutoria" disabled title="TutorIA será ativado em incremento próprio">Pedir ajuda à TutorIA</button><span className="status-pill">Rascunho</span></div></header>
    <div className="progress-wrap" aria-label={`${progress}% concluído`}><div><span>{count} de {total} respostas</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
    <nav className="dimension-nav" aria-label="Dimensões do diagnóstico">
      {workspace.dimensions.map((dimension, index) => {
        const dimensionCount = dimension.questions.filter((question) => workspace.answers[question.id] !== undefined).length;
        const dimensionProgress = Math.round((dimensionCount / dimension.questions.length) * 100);
        return <button key={dimension.id} className={index === activeIndex ? "active" : ""} aria-current={index === activeIndex ? "step" : undefined} onClick={() => setActiveIndex(index)}><span>{index + 1}</span><span className="dimension-nav-copy"><strong>{dimension.label}</strong><small>{dimensionCount} de {dimension.questions.length}</small><i className={`dimension-mini-track ${tones[index]}`}><b style={{ width: `${dimensionProgress}%` }} /></i></span></button>;
      })}
    </nav>
    <div className="question-card card">
      <p className="dimension-counter">Dimensão {activeIndex + 1} de {workspace.dimensions.length}</p>
      {activeDimension.questions.map((question, questionIndex) => <fieldset key={question.id} className="question-fieldset">
        <legend><span>{questionIndex + 1}</span>{question.prompt}</legend>
        <div className="scale-options">
          {workspace.options.map((option) => <label key={option.value} className={workspace.answers[question.id] === option.value ? "selected" : ""}>
            <input type="radio" name={question.id} value={option.value} checked={workspace.answers[question.id] === option.value} onChange={() => setWorkspace((current) => ({ ...current, answers: { ...current.answers, [question.id]: option.value } }))} />
            <strong>{option.value}</strong><span>{option.label}</span>
          </label>)}
        </div>
        {workspace.answers[question.id] && <small className="selected-answer">Selecionado: {optionLabel[workspace.answers[question.id] ?? 0]}</small>}
      </fieldset>)}
    </div>
    <div className="diagnostic-actions">
      <button className="button-secondary" onClick={() => persist()} disabled={isPending}>{isPending ? "Salvando…" : "Salvar e sair depois"}</button>
      {activeIndex > 0 && <button className="button-quiet" onClick={() => setActiveIndex((index) => index - 1)}>Anterior</button>}
      {activeIndex < workspace.dimensions.length - 1
        ? <button onClick={() => persist(() => setActiveIndex((index) => index + 1))} disabled={isPending || !isDimensionComplete(activeDimension, workspace.answers)}>Salvar e continuar</button>
        : <button onClick={conclude} disabled={isPending || !complete}>{isPending ? "Concluindo…" : "Concluir e ver resultado"}</button>}
    </div>
    {message && <p className={`feedback ${message === "Progresso salvo." ? "feedback-success" : "feedback-error"}`} role="status">{message}</p>}
  </section>;
}
