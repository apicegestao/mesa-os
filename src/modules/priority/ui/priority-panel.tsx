"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DiagnosticResult } from "@/modules/diagnostic/domain/diagnostic";
import { confirmPriority } from "../actions/confirm-priority";
import { lowestCandidates, type Priority } from "../domain/priority";

export function PriorityPanel({ executionId, result, priority }: { executionId: string; result: DiagnosticResult; priority: Priority | null }) {
  const router = useRouter();
  const [rationale, setRationale] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const candidates = lowestCandidates(result);

  if (priority) return <section className="priority-card card"><p className="eyebrow">Sua prioridade</p><h2>{priority.dimension_label}</h2><div className="priority-score">Score de origem: <strong>{priority.source_score}/100</strong></div><blockquote>{priority.rationale}</blockquote><p className="feedback">Prioridade confirmada. O próximo passo, Ciclo, ainda não faz parte deste sprint.</p></section>;

  if (candidates.length > 1) return <section className="priority-card card"><p className="eyebrow">Próxima etapa</p><h2>Aguardando desempate TutorIA</h2><p>Há empate entre as menores dimensões: <strong>{candidates.map((item) => item.label).join(" e ")}</strong>, com score {candidates[0]?.score}/100.</p><p className="feedback">Nenhuma escolha humana será feita. O mecanismo TutorIA será definido em um incremento próprio.</p></section>;

  const candidate = candidates[0];
  if (!candidate) return null;
  return <section className="priority-card card"><p className="eyebrow">Sua próxima decisão</p><h2>Confirmar {candidate.label} como prioridade</h2><p>Esta foi a menor dimensão do Raio-X, com <strong>{candidate.score}/100</strong>. Confirme por que concentrar atenção nela agora.</p><label htmlFor="priority-rationale">Por que esta prioridade agora?</label><textarea id="priority-rationale" value={rationale} maxLength={500} onChange={(event) => setRationale(event.target.value)} placeholder="Descreva brevemente o contexto da empresa." /><div className="priority-action"><small>{rationale.trim().length}/500</small><button disabled={pending || rationale.trim().length < 10} onClick={() => startTransition(async () => { const response = await confirmPriority(executionId, rationale); if (!response.ok) return setMessage(response.message); router.refresh(); })}>{pending ? "Confirmando…" : "Confirmar prioridade"}</button></div>{message && <p className="feedback feedback-error" role="alert">{message}</p>}</section>;
}
