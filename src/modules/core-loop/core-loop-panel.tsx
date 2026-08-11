"use client";

import { useState, useTransition } from "react";
import { saveImplementation, submitEvidence } from "./actions";
import type { CoreLoopWorkspace } from "./index";

const today = () => new Date().toISOString().slice(0, 10);

export function CoreLoopPanel({ missionId, workspace }: { missionId: string; workspace: CoreLoopWorkspace }) {
  const [summary, setSummary] = useState(workspace.implementation?.summary ?? "");
  const [implementedOn, setImplementedOn] = useState(workspace.implementation?.implementedOn ?? today());
  const [evidenceType, setEvidenceType] = useState("decision_example");
  const [description, setDescription] = useState("");
  const [occurredOn, setOccurredOn] = useState(today());
  const [message, setMessage] = useState<string | null>(null);
  const [pending, run] = useTransition();
  const implemented = workspace.implementation?.status === "implemented";
  const evidenceDescriptionLength = description.trim().length;
  const evidenceDateValid = Boolean(occurredOn) && occurredOn <= today() && occurredOn >= (workspace.implementation?.implementedOn ?? "");
  const evidenceValid = evidenceDescriptionLength >= 20 && evidenceDescriptionLength <= 1000 && evidenceDateValid;

  function implementation(confirm: boolean) {
    setMessage(null);
    run(async () => setMessage((await saveImplementation(missionId, summary, implementedOn, confirm)).message));
  }
  function evidence() {
    setMessage(null);
    run(async () => setMessage((await submitEvidence(missionId, evidenceType, description, occurredOn)).message));
  }

  return <section className="priority-card card core-loop-card">
    <p className="eyebrow">Próxima ação · {implemented ? "Evidência" : "Implementação"}</p>
    {!implemented ? <>
      <h2>Coloque o mapa em prática</h2>
      <p>Descreva como os papéis e decisões passaram a ser usados de verdade na empresa.</p>
      <label><span>Como foi aplicado</span><textarea minLength={20} maxLength={1000} value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
      <label><span>Data da aplicação</span><input type="date" max={today()} value={implementedOn} onChange={(event) => setImplementedOn(event.target.value)} /></label>
      <div className="tool-main-actions"><button type="button" className="button-secondary" disabled={pending} onClick={() => implementation(false)}>Salvar rascunho</button><button type="button" disabled={pending} onClick={() => implementation(true)}>Marcar como implementado</button></div>
    </> : <>
      <h2>Registre uma evidência</h2>
      <p>Conte um fato observável que mostre o uso da implementação. Isso concluirá a Missão e liberará a próxima.</p>
      <label><span>Tipo de evidência</span><select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value)}><option value="decision_example">Exemplo de decisão</option><option value="operational_record">Registro operacional</option><option value="meeting_routine">Rotina de reunião</option><option value="observed_result">Resultado observado</option></select></label>
      <label><span>Descrição factual</span><small>Mínimo de 20 caracteres. {evidenceDescriptionLength}/1.000</small><textarea minLength={20} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
      <label><span>Data da ocorrência</span><input type="date" min={workspace.implementation?.implementedOn} max={today()} value={occurredOn} onChange={(event) => setOccurredOn(event.target.value)} /></label>
      <button type="button" disabled={pending || !evidenceValid} onClick={evidence}>Registrar evidência e concluir Missão</button>
    </>}
    {message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
