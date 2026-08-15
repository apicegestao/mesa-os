"use client";

import { useState } from "react";

type Snapshot = { id: string; cohort_size: number; eligible: boolean; metrics: Record<string, unknown>; generated_at: string };
type Proposal = { id: string; snapshot_id: string | null; proposal_type: string; status: string; title: string; summary: string; rationale: string; confidence: number | null; limitations: string; created_at: string };

const proposalTypeLabel: Record<string, string> = { methodology: "Metodologia", tool: "Ferramenta", content: "Conteúdo", cycle: "Ciclo", training: "Treinamento", product: "Produto" };

function metricValue(snapshot: Snapshot | undefined, key: string) {
  const value = snapshot?.metrics[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "data não disponível" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

export function OpsIntelligenceConsole({ workspace }: { workspace: { snapshots: Snapshot[]; proposals: Proposal[] } }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const latestSnapshot = workspace.snapshots[0];
  const latestEligibleSnapshot = workspace.snapshots.find((snapshot) => snapshot.eligible);

  async function send(body: object) {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/ops/intelligence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error();
      setMessage("Registro concluído e auditado. Atualize a página para consultar o estado consolidado.");
    } catch {
      setMessage("Não foi possível concluir a operação de Intelligence.");
    } finally {
      setPending(false);
    }
  }

  return <section className="ops-finance ops-intelligence">
    <header>
      <p className="eyebrow">Mesa OS Intelligence</p>
      <h2>Insights e propostas governadas</h2>
      <p className="summary">A leitura usa apenas padrões agregados. Nenhuma proposta altera método, ferramenta, ciclo ou sistema sem revisão humana e Definition Pack.</p>
    </header>

    <section className="ops-intelligence-overview" aria-label="Retrato agregado mais recente">
      <div>
        <p className="eyebrow">Retrato agregado</p>
        <h3>{latestEligibleSnapshot ? "Sinais da operação" : "Aguardando coorte segura"}</h3>
        <p>{latestEligibleSnapshot ? `Dados agregados de ${latestEligibleSnapshot.cohort_size} organizações, atualizados em ${formatDate(latestEligibleSnapshot.generated_at)}.` : latestSnapshot ? `O último retrato tem ${latestSnapshot.cohort_size} organizações. São necessárias ao menos 3 para exibir métricas agregadas.` : "Gere o primeiro retrato quando houver dados suficientes para a coorte mínima de segurança."}</p>
      </div>
      <button disabled={pending} onClick={() => void send({ action: "snapshot" })}>{pending ? "Gerando…" : "Gerar retrato agregado"}</button>
    </section>

    {latestEligibleSnapshot && <section className="evidence-stat-grid four ops-intelligence-metrics" aria-label="Métricas agregadas mais recentes">
      <article><span>Coorte</span><strong>{latestEligibleSnapshot.cohort_size}</strong><small>organizações consideradas</small></article>
      <article><span>Ciclos ativos</span><strong>{metricValue(latestEligibleSnapshot, "active_cycles")}</strong><small>em execução agora</small></article>
      <article><span>Missões</span><strong>{metricValue(latestEligibleSnapshot, "available_missions")}</strong><small>disponíveis para avanço</small></article>
      <article><span>Evidências</span><strong>{metricValue(latestEligibleSnapshot, "approved_evidence")}</strong><small>aprovadas no retrato</small></article>
    </section>}

    <details>
      <summary>+ Registrar proposta interna</summary>
      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void send({ action: "proposal", snapshotId: form.get("snapshotId") || null, type: form.get("type"), title: form.get("title"), summary: form.get("summary"), rationale: form.get("rationale"), confidence: form.get("confidence") || null, limitations: form.get("limitations") }); }}>
        <label>Tipo<select name="type"><option value="methodology">Metodologia</option><option value="tool">Ferramenta</option><option value="content">Conteúdo</option><option value="cycle">Ciclo</option><option value="training">Treinamento</option><option value="product">Produto</option></select></label>
        <label>Retrato agregado<select name="snapshotId"><option value="">Sem vínculo</option>{workspace.snapshots.filter((snapshot) => snapshot.eligible).map((snapshot) => <option key={snapshot.id} value={snapshot.id}>{formatDate(snapshot.generated_at)} · {snapshot.cohort_size} organizações</option>)}</select></label>
        <label>Título<input name="title" required minLength={8} /></label>
        <label>Síntese<textarea name="summary" required minLength={30} /></label>
        <label>Racional<textarea name="rationale" required minLength={30} /></label>
        <label>Confiança (0–1)<input name="confidence" type="number" min="0" max="1" step="0.01" /></label>
        <label>Limitações<textarea name="limitations" required minLength={10} /></label>
        <button disabled={pending}>Registrar proposta</button>
      </form>
    </details>

    <section className="ops-finance-list">
      <h3>Propostas para revisão</h3>
      {workspace.proposals.length ? <ul>{workspace.proposals.map((proposal) => <li key={proposal.id}><p className="eyebrow">{proposalTypeLabel[proposal.proposal_type] ?? "Proposta"} · {proposal.status}</p><strong>{proposal.title}</strong><p>{proposal.summary}</p><small>{proposal.confidence == null ? "Confiança ainda não informada" : `Confiança declarada: ${Math.round(proposal.confidence * 100)}%`} · limites registrados</small></li>)}</ul> : <p className="feedback">Nenhuma proposta registrada. O retrato orienta a análise, mas não cria mudanças automaticamente.</p>}
    </section>
    {message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
