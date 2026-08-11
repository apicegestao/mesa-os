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
import { logout } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuthenticatedShellPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;
  if (!subject) redirect("/login");

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
  return <main className="app-shell">
    <header className="app-header"><a href="/app" className="brand" aria-label="Mesa OS — início"><span>M</span><div><strong>Mesa OS</strong><small>{organization?.name}</small></div></a><form action={logout}><button type="submit" className="header-action">Sair</button></form></header>
    {workspace ? workspace.status === "completed" ? <><DiagnosticResult workspace={workspace} />{workspace.executionId && workspace.result && <div className="priority-wrap"><PriorityPanel executionId={workspace.executionId} result={workspace.result} priority={priority} />{priority&&<CyclePanel priorityId={priority.id} cycle={cycle}/>} {cycle&&<MissionPanel cycleId={cycle.id} missions={missions}/>} {availableMission&&toolWorkspace&&<ToolPanel missionId={availableMission.id} workspace={toolWorkspace} readOnly={coreLoopWorkspace?.implementation?.status === "implemented"}/>} {availableMission&&coreLoopWorkspace&&<CoreLoopPanel missionId={availableMission.id} workspace={coreLoopWorkspace}/>}</div>}</> : <DiagnosticExperience initialWorkspace={workspace} /> : <section className="diagnostic-layout"><div className="card"><p className="eyebrow">Mesa OS</p><h1>Diagnóstico indisponível</h1><p className="summary">Não foi possível carregar a definição neste momento. Tente novamente em instantes.</p></div></section>}
  </main>;
}
