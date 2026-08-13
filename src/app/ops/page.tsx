import { redirect } from "next/navigation";
import { OpsEnrollmentPanel } from "@/modules/identity-access";
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

  return <main className="shell"><OpsEnrollmentPanel /></main>;
}
