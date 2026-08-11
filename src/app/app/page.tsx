import { redirect } from "next/navigation";
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
    .select("role,status,organizations(name)")
    .eq("identity_id", subject)
    .eq("status", "active")
    .maybeSingle();

  return (
    <main className="shell"><section className="status"><p className="eyebrow">Mesa OS</p>
      {membership ? <><h1>Acesso confirmado</h1><p className="summary">Sua sessão e seu vínculo organizacional estão ativos. As funcionalidades de negócio ainda não fazem parte deste sprint.</p></> : <><h1>Acesso pendente</h1><p className="summary">Sua identidade foi confirmada, mas não existe um vínculo organizacional ativo. Fale com quem enviou seu convite.</p></>}
      <form action={logout}><button type="submit" className="button-secondary">Sair</button></form>
    </section></main>
  );
}
