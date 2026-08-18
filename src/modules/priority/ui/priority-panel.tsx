import type { DiagnosticResult } from "@/modules/diagnostic/domain/diagnostic";
import { lowestCandidates, type Priority } from "../domain/priority";

export function PriorityPanel({ result, priority }: { result: DiagnosticResult; priority: Priority | null }) {
  const candidates = lowestCandidates(result);

  if (priority) return <section className="priority-card card"><p className="eyebrow">Direção do ciclo</p><h2>{priority.dimension_label}</h2><div className="priority-score">Score de origem: <strong>{priority.source_score}/100</strong></div><blockquote>{priority.rationale}</blockquote><p className="feedback">O Raio-X definiu este ponto de partida. O TutorIA usará esta direção para guiar seu ciclo e as próximas Missões.</p></section>;

  if (candidates.length > 1) return <section className="priority-card card"><p className="eyebrow">Direção em preparação</p><h2>O TutorIA está organizando seu ponto de partida</h2><p>O diagnóstico identificou prioridades equivalentes. A direção será aplicada automaticamente pela regra metodológica do Raio-X.</p></section>;

  const candidate = candidates[0];
  if (!candidate) return null;
  return <section className="priority-card card"><p className="eyebrow">Direção em preparação</p><h2>{candidate.label}</h2><p>O Raio-X identificou esta dimensão como o ponto de partida mais importante. A direção será registrada automaticamente ao concluir o diagnóstico.</p></section>;
}
