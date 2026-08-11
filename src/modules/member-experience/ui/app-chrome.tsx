import type { ReactNode } from "react";

export type MemberView = "today" | "journey" | "evidence" | "evolution";

export function AppChrome({ organizationName, memberName, logoutAction, progress = 0, activeView = "today", children }: { organizationName: string; memberName?: string; logoutAction: () => Promise<void>; progress?: number; activeView?: MemberView; children: ReactNode }) {
  const initials = (memberName ?? "Membro").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="experience-shell">
    <aside className="experience-sidebar">
      <a href="#hoje" className="experience-brand" aria-label="Mesa dos Donos — Hoje"><span className="brand-bars"><i /><i /><i /></span><div><strong>MESA</strong><small>DOS DONOS</small></div></a>
      <div className="sidebar-profile"><span>{initials}</span><div><strong>{memberName ?? "Membro"}</strong><small>{organizationName} · T1</small></div></div>
      <p className="sidebar-role">Ambiente do membro</p>
      <nav aria-label="Navegação principal"><a href="/app" className={activeView === "today" ? "active" : ""}><span>⌂</span>Hoje</a><a href="/app?view=journey" className={activeView === "journey" ? "active" : ""}><span>◇</span>Jornada</a><a href="/app?view=evidence" className={activeView === "evidence" ? "active" : ""}><span>✓</span>Evidências</a><a href="/app?view=evolution" className={activeView === "evolution" ? "active" : ""}><span>↗</span>Evolução</a></nav>
      <div className="sidebar-progress"><div><span>{progress}%</span><small>Progresso do T1</small></div><div className="sidebar-progress-track"><i style={{ width: `${progress}%` }} /></div></div>
      <button className="sidebar-tutoria" type="button" disabled title="TutorIA será ativado em incremento próprio"><span className="mini-orb">T</span><div><strong>Falar com a TutorIA</strong><small>Orientação em preparação</small></div></button>
    </aside>
    <div className="experience-main">
      <header className="experience-topbar"><div><small>{organizationName.toUpperCase()} · TRIMESTRE 01</small><strong>{{ today: "Visão de hoje", journey: "Jornada", evidence: "Evidências", evolution: "Evolução" }[activeView]}</strong></div><div className="topbar-account"><span className="member-chip">Membro</span><form action={logoutAction}><button type="submit" className="header-action">Sair</button></form><span className="topbar-avatar">{initials}</span></div></header>
      <main className="experience-content">{children}</main>
      <button className="floating-tutoria" type="button" disabled title="TutorIA será ativado em incremento próprio"><span>T</span><strong>TutorIA</strong></button>
    </div>
  </div>;
}
