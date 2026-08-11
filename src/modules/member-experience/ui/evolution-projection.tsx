export function EvolutionProjection({
  diagnosticComplete,
  completedSteps,
  totalSteps,
  evidenceSubmitted,
}: {
  diagnosticComplete: boolean;
  completedSteps: number;
  totalSteps: number;
  evidenceSubmitted: boolean;
}) {
  const progress = Math.round((completedSteps / totalSteps) * 100);
  return <section id="evolucao" className="evolution-projection" aria-labelledby="evolution-title">
    <header className="evolution-heading"><div><p className="eyebrow">Evolução</p><h2 id="evolution-title">O que mudou na gestão</h2><p>Progresso real é implementação comprovada — não consumo de conteúdo.</p></div><span className="methodology-note">Visão atual</span></header>
    <div className="evolution-grid">
      <article className="evolution-state"><p className="eyebrow light">Índice de Maturidade Empresarial</p><strong>{diagnosticComplete ? "Linha de base registrada" : "Em construção"}</strong><p>A comparação será liberada somente quando existir uma nova medição metodologicamente válida.</p></article>
      <article className="evolution-evidence"><div className="compact-heading"><div><p className="eyebrow">Transformação comprovada</p><h3>Evidências do trimestre</h3></div><span>{evidenceSubmitted ? "1 evidência" : "Nenhuma evidência ainda"}</span></div><div className="evolution-row"><div><span>Core loop atual</span><strong>{progress}%</strong></div><div className="pulse-track"><i className="blue" style={{ width: `${progress}%` }} /></div></div><div className="evolution-row"><div><span>Mudança comprovada</span><strong>{evidenceSubmitted ? "Registrada" : "Ainda não medida"}</strong></div><div className="pulse-track"><i className="gold" style={{ width: evidenceSubmitted ? "100%" : "0%" }} /></div></div></article>
    </div>
    <div className="quarter-roadmap"><article className="current"><strong>T1 · Fundamentos</strong><small>Trimestre atual · {progress}%</small></article><article><strong>T2 · Controle</strong><small>Protegido até o fechamento do T1</small></article><article><strong>T3 · Previsibilidade</strong><small>Próximo horizonte</small></article><article><strong>T4 · Autonomia</strong><small>Destino metodológico</small></article></div>
  </section>;
}
