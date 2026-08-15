import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const schema = z.object({ code: z.string().regex(/^t[1-4]_[a-z0-9_]+$/), version: z.number().int().positive() });

export async function POST(request: Request) {
  if (getPublicEnv().NEXT_PUBLIC_APP_ENV === "production") return NextResponse.json({ error: "editorial_release_not_enabled" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { error } = await supabase.rpc("publish_methodology_editorial_unit", { target_code: parsed.data.code, target_version: parsed.data.version });
  return error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
