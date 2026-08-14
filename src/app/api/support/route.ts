import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const createSchema = z.object({ action: z.literal("open"), category: z.enum(["tool", "product_use", "management_decision", "other"]), subject: z.string().trim().min(8).max(180), message: z.string().trim().min(1).max(2000) });
const replySchema = z.object({ action: z.literal("reply"), requestId: z.string().uuid(), message: z.string().trim().min(1).max(2000) });

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rpc = supabase.rpc as unknown as (name: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  const { data, error } = await rpc("get_my_member_support_workspace");
  return error ? NextResponse.json({ error: "unavailable" }, { status: 503 }) : NextResponse.json({ requests: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const parsed = z.discriminatedUnion("action", [createSchema, replySchema]).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rpc = supabase.rpc as unknown as (name: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  const result = parsed.data.action === "open"
    ? await rpc("open_member_support_request", { target_category: parsed.data.category, target_subject: parsed.data.subject, target_message: parsed.data.message })
    : await rpc("reply_member_support_request", { target_request_id: parsed.data.requestId, target_body: parsed.data.message });
  return result.error ? NextResponse.json({ error: "unavailable" }, { status: 422 }) : NextResponse.json({ ok: true, id: result.data ?? null }, { status: 201 });
}
