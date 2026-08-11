export function EvidenceOverview({
  implementation,
  evidenceSubmitted,
  missionTitle,
}: {
  implementation: { status: "draft" | "implemented"; summary: string; implementedOn: string } | null;
  evidenceSubmitted: boolean;
  missionTitle?: string;
}) {
  const registered = evidenceSubmitted ? 1 : 0;
  return <section className="records-page" aria-labelledby="evidence-title">
    <header className="records-heading"><p className="eyebrow">Transformação comprovada</p><h1 id="evidence-title">Evidências</h1><p>Fatos observáveis que demonstram o uso real do que foi construído.</p></header>
    <div className="evidence-stat-grid"><article><span>Registradas</span><strong>{registered}</strong><small>no ciclo atual</small></article><article><span>Implementações</span><strong>{implementation?.status === "implemented" ? 1 : 0}</strong><small>colocadas em prática</small></article><article><span>Pendentes</span><strong>{implementation?.status === "implemented" && !evidenceSubmitted ? 1 : 0}</strong><small>aguardando comprovação</small></article></div>
    <section className="evidence-history"><div className="records-section-title"><div><p className="eyebrow">Histórico</p><h2>Registros do ciclo</h2></div><span>{registered} registro</span></div>
      {evidenceSubmitted ? <article className="evidence-history-row"><span className="evidence-check">✓</span><div><strong>{missionTitle ?? "Missão do ciclo"}</strong><p>{implementation?.summary ?? "Implementação comprovada por evidência registrada."}</p><small>{implementation?.implementedOn ? formatDate(implementation.implementedOn) : "Data registrada"}</small></div><span className="evidence-tag">Registrada</span></article> : <div className="records-empty"><strong>Nenhuma evidência registrada ainda</strong><p>Quando uma implementação for comprovada, o registro aparecerá aqui com seu estado rastreável.</p></div>}
    </section>
  </section>;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}
