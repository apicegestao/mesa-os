import { methodologyMap } from "../data/methodology-map";

export function MethodologyMap() {
  return <section className="experience-card methodology-card" aria-labelledby="methodology-title">
    <div className="section-heading"><div><p className="eyebrow">Mapa de desenvolvimento</p><h2 id="methodology-title">O que evolui em cada trimestre</h2></div><span className="methodology-note">Visão da metodologia</span></div>
    <p className="section-intro">Este mapa apresenta o caminho da Mesa dos Donos. Ele não representa seu progresso individual nem marca etapas como concluídas.</p>
    <div className="methodology-scroll" tabIndex={0} aria-label="Mapa metodológico com quatro pilares e quatro trimestres">
      <div className="methodology-grid">
        <div className="methodology-head">Pilar</div>{methodologyMap.stages.map((stage) => <div className="methodology-head" key={stage}>{stage}</div>)}
        {methodologyMap.pillars.map((pillar) => <div className="methodology-row" key={pillar.name}>
          <div className="methodology-pillar"><span className={`pillar-dot ${pillar.tone}`} />{pillar.name}</div>
          {pillar.outcomes.map((outcome, index) => <div className={`methodology-outcome ${index === 0 ? "foundation" : ""}`} key={outcome}><strong>{outcome}</strong>{index === 0 && <small>Fundamento do primeiro estágio</small>}</div>)}
        </div>)}
      </div>
    </div>
  </section>;
}
