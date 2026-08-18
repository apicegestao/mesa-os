import type { DiagnosticResult as Result, DiagnosticWorkspace } from "../domain/diagnostic";
import { RadarChart } from "./radar-chart";
import Link from "next/link";

export function DiagnosticResult({ workspace }: { workspace: DiagnosticWorkspace }) {
  const result = workspace.result as Result;
  return <section className="diagnostic-layout" aria-labelledby="result-title">
    <header className="diagnostic-heading">
      <div><p className="eyebrow">Raio-X do Empresário · Mês 0</p><h1 id="result-title">Seu ponto de partida</h1></div>
      <span className="status-pill">Concluído</span>
    </header>
    <div className="result-hero card">
      <p className="result-label">Índice de Maturidade Empresarial</p>
      <strong className="ime-score">{result.ime}</strong>
      <span className="stage-pill">{result.stageLabel}</span>
      <p>Este resultado registra sua leitura de entrada. A prioridade do primeiro ciclo foi definida a partir da dimensão que mais precisa de atenção agora.</p>
      <Link className="diagnostic-result-action" href="/app?view=journey#ciclo">Preparar meu ciclo de 90 dias <span aria-hidden="true">→</span></Link>
    </div>
    <div className="result-grid">
      <section className="card"><h2>Perfil por dimensão</h2><RadarChart dimensions={result.dimensions} /></section>
      <section className="card"><h2>Detalhamento</h2><div className="dimension-results">
        {result.dimensions.map((dimension) => <div key={dimension.code} className="dimension-result">
          <div><span>{dimension.label}</span><strong>{dimension.score}/100</strong></div>
          <div className="score-track"><span style={{ width: `${dimension.score}%` }} /></div>
        </div>)}
      </div></section>
    </div>
    <section className="card response-review"><h2>Suas respostas</h2>
      {workspace.dimensions.map((dimension) => <div key={dimension.id}><h3>{dimension.label}</h3>
        {dimension.questions.map((question) => {
          const value = workspace.answers[question.id];
          return <div className="review-row" key={question.id}><span className="answer-value">{value}</span><div><p>{question.prompt}</p><small>{workspace.options.find((option) => option.value === value)?.label}</small></div></div>;
        })}
      </div>)}
    </section>
  </section>;
}
