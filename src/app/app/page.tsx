import { redirect } from "next/navigation";
import { DiagnosticExperience, DiagnosticResult, loadDiagnosticWorkspace } from "@/modules/diagnostic";
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
  return <main className="app-shell">
    <header className="app-header"><a href="/app" className="brand" aria-label="Mesa OS — início"><span>M</span><div><strong>Mesa OS</strong><small>{organization?.name}</small></div></a><form action={logout}><button type="submit" className="header-action">Sair</button></form></header>
    {workspace ? workspace.status === "completed" ? <DiagnosticResult workspace={workspace} /> : <DiagnosticExperience initialWorkspace={workspace} /> : <section className="diagnostic-layout"><div className="card"><p className="eyebrow">Mesa OS</p><h1>Diagnóstico indisponível</h1><p className="summary">Não foi possível carregar a definição neste momento. Tente novamente em instantes.</p></div></section>}
  </main>;
}
