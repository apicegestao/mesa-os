import { redirect } from "next/navigation";
import { OpsEnrollmentPanel, OpsStaffEnrollmentPanel } from "@/modules/identity-access";
import { OpsCrmConsole } from "@/modules/crm";
import { OpsFinanceConsole } from "@/modules/finance/ui/ops-finance-console";
import { OpsPortfolioConsole } from "@/modules/operations/ui/ops-portfolio-console";
import { OpsSupportConsole } from "@/modules/operations/ui/ops-support-console";
import { OpsConciergeCapacity } from "@/modules/operations/ui/ops-concierge-capacity";
import { OpsIntelligenceConsole } from "@/modules/intelligence/ui/ops-intelligence-console";
import type { CrmWorkspace, InternalRole } from "@/modules/crm/domain";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

type OpsView = "crm" | "portfolio" | "support" | "finance" | "intelligence" | "access";
const views: OpsView[] = ["crm", "portfolio", "support", "finance", "intelligence", "access"];

function canUseView(view: OpsView, roles: InternalRole[]) {
  if (view === "crm") return roles.includes("admin") || roles.includes("commercial") || roles.includes("concierge");
  if (view === "portfolio") return roles.includes("admin") || roles.includes("concierge") || roles.includes("mentor");
  if (view === "support") return roles.includes("admin") || roles.includes("concierge") || roles.includes("mentor");
  if (view === "finance") return roles.includes("admin") || roles.includes("commercial") || roles.includes("finance");
  if (view === "intelligence") return roles.includes("admin");
  return roles.includes("admin") || roles.includes("concierge");
}

function OpsNavigation({ activeView, roles }: { activeView: OpsView; roles: InternalRole[] }) {
  const items: { view: OpsView; label: string }[] = [
    { view: "crm", label: "CRM" },
    { view: "portfolio", label: "Carteira" },
    { view: "support", label: "Suporte" },
    { view: "finance", label: "Financeiro" },
    { view: "intelligence", label: "Intelligence" },
    { view: "access", label: "Acessos" },
  ];

  return <nav className="ops-navigation" aria-label="Módulos internos">{items.filter((item) => canUseView(item.view, roles)).map((item) => <a key={item.view} href={`/ops?view=${item.view}`} className={item.view === activeView ? "active" : ""}>{item.label}</a>)}</nav>;
}

export default async function OpsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const { data, error } = await supabase.rpc("get_my_internal_operator_state");
  if (error || !data?.[0]?.active) {
    return <main className="shell"><section className="status"><p className="eyebrow">Acesso interno</p><h1>Acesso não autorizado</h1><p className="summary">Esta conta não possui uma atribuição operacional ativa.</p></section></main>;
  }

  const { data: opsState, error: opsStateError } = await supabase.rpc("get_my_internal_ops_state");
  if (opsStateError || !opsState?.[0]?.active) {
    return <main className="shell"><section className="status"><p className="eyebrow">Acesso interno</p><h1>Operação temporariamente indisponível</h1><p className="summary">Sua sessão foi validada, mas não foi possível consultar as autorizações agora.</p></section></main>;
  }

  const roles = opsState[0].roles as InternalRole[];
  if (roles.length === 0) return <main className="shell"><OpsCrmConsole concierges={[]} initialWorkspace={{ opportunities: [], handoffs: [] }} isBootstrap roles={[]} /></main>;

  const requestedView = (await searchParams).view;
  const activeView = views.includes(requestedView as OpsView) && canUseView(requestedView as OpsView, roles) ? requestedView as OpsView : "crm";
  const workspace = ((await supabase.rpc("get_my_crm_workspace")).data as CrmWorkspace | null) ?? { opportunities: [], handoffs: [] };
  const concierges = activeView === "crm" || activeView === "portfolio"
    ? (((await supabase.rpc("list_available_concierges")).data ?? []) as { email: string; identity_id: string }[])
    : [];

  let content: React.ReactNode;
  if (activeView === "crm") {
    content = <OpsCrmConsole concierges={concierges} initialWorkspace={workspace} isBootstrap={false} roles={roles} />;
  } else if (activeView === "finance") {
    const { data: financeData } = await supabase.rpc("get_my_finance_workspace");
    content = <OpsFinanceConsole opportunities={workspace.opportunities} roles={roles} workspace={(financeData ?? { offers: [], proposals: [] }) as never} />;
  } else if (activeView === "support") {
    content = <main className="ops-module"><OpsSupportConsole /></main>;
  } else if (activeView === "intelligence") {
    const { data: intelligenceData } = await supabase.rpc("get_intelligence_workspace");
    content = <main className="ops-module"><OpsIntelligenceConsole workspace={(intelligenceData ?? { snapshots: [], proposals: [] }) as never} /></main>;
  } else if (activeView === "access") {
    const [{ data: enrollments }, { data: organizations }] = await Promise.all([
      supabase.rpc("list_my_internal_access_enrollments"),
      roles.includes("admin") ? supabase.rpc("list_portfolio_organizations") : Promise.resolve({ data: [] }),
    ]);
    content = <main className="ops-module">{roles.includes("admin") && <OpsStaffEnrollmentPanel organizations={organizations ?? []} />}<OpsEnrollmentPanel initialEnrollments={enrollments ?? []} /></main>;
  } else {
    const [{ data: operatorsData }, { data: organizationsData }, { data: managedPortfoliosData }, { data: globalMentorData }, { data: myPortfoliosData }] = await Promise.all([
      supabase.rpc("list_active_internal_operators"),
      roles.includes("admin") ? supabase.rpc("list_portfolio_organizations") : Promise.resolve({ data: [] }),
      roles.includes("admin") ? supabase.rpc("list_managed_internal_portfolios") : Promise.resolve({ data: [] }),
      roles.includes("mentor") ? supabase.rpc("get_global_mentor_workspace") : Promise.resolve({ data: [] }),
      roles.includes("mentor") || roles.includes("concierge") ? supabase.rpc("get_my_internal_portfolios") : Promise.resolve({ data: [] }),
    ]);
    content = <main className="ops-module"><OpsPortfolioConsole globalMentor={(globalMentorData ?? []) as never[]} managed={(managedPortfoliosData ?? []) as never[]} operators={(operatorsData ?? []) as never[]} organizations={(organizationsData ?? []) as never[]} portfolios={(myPortfoliosData ?? []) as never[]} roles={roles} />{roles.includes("admin") && <OpsConciergeCapacity concierges={concierges} />}</main>;
  }

  return <main className="ops-shell"><header className="ops-header"><div><p className="eyebrow">Mesa dos Donos · operação interna</p><h1>Backoffice</h1></div><a href="/app">Ver ambiente do membro</a></header><OpsNavigation activeView={activeView} roles={roles} />{content}</main>;
}
