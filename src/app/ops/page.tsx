import { redirect } from "next/navigation";
import { OpsEnrollmentPanel } from "@/modules/identity-access";
import { OpsCrmConsole } from "@/modules/crm";
import { OpsFinanceConsole } from "@/modules/finance/ui/ops-finance-console";
import { OpsPortfolioConsole } from "@/modules/operations/ui/ops-portfolio-console";
import { OpsSupportConsole } from "@/modules/operations/ui/ops-support-console";
import { OpsConciergeCapacity } from "@/modules/operations/ui/ops-concierge-capacity";
import { OpsIntelligenceConsole } from "@/modules/intelligence/ui/ops-intelligence-console";
import type { CrmWorkspace, InternalRole } from "@/modules/crm/domain";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function OpsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/ops/login");

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

  const [{ data: workspaceData }, { data: financeWorkspaceData }, { data: operatorsData }, { data: conciergesData }, { data: enrollments }, { data: portfoliosData }, { data: organizationsData }, { data: managedPortfoliosData }, { data: intelligenceWorkspaceData }, { data: globalMentorData }] = await Promise.all([
    supabase.rpc("get_my_crm_workspace"),
    supabase.rpc("get_my_finance_workspace"),
    supabase.rpc("list_active_internal_operators"),
    supabase.rpc("list_available_concierges"),
    roles.includes("admin") || roles.includes("concierge") ? supabase.rpc("list_my_internal_access_enrollments") : Promise.resolve({ data: [] }),
    roles.includes("mentor") || roles.includes("concierge") ? supabase.rpc("get_my_internal_portfolios") : Promise.resolve({ data: [] }),
    roles.includes("admin") ? supabase.rpc("list_portfolio_organizations") : Promise.resolve({ data: [] }),
    roles.includes("admin") ? supabase.rpc("list_managed_internal_portfolios") : Promise.resolve({ data: [] }),
    roles.includes("admin") ? supabase.rpc("get_intelligence_workspace") : Promise.resolve({ data: { snapshots: [], proposals: [] } }),
    roles.includes("mentor") ? supabase.rpc("get_global_mentor_workspace") : Promise.resolve({ data: [] }),
  ]);

  const workspace = (workspaceData ?? { opportunities: [], handoffs: [] }) as CrmWorkspace;
  const financeWorkspace = (financeWorkspaceData ?? { offers: [], proposals: [] }) as { offers: { id: string; code: string; name: string; price_version_id: string; amount: number; currency_code: string }[]; proposals: { id: string; status: string; amount: number; currency_code: string; expires_on: string | null; opportunity_title: string; account_name: string }[] };
  const operators = (operatorsData ?? []) as { email: string; identity_id: string; roles: InternalRole[] }[];
  const concierges = (conciergesData ?? []) as { email: string; identity_id: string }[];
  return <main className="shell"><OpsCrmConsole concierges={concierges} initialWorkspace={workspace} isBootstrap={false} roles={roles} />{roles.includes("admin") && <OpsConciergeCapacity concierges={concierges} />}<OpsPortfolioConsole globalMentor={(globalMentorData ?? []) as never[]} managed={(managedPortfoliosData ?? []) as never[]} operators={operators} organizations={(organizationsData ?? []) as never[]} portfolios={(portfoliosData ?? []) as never[]} roles={roles} />{(roles.includes("admin") || roles.includes("concierge") || roles.includes("mentor")) && <OpsSupportConsole />}{roles.includes("admin") && <OpsIntelligenceConsole workspace={(intelligenceWorkspaceData ?? { snapshots: [], proposals: [] }) as never} />}<OpsFinanceConsole opportunities={workspace.opportunities} roles={roles} workspace={financeWorkspace} />{(roles.includes("admin") || roles.includes("concierge")) && <OpsEnrollmentPanel initialEnrollments={enrollments ?? []} />}</main>;
}
