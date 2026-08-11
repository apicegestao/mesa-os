import type { DiagnosticResult } from "@/modules/diagnostic/domain/diagnostic";

export function EvolutionProjection({
  diagnosticComplete,
  result,
  completedSteps,
  totalSteps,
  evidenceSubmitted,
}: {
  diagnosticComplete: boolean;
  result?: DiagnosticResult | null;
  completedSteps: number;
  totalSteps: number;
  evidenceSubmitted: boolean;
}) {
  const progress = Math.round((completedSteps / totalSteps) * 100);
  return <section id="evolucao" className="records-page evolution-page" aria-labelledby="evolution-title">
    <header className="records-heading"><p className="eyebrow">Evolução visível</p><h1 id="evolution-title">Evolução da empresa</h1><p>O que amadureceu, o que mudou na operação e quais resultados já foram comprovados.</p></header>
    <div className="evolution-stat-grid"><article className="ime-stat"><span>Índice de Maturidade Empresarial</span><strong>{result?.ime ?? "—"}</strong><small>{diagnosticComplete ? "linha de base registrada" : "aguardando Raio-X"}</small></article><article><span>Progresso do ciclo</span><strong>{progress}%</strong><small>{completedSteps} de {totalSteps} etapas canônicas</small></article><article><span>Mudanças comprovadas</span><strong>{evidenceSubmitted ? 1 : 0}</strong><small>evidências registradas</small></article></div>
    <div className="evolution-detail-grid"><section className="evolution-dimensions"><div className="records-section-title"><div><p className="eyebrow">Maturidade por dimensão</p><h2>Entrada atual</h2></div><span>Sem comparação longitudinal</span></div>{result ? <div className="dimension-comparison">{result.dimensions.map((dimension, index) => <div key={dimension.code}><div><strong>{dimension.label}</strong><span>{dimension.score}</span></div><div className="pulse-track"><i className={["blue","gold","plum","green"][index % 4]} style={{ width: `${dimension.score}%` }} /></div></div>)}</div> : <div className="records-empty"><strong>Aguardando linha de base</strong><p>Conclua o Raio-X para registrar a primeira medição.</p></div>}</section><section className="evolution-milestones"><div className="records-section-title"><div><p className="eyebrow">Marcos comprovados</p><h2>Mudanças que já existem</h2></div></div>{evidenceSubmitted ? <div className="milestone-row"><span>✓</span><div><strong>Primeira mudança comprovada</strong><small>Evidência registrada no ciclo atual</small></div><b>Registrada</b></div> : <div className="records-empty"><strong>Nenhum marco comprovado</strong><p>Esta área será preenchida somente por evidências reais.</p></div>}</section></div>
    <section className="cycle-history"><div className="records-section-title"><div><p className="eyebrow">Histórico de ciclos</p><h2>A transformação ao longo do tempo</h2></div></div><div className="history-row"><strong>Entrada · Mês 0</strong><span>{result ? `IME ${result.ime}` : "Aguardando medição"}</span><span>Linha de base</span><span>{diagnosticComplete ? "Registrada" : "Pendente"}</span></div><div className="history-row muted"><strong>Próxima medição</strong><span>Protegida</span><span>Requer marco metodológico</span><span>Sem dados ainda</span></div></section>
  </section>;
}
