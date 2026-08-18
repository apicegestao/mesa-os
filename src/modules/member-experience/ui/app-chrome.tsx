import type { ReactNode } from "react";
import Link from "next/link";
import { TutorIAAssistant } from "@/modules/tutoria-guidance";

export type MemberView = "today" | "journey" | "diagnostics" | "evidence" | "evolution" | "account";

function NavIcon({ name }: { name: MemberView }) {
  const paths: Record<MemberView, ReactNode> = {
    today: <><path d="m2.5 7 5.5-4.5L13.5 7v6.5H9.75V9h-3.5v4.5H2.5Z" /></>,
    journey: <><path d="M3 3.25h10v9.5H3Z" /><path d="M6 3.25v9.5M10 3.25v9.5" /></>,
    diagnostics: <><path d="m8 2.5 5.5 5.5L8 13.5 2.5 8Z" /><path d="m6.3 8 1.15 1.15L10 6.6" /></>,
    evidence: <><path d="m3 8.2 3.1 3.1L13 4.7" /></>,
    evolution: <><path d="M3 12 7 8l2.5 2.5L14 5" /><path d="M10 5h4v4" /></>,
    account: <><circle cx="8" cy="8" r="2.15" /><path d="M8 2.2v1.2m0 9.2v1.2m5.8-5.8h-1.2M3.4 8H2.2m9.9-4.1-.85.85m-6.5 6.5-.85.85m8.2 0-.85-.85m-6.5-6.5-.85-.85" /></>,
  };
  return <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

export function AppChrome({ memberName, logoutAction, progress = 0, activeView = "today", cycleLabel, children, tutoriaWorkbench }: { memberName?: string; logoutAction: () => Promise<void>; progress?: number; activeView?: MemberView; cycleLabel?: string; children: ReactNode; tutoriaWorkbench?: ReactNode }) {
  const initials = (memberName ?? "Membro").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="experience-shell">
    <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
    <aside className="experience-sidebar">
      <Link href="/app" className="experience-brand" aria-label="Mesa dos Donos — Hoje"><span className="brand-bars"><i /><i /><i /></span><div><strong>MESA</strong><small>DOS DONOS</small></div></Link>
      <div className="sidebar-profile"><span>{initials}</span><div><strong>{memberName ?? "Membro"}</strong><small>{cycleLabel ?? "Ciclo em preparação"}</small></div></div>
      <p className="sidebar-role">Ambiente do membro</p>
      <nav aria-label="Navegação principal"><Link href="/app" className={activeView === "today" ? "active" : ""}><span className="nav-icon"><NavIcon name="today" /></span>Hoje</Link><Link href="/app?view=journey" className={activeView === "journey" ? "active" : ""}><span className="nav-icon"><NavIcon name="journey" /></span>Jornada</Link><Link href="/app?view=diagnostics" className={activeView === "diagnostics" ? "active" : ""}><span className="nav-icon"><NavIcon name="diagnostics" /></span>Diagnósticos</Link><Link href="/app?view=evidence" className={activeView === "evidence" ? "active" : ""}><span className="nav-icon"><NavIcon name="evidence" /></span>Evidências</Link><Link href="/app?view=evolution" className={activeView === "evolution" ? "active" : ""}><span className="nav-icon"><NavIcon name="evolution" /></span>Evolução</Link></nav>
      <nav className="sidebar-system-nav" aria-label="Sistema"><p>Sistema</p><Link href="/app?view=account" className={activeView === "account" ? "active" : ""}><span className="nav-icon"><NavIcon name="account" /></span>Conta e segurança</Link></nav>
      <div className="sidebar-progress"><div><span>{progress}%</span><small>Progresso do ciclo</small></div><div className="sidebar-progress-track"><i style={{ width: `${progress}%` }} /></div></div>
    </aside>
    <div className="experience-main">
      <header className="experience-topbar"><div><small>{(cycleLabel ?? "Ciclo em preparação").toUpperCase()}</small><strong>{{ today: "Visão de hoje", journey: "Jornada", diagnostics: "Diagnósticos", evidence: "Evidências", evolution: "Evolução", account: "Conta e segurança" }[activeView]}</strong></div><div className="topbar-account"><span className="member-chip">Membro</span><form action={logoutAction}><button type="submit" className="header-action">Sair</button></form><Link className="topbar-avatar" href="/app?view=account" aria-label="Abrir conta e segurança">{initials}</Link></div></header>
      <main id="conteudo-principal" className="experience-content" tabIndex={-1}>{children}</main>
      <TutorIAAssistant workbench={tutoriaWorkbench} />
    </div>
  </div>;
}
