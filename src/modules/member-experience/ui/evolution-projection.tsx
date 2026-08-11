import type { DiagnosticResult } from "@/modules/diagnostic/domain/diagnostic";
import type { CSSProperties } from "react";

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
  return <section id="evolucao" className="records-page evolution-page" aria-labelledby="evolution-title">
    <header className="records-heading"><p className="eyebrow">Evolução visível</p><h1 id="evolution-title">Evolução da empresa</h1><p>O que amadureceu, o que mudou na operação e quais resultados já foram comprovados.</p></header>
    <div className="evolution-stat-grid"><article className="ime-stat"><span>Índice de Maturidade Empresarial</span><strong>{result?.ime ?? "—"}</strong><small>{diagnosticComplete ? "linha de base registrada" : "aguardando Raio-X"}</small><i className="ime-ring" style={{ "--ime": `${result?.ime ?? 0}%` } as CSSProperties} /></article><article className="impact-stat"><span>Impacto do ciclo</span><div><strong>Ainda não medido</strong><small>Horas liberadas e concentração de decisões serão apuradas em uma reanálise válida.</small></div></article><article className="next-analysis-stat"><span>Próxima reanálise</span><strong>Protegida</strong><small>Sem data metodológica autorizada</small></article></div>
    <div className="evolution-detail-grid"><section className="evolution-dimensions"><div className="records-section-title"><div><p className="eyebrow">Maturidade por dimensão</p><h2>Entrada × situação atual</h2></div><span>Atual ainda não medido</span></div>{result ? <div className="dimension-comparison">{result.dimensions.map((dimension, index) => <div key={dimension.code}><div><strong>{dimension.label}</strong><span>Entrada {dimension.score} · Atual —</span></div><div className="comparison-track"><i className="baseline" style={{ width: `${dimension.score}%` }} /><b className={["blue","gold","plum","green"][index % 4]} style={{ width: "0%" }} /></div></div>)}</div> : <div className="records-empty"><strong>Aguardando linha de base</strong><p>Conclua o Raio-X para registrar a primeira medição.</p></div>}</section><section className="evolution-milestones"><div className="records-section-title"><div><p className="eyebrow">Marcos comprovados</p><h2>Mudanças que já existem</h2></div><span>{evidenceSubmitted ? "1 validado" : "0 validados"}</span></div>{evidenceSubmitted ? <div className="milestone-row"><span>✓</span><div><strong>Primeira mudança comprovada</strong><small>Evidência registrada no ciclo atual</small></div><b>Registrada</b></div> : <div className="records-empty"><strong>Nenhum marco comprovado</strong><p>Esta área será preenchida somente por evidências reais.</p></div>}</section></div>
    <section className="cycle-history"><div className="records-section-title"><div><p className="eyebrow">Histórico de ciclos</p><h2>A transformação ao longo do tempo</h2></div></div><div className="history-head"><span>Momento</span><span>Índice</span><span>Entregas</span><span>Impacto comprovado</span></div><div className="history-row"><strong>Entrada · Mês 0</strong><span>{result ? `IME ${result.ime}` : "Aguardando medição"}</span><span>Linha de base</span><span>{diagnosticComplete ? "Registrada" : "Pendente"}</span></div><div className="history-row muted"><strong>Situação atual</strong><span>Não medida</span><span>{evidenceSubmitted ? "1 evidência registrada" : `${completedSteps} de ${totalSteps} etapas`}</span><span>Requer nova medição</span></div><div className="history-row muted"><strong>Próxima reanálise</strong><span>Protegida</span><span>Marco metodológico futuro</span><span>Sem dados ainda</span></div></section>
  </section>;
}
