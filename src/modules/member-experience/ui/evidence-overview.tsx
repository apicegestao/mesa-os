import type { EvidenceRecord } from "@/modules/core-loop";
import { formatMemberDate } from "../domain/format-member-date";
import Link from "next/link";

export function EvidenceOverview({
  implementation,
  evidenceSubmitted,
  evidenceStatus,
  records = [],
  missionTitle,
  pillarLabel,
  cycleLabel,
}: {
  implementation: { status: "draft" | "implemented"; summary: string; implementedOn: string } | null;
  evidenceSubmitted: boolean;
  evidenceStatus?: "submitted" | "approved" | "changes_requested" | "escalated" | null;
  records?: EvidenceRecord[];
  missionTitle?: string;
  pillarLabel?: string;
  cycleLabel?: string;
}) {
  const registered = records.length || (evidenceSubmitted ? 1 : 0);
  const approved = records.length ? records.filter((record) => record.status === "approved").length : evidenceStatus === "approved" ? registered : 0;
  const inReview = records.length ? records.filter((record) => record.status === "submitted" || record.status === "escalated").length : evidenceStatus === "submitted" || evidenceStatus === "escalated" ? registered : 0;
  const needsCorrection = records.length ? records.filter((record) => record.status === "changes_requested").length : evidenceStatus === "changes_requested" ? registered : 0;
  const statusLabel = evidenceStatus === "approved" ? "Aprovada" : evidenceStatus === "changes_requested" ? "Correção solicitada" : evidenceStatus === "escalated" ? "Em revisão humana" : "Em revisão";
  return <section className="records-page" aria-labelledby="evidence-title">
    <header className="records-heading"><p className="eyebrow">Implantação comprovada</p><h1 id="evidence-title">Evidências</h1><p>Uma entrega só avança quando a ferramenta atende ao padrão e existe prova de uso real.</p></header>
    <div className="evidence-stat-grid four"><article><span>Enviadas</span><strong>{registered}</strong><small>no ciclo atual</small></article><article><span>Aprovadas</span><strong>{approved}</strong><small>{approved ? "validadas no histórico" : "nenhuma validação ainda"}</small></article><article><span>Em revisão</span><strong>{inReview}</strong><small>{inReview ? "aguardando parecer" : "nenhuma pendente"}</small></article><article><span>Para corrigir</span><strong>{needsCorrection}</strong><small>{needsCorrection ? "uma nova versão pode ser enviada" : "nenhuma devolução"}</small></article></div>
    <section className="evidence-history proof-history"><div className="records-section-title"><div><p className="eyebrow">Histórico · {cycleLabel ?? "Ciclo atual"}</p><h2>Provas por pilar</h2></div>{implementation?.status === "implemented" && !evidenceSubmitted ? <Link className="new-evidence-link" href="/app?view=journey#implementacao">+ Nova evidência</Link> : <span>{registered} registro</span>}</div>
      {records.length ? records.map((record) => <article className="proof-row" key={record.id}><span className="proof-icon">▤</span><div><strong>{record.missionTitle}</strong><p>{formatMemberDate(record.occurredOn)}</p><small>{record.description}</small></div><span className="evidence-tag">{record.status === "approved" ? "Aprovada" : record.status === "changes_requested" ? "Correção solicitada" : record.status === "escalated" ? "Em revisão humana" : "Em revisão"}</span><span className="proof-review">{record.reviewerKind === "tutoria" ? "TutorIA" : record.reviewerKind === "human" ? "Revisão humana" : "Registro canônico"}</span><Link href="/app?view=journey#implementacao">Abrir →</Link></article>) : evidenceSubmitted ? <article className="proof-row"><span className="proof-icon">▤</span><div><strong>{missionTitle ?? "Missão do ciclo"}</strong><p>{pillarLabel ?? "Pilar do ciclo"}</p><small>{implementation?.summary ?? "Implementação comprovada por evidência registrada."}</small></div><span className="evidence-tag">{statusLabel}</span><span className="proof-review">Registro canônico</span><Link href="/app?view=journey#implementacao">Abrir →</Link></article> : <div className="records-empty"><strong>Nenhuma evidência registrada ainda</strong><p>Quando uma implementação for comprovada, o registro aparecerá aqui com seu estado rastreável.</p>{implementation?.status === "implemented" && <Link className="empty-evidence-link" href="/app?view=journey#implementacao">Registrar primeira evidência</Link>}</div>}
    </section>
  </section>;
}
