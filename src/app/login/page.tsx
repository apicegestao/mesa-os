import { redirect } from "next/navigation";
import { LoginForm } from "@/modules/identity-access";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/app");

  return <main className="shell"><section className="status"><p className="eyebrow">Acesso seguro</p><h1>Entrar no Mesa OS</h1><p className="summary">Use o e-mail que recebeu o convite. Enviaremos um link de acesso sem senha.</p><LoginForm /></section></main>;
}
