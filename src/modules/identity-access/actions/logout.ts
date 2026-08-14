"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function logoutToOpsLogin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/ops/login");
}
