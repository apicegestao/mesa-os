export function EvidenceOverview({
  implementation,
  evidenceSubmitted,
  missionTitle,
  pillarLabel,
}: {
  implementation: { status: "draft" | "implemented"; summary: string; implementedOn: string } | null;
  evidenceSubmitted: boolean;
  missionTitle?: string;
  pillarLabel?: string;
}) {
  const registered = evidenceSubmitted ? 1 : 0;
  return <section className="records-page" aria-labelledby="evidence-title">
    <header className="records-heading"><p className="eyebrow">Implantação comprovada</p><h1 id="evidence-title">Evidências</h1><p>Uma entrega só avança quando a ferramenta atende ao padrão e existe prova de uso real.</p></header>
    <div className="evidence-stat-grid four"><article><span>Enviadas</span><strong>{registered}</strong><small>no ciclo atual</small></article><article><span>Registradas</span><strong>{registered}</strong><small>imutáveis e rastreáveis</small></article><article><span>Em revisão</span><strong>0</strong><small>fluxo ainda não ativado</small></article><article><span>Para corrigir</span><strong>0</strong><small>nenhuma devolução</small></article></div>
    <section className="evidence-history proof-history"><div className="records-section-title"><div><p className="eyebrow">Histórico do T1</p><h2>Provas por pilar</h2></div>{implementation?.status === "implemented" && !evidenceSubmitted ? <a className="new-evidence-link" href="/app?view=journey#implementacao">+ Nova evidência</a> : <span>{registered} registro</span>}</div>
      {evidenceSubmitted ? <article className="proof-row"><span className="proof-icon">▤</span><div><strong>{missionTitle ?? "Missão do ciclo"}</strong><p>{pillarLabel ?? "Pilar do ciclo"}</p><small>{implementation?.summary ?? "Implementação comprovada por evidência registrada."}</small></div><span className="evidence-tag">Registrada</span><span className="proof-review">Registro canônico</span><a href="/app?view=journey#implementacao">Abrir →</a></article> : <div className="records-empty"><strong>Nenhuma evidência registrada ainda</strong><p>Quando uma implementação for comprovada, o registro aparecerá aqui com seu estado rastreável.</p>{implementation?.status === "implemented" && <a className="empty-evidence-link" href="/app?view=journey#implementacao">Registrar primeira evidência</a>}</div>}
    </section>
  </section>;
}
