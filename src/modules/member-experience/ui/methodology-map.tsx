import type { PublishedMethodologyMap } from "@/modules/methodology";

const pillarTone: Record<string, string> = { finance: "blue", leadership: "gold", marketing_sales: "plum", processes: "green" };

export function MethodologyMap({ map }: { map: PublishedMethodologyMap | null }) {
  if (!map) return <section className="experience-card methodology-card" aria-labelledby="methodology-title"><div className="section-heading"><div><p className="eyebrow">Mapa de desenvolvimento</p><h2 id="methodology-title">Metodologia indisponível</h2></div></div><p className="section-intro">A revisão metodológica publicada não pôde ser carregada agora.</p></section>;
  return <section className="experience-card methodology-card" aria-labelledby="methodology-title">
    <div className="section-heading"><div><p className="eyebrow">Mapa de desenvolvimento</p><h2 id="methodology-title">O que evolui em cada trimestre</h2></div><span className="methodology-note">Visão da metodologia</span></div>
    <p className="section-intro">Este mapa apresenta o caminho da Mesa dos Donos. Ele não representa seu progresso individual nem marca etapas como concluídas.</p>
    <div className="methodology-scroll" tabIndex={0} aria-label="Mapa metodológico com quatro pilares e quatro trimestres">
      <div className="methodology-grid">
        <div className="methodology-head">Pilar</div>{map.stages.map((stage) => <div className="methodology-head" key={stage.id}>{stage.code.toUpperCase()} · {stage.label}</div>)}
        {map.pillars.map((pillar) => <div className="methodology-row" key={pillar.id}>
          <div className="methodology-pillar"><span className={`pillar-dot ${pillarTone[pillar.code] ?? "blue"}`} />{pillar.label}</div>
          {map.stages.map((stage) => { const outcome = pillar.outcomes.find((candidate) => candidate.stageId === stage.id); return <div className={`methodology-outcome ${stage.position === 1 ? "foundation" : ""}`} key={stage.id}>{outcome ? <><strong>{outcome.title}</strong>{stage.position === 1 && <small>Fundamento do primeiro estágio</small>}</> : <strong>Não publicado</strong>}</div>; })}
        </div>)}
      </div>
    </div>
  </section>;
}
