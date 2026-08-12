import type { Mission } from "@/modules/mission";

export function JourneyDeliveries({ missions, availableMissionId, toolStarted, implementationStatus, evidenceSubmitted }: { missions: Mission[]; availableMissionId?: string; toolStarted: boolean; implementationStatus: "none" | "draft" | "implemented"; evidenceSubmitted: boolean }) {
  return <section className="journey-deliveries" aria-labelledby="deliveries-title"><div className="records-section-title"><div><p className="eyebrow">Plano do T1</p><h2 id="deliveries-title">Entregas em implementação</h2></div><span>{missions.length} {missions.length === 1 ? "entrega" : "entregas"}</span></div>
    {missions.length ? <div className="delivery-list">{missions.map((mission) => {
      const active = mission.id === availableMissionId;
      const state = mission.status === "completed" ? "Concluída" : active && evidenceSubmitted ? "Evidenciada" : active && implementationStatus === "implemented" ? "Aguardando evidência" : active && (toolStarted || implementationStatus === "draft") ? "Em implementação" : active ? "Disponível" : "Próxima";
      const tone = mission.status === "completed" ? "completed" : active ? "active" : "future";
      return <article className={`delivery-row ${tone}`} key={mission.id}><span className="delivery-position">{mission.status === "completed" ? "✓" : mission.position}</span><div><small>{state}</small><strong>{mission.title}</strong><p>{mission.objective}</p></div>{mission.status === "completed" ? <a href="/app?view=evidence">Ver evidência</a> : active ? <a href="#workspace">Continuar</a> : <span className="delivery-locked">Protegida</span>}</article>;
    })}</div> : <div className="records-empty"><strong>Entregas ainda não definidas</strong><p>As Missões aparecerão aqui quando o ciclo estiver preparado.</p></div>}
  </section>;
}
