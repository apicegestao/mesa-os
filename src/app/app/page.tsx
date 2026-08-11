import { redirect } from "next/navigation";
import { DiagnosticExperience, DiagnosticResult, loadDiagnosticWorkspace } from "@/modules/diagnostic";
import { loadPriority, PriorityPanel } from "@/modules/priority";
import { loadCycle } from "@/modules/cycle";
import { CyclePanel } from "@/modules/cycle/cycle-panel";
import { loadMissions } from "@/modules/mission";
import { MissionPanel } from "@/modules/mission/mission-panel";
import { loadToolWorkspace } from "@/modules/structured-tool";
import { ToolPanel } from "@/modules/structured-tool/tool-panel";
import { loadCoreLoopWorkspace } from "@/modules/core-loop";
import { CoreLoopPanel } from "@/modules/core-loop/core-loop-panel";
import { logout, PasswordSetup } from "@/modules/identity-access";
import { AppChrome, deriveNextAction, DiagnosticsOverview, EvidenceOverview, EvolutionProjection, JourneyDeliveries, JourneyProgress, MemberHome, MentorNote, MethodologyMap, type MemberView, type ProgressStep } from "@/modules/member-experience";
import { lowestCandidates } from "@/modules/priority/domain/priority";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuthenticatedShellPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const requestedView = (await searchParams).view;
  const activeView: MemberView = requestedView === "journey" || requestedView === "diagnostics" || requestedView === "evidence" || requestedView === "evolution" || requestedView === "account" ? requestedView : "today";
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;
  if (!subject) redirect("/login");
  const metadata = data.claims.user_metadata as Record<string, unknown> | undefined;
  const memberName = typeof metadata?.full_name === "string" ? metadata.full_name : typeof metadata?.name === "string" ? metadata.name : "Membro";

  const { data: membership } = await supabase
    .from("memberships")
    .select("role,status,organization_id,organizations(name)")
    .eq("identity_id", subject)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) return <main className="shell"><section className="status"><p className="eyebrow">Mesa OS</p><h1>Acesso pendente</h1><p className="summary">Sua identidade foi confirmada, mas não existe um vínculo organizacional ativo. Fale com quem enviou seu convite.</p><form action={logout}><button type="submit" className="button-secondary">Sair</button></form></section></main>;

  const organization = Array.isArray(membership.organizations) ? membership.organizations[0] : membership.organizations;
  if (membership.role !== "owner") return <main className="shell"><section className="status"><p className="eyebrow">Mesa OS · {organization?.name}</p><h1>Acesso confirmado</h1><p className="summary">O Raio-X inicial está disponível somente para o responsável da organização neste momento.</p><form action={logout}><button type="submit" className="button-secondary">Sair</button></form></section></main>;

  const workspace = await loadDiagnosticWorkspace(supabase, membership.organization_id);
  const priority = workspace?.status === "completed" ? await loadPriority(supabase, membership.organization_id) : null;
  const cycle = priority ? await loadCycle(supabase, membership.organization_id) : null;
  const missions = cycle ? await loadMissions(supabase, cycle.id) : [];
  const availableMission = missions.find((mission) => mission.status === "available");
  const toolWorkspace = availableMission ? await loadToolWorkspace(supabase, availableMission.id, availableMission.definition_id) : null;
  const coreLoopWorkspace = availableMission && toolWorkspace?.updatedAt ? await loadCoreLoopWorkspace(supabase, availableMission.id) : null;
  const organizationName = organization?.name ?? "Sua empresa";

  if (!workspace) return <AppChrome organizationName={organizationName} memberName={memberName} logoutAction={logout}><section className="experience-card empty-experience"><p className="eyebrow">Mesa OS</p><h1>Diagnóstico indisponível</h1><p>Não foi possível carregar a definição neste momento. Tente novamente em instantes.</p></section></AppChrome>;

  if (workspace.status !== "completed") {
    const nextAction = deriveNextAction({ diagnosticStatus: "draft", hasPriority: false, priorityTied: false, hasCycle: false, hasMissions: false, hasAvailableMission: false, hasToolDraft: false, implementationStatus: "none" });
    return <AppChrome organizationName={organizationName} memberName={memberName} logoutAction={logout} progress={0} activeView={activeView}>
      {activeView === "today" && <><MemberHome memberName={memberName} nextAction={nextAction} cycle={null} completedSteps={0} totalSteps={8} highlightedPending={<section className="pending-diagnostic-card"><div><p className="eyebrow">Pendência prioritária</p><h2>Concluir o Raio-X do Empresário</h2><p>Finalize sua leitura de entrada para liberar a prioridade metodológica.</p></div><details><summary>Continuar Raio-X</summary><DiagnosticExperience initialWorkspace={workspace} /></details></section>} /><MentorNote materialUrl={process.env.NEXT_PUBLIC_LULA_MATERIAL_URL} /></>}
      {activeView === "journey" && <><JourneyProgress steps={draftProgressSteps} /><div id="metodologia"><MethodologyMap /></div><JourneyDeliveries missions={[]} toolStarted={false} implementationStatus="none" evidenceSubmitted={false} /></>}
      {activeView === "diagnostics" && <DiagnosticsOverview workspace={workspace} diagnosticContent={<DiagnosticExperience initialWorkspace={workspace} />} />}
      {activeView === "evidence" && <EvidenceOverview implementation={null} evidenceSubmitted={false} />}
      {activeView === "evolution" && <EvolutionProjection diagnosticComplete={false} result={null} completedSteps={0} totalSteps={8} evidenceSubmitted={false} />}
      {activeView === "account" && <section className="account-page"><header className="records-heading"><p className="eyebrow">Sistema</p><h1>Conta e segurança</h1><p>Gerencie sua forma de acesso ao Mesa OS.</p></header><PasswordSetup /></section>}
    </AppChrome>;
  }

  const tied = workspace.result ? lowestCandidates(workspace.result).length > 1 : false;
  const nextAction = deriveNextAction({
    diagnosticStatus: "completed",
    hasPriority: Boolean(priority),
    priorityTied: tied,
    hasCycle: Boolean(cycle),
    hasMissions: missions.length > 0,
    hasAvailableMission: Boolean(availableMission),
    hasToolDraft: Boolean(toolWorkspace?.updatedAt),
    implementationStatus: coreLoopWorkspace?.implementation?.status ?? "none",
  });
  const progressSteps: ProgressStep[] = [
    { label: "Diagnóstico", complete: true, tone: "blue" },
    { label: "Prioridade", complete: Boolean(priority), tone: "gold" },
    { label: "Ciclo", complete: Boolean(cycle), tone: "plum" },
    { label: "Missão", complete: Boolean(availableMission), tone: "green" },
    { label: "Ferramenta", complete: Boolean(toolWorkspace?.updatedAt), tone: "blue" },
    { label: "Aplicação", complete: coreLoopWorkspace?.implementation?.status === "implemented", tone: "gold" },
    { label: "Evidência", complete: Boolean(coreLoopWorkspace?.evidenceSubmitted), tone: "plum" },
    { label: "Evolução", complete: false, tone: "green" },
  ];
  const completedSteps = progressSteps.filter((step) => step.complete).length;
  const progress = Math.round((completedSteps / progressSteps.length) * 100);

  return <AppChrome organizationName={organizationName} memberName={memberName} logoutAction={logout} progress={progress} activeView={activeView}>
    {activeView === "today" && <><MemberHome memberName={memberName} nextAction={nextAction} cycle={cycle} priorityLabel={priority?.dimension_label} missionTitle={availableMission?.title} completedSteps={completedSteps} totalSteps={progressSteps.length} /><MentorNote materialUrl={process.env.NEXT_PUBLIC_LULA_MATERIAL_URL} /></>}
    {activeView === "journey" && <><JourneyProgress steps={progressSteps} />
    <section id="jornada" className="experience-section journey-section" aria-labelledby="journey-title">
      <div className="section-heading"><div><p className="eyebrow">Minha jornada</p><h2 id="journey-title">Do diagnóstico à transformação</h2></div><span className="status-pill">Ciclo atual</span></div>
      <div className="journey-rail" aria-label="Etapas da jornada"><span className="done">Diagnóstico</span><span className={priority ? "done" : "current"}>Prioridade</span><span className={cycle ? "done" : priority ? "current" : "future"}>Ciclo</span><span className={availableMission ? "current" : "future"}>Missão</span><span className="future">Evolução</span></div>
      {workspace.executionId && workspace.result && <div className="journey-panels"><div id="prioridade"><PriorityPanel executionId={workspace.executionId} result={workspace.result} priority={priority} /></div>{priority && <div id="ciclo"><CyclePanel priorityId={priority.id} cycle={cycle} /></div>}{cycle && <div id="missao"><MissionPanel cycleId={cycle.id} missions={missions} /></div>}</div>}
    </section>
    {availableMission && toolWorkspace && <section id="workspace" className="experience-section workspace-section" aria-labelledby="workspace-title"><div className="section-heading"><div><p className="eyebrow">Meu sistema de gestão</p><h2 id="workspace-title">Entender, construir e aplicar</h2></div></div><div className="workspace-steps"><span className="done">1 · Entender</span><span className={toolWorkspace.updatedAt ? "done" : "current"}>2 · Construir</span><span className={coreLoopWorkspace?.implementation ? "done" : "future"}>3 · Aplicar</span><span className={coreLoopWorkspace?.implementation?.status === "implemented" ? "current" : "future"}>4 · Evidenciar</span></div><ToolPanel missionId={availableMission.id} workspace={toolWorkspace} readOnly={coreLoopWorkspace?.implementation?.status === "implemented"}/>{coreLoopWorkspace && <div id="implementacao"><CoreLoopPanel missionId={availableMission.id} workspace={coreLoopWorkspace}/></div>}</section>}
    <div id="metodologia"><MethodologyMap /></div><JourneyDeliveries missions={missions} availableMissionId={availableMission?.id} toolStarted={Boolean(toolWorkspace?.updatedAt)} implementationStatus={coreLoopWorkspace?.implementation?.status ?? "none"} evidenceSubmitted={Boolean(coreLoopWorkspace?.evidenceSubmitted)} /></>}
    {activeView === "evidence" && <EvidenceOverview implementation={coreLoopWorkspace?.implementation ?? null} evidenceSubmitted={Boolean(coreLoopWorkspace?.evidenceSubmitted)} missionTitle={availableMission?.title} pillarLabel={priority?.dimension_label} />}
    {activeView === "diagnostics" && <DiagnosticsOverview workspace={workspace} diagnosticContent={<DiagnosticResult workspace={workspace} />} />}
    {activeView === "evolution" && <EvolutionProjection diagnosticComplete result={workspace.result} completedSteps={completedSteps} totalSteps={progressSteps.length} evidenceSubmitted={Boolean(coreLoopWorkspace?.evidenceSubmitted)} />}
    {activeView === "account" && <section className="account-page"><header className="records-heading"><p className="eyebrow">Sistema</p><h1>Conta e segurança</h1><p>Gerencie sua forma de acesso ao Mesa OS.</p></header><PasswordSetup /></section>}
  </AppChrome>;
}

const draftProgressSteps: ProgressStep[] = [
  { label: "Diagnóstico", complete: false, tone: "blue" }, { label: "Prioridade", complete: false, tone: "gold" },
  { label: "Ciclo", complete: false, tone: "plum" }, { label: "Missão", complete: false, tone: "green" },
  { label: "Ferramenta", complete: false, tone: "blue" }, { label: "Aplicação", complete: false, tone: "gold" },
  { label: "Evidência", complete: false, tone: "plum" }, { label: "Evolução", complete: false, tone: "green" },
];
