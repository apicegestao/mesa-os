import type { ReactNode } from "react";
import type { NextAction } from "../domain/next-action";

export function AppChrome({ organizationName, logoutAction, nextAction, children }: { organizationName: string; logoutAction: () => Promise<void>; nextAction?: NextAction; children: ReactNode }) {
  return <div className="experience-shell">
    <aside className="experience-sidebar">
      <a href="#hoje" className="experience-brand" aria-label="Mesa OS — Hoje"><span>M</span><div><strong>Mesa OS</strong><small>Mesa dos Donos</small></div></a>
      <nav aria-label="Navegação principal"><a href="#hoje" className="active"><span>01</span>Hoje</a><a href="#jornada"><span>02</span>Minha jornada</a><a href="#diagnostico"><span>03</span>Diagnóstico</a><a href="#workspace"><span>04</span>Meu sistema de gestão</a><a href="#metodologia"><span>05</span>Mapa de desenvolvimento</a></nav>
      <div className="sidebar-tutoria"><span className="mini-orb">T</span><div><strong>TutorIA</strong><small>Fundação em preparação</small></div></div>
    </aside>
    <div className="experience-main">
      <header className="experience-topbar"><div><strong>{organizationName}</strong><small>Jornada Mesa dos Donos</small></div><form action={logoutAction}><button type="submit" className="header-action">Sair</button></form></header>
      <main className="experience-content">
        {nextAction && <section id="hoje" className="next-action-card"><div><p className="eyebrow">{nextAction.eyebrow}</p><h1>{nextAction.title}</h1><p>{nextAction.description}</p></div><a className="primary-link" href={nextAction.href}>{nextAction.label}<span aria-hidden="true">→</span></a></section>}
        {children}
      </main>
    </div>
  </div>;
}
