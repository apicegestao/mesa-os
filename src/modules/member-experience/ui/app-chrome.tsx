import type { ReactNode } from "react";
import { TutorIAAssistant } from "@/modules/tutoria-guidance";

export type MemberView = "today" | "journey" | "diagnostics" | "evidence" | "evolution" | "account";

export function AppChrome({ organizationName, memberName, logoutAction, progress = 0, activeView = "today", cycleLabel, children, tutoriaWorkbench }: { organizationName: string; memberName?: string; logoutAction: () => Promise<void>; progress?: number; activeView?: MemberView; cycleLabel?: string; children: ReactNode; tutoriaWorkbench?: ReactNode }) {
  const initials = (memberName ?? "Membro").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="experience-shell">
    <aside className="experience-sidebar">
      <a href="#hoje" className="experience-brand" aria-label="Mesa dos Donos — Hoje"><span className="brand-bars"><i /><i /><i /></span><div><strong>MESA</strong><small>DOS DONOS</small></div></a>
      <div className="sidebar-profile"><span>{initials}</span><div><strong>{memberName ?? "Membro"}</strong><small>{organizationName} · {cycleLabel ?? "Ciclo em preparação"}</small></div></div>
      <p className="sidebar-role">Ambiente do membro</p>
      <nav aria-label="Navegação principal"><a href="/app" className={activeView === "today" ? "active" : ""}><span>⌂</span>Hoje</a><a href="/app?view=journey" className={activeView === "journey" ? "active" : ""}><span>◇</span>Jornada</a><a href="/app?view=diagnostics" className={activeView === "diagnostics" ? "active" : ""}><span>◫</span>Diagnósticos</a><a href="/app?view=evidence" className={activeView === "evidence" ? "active" : ""}><span>✓</span>Evidências</a><a href="/app?view=evolution" className={activeView === "evolution" ? "active" : ""}><span>↗</span>Evolução</a></nav>
      <nav className="sidebar-system-nav" aria-label="Sistema"><p>Sistema</p><a href="/app?view=account" className={activeView === "account" ? "active" : ""}><span>⚙</span>Conta e segurança</a></nav>
      <div className="sidebar-progress"><div><span>{progress}%</span><small>Progresso do ciclo</small></div><div className="sidebar-progress-track"><i style={{ width: `${progress}%` }} /></div></div>
    </aside>
    <div className="experience-main">
      <header className="experience-topbar"><div><small>{organizationName.toUpperCase()} · {(cycleLabel ?? "Ciclo em preparação").toUpperCase()}</small><strong>{{ today: "Visão de hoje", journey: "Jornada", diagnostics: "Diagnósticos", evidence: "Evidências", evolution: "Evolução", account: "Conta e segurança" }[activeView]}</strong></div><div className="topbar-account"><span className="member-chip">Membro</span><form action={logoutAction}><button type="submit" className="header-action">Sair</button></form><a className="topbar-avatar" href="/app?view=account" aria-label="Abrir conta e segurança">{initials}</a></div></header>
      <main className="experience-content">{children}</main>
      <TutorIAAssistant workbench={tutoriaWorkbench} />
    </div>
  </div>;
}
