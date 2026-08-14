import { redirect } from "next/navigation";
import { OpsEnrollmentPanel } from "@/modules/identity-access";
import { OpsCrmConsole } from "@/modules/crm";
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
  if (roles.length === 0) return <main className="shell"><OpsCrmConsole initialWorkspace={{ opportunities: [], handoffs: [] }} isBootstrap operators={[]} roles={[]} /></main>;

  const [{ data: workspaceData }, { data: operatorsData }, { data: enrollments }] = await Promise.all([
    supabase.rpc("get_my_crm_workspace"),
    supabase.rpc("list_active_internal_operators"),
    roles.includes("admin") || roles.includes("concierge") ? supabase.rpc("list_my_internal_access_enrollments") : Promise.resolve({ data: [] }),
  ]);

  const workspace = (workspaceData ?? { opportunities: [], handoffs: [] }) as CrmWorkspace;
  const operators = (operatorsData ?? []) as { email: string; identity_id: string; roles: InternalRole[] }[];
  return <main className="shell"><OpsCrmConsole initialWorkspace={workspace} isBootstrap={false} operators={operators} roles={roles} />{(roles.includes("admin") || roles.includes("concierge")) && <OpsEnrollmentPanel initialEnrollments={enrollments ?? []} />}</main>;
}
