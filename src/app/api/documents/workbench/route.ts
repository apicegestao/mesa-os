import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";
import { loadWorkbenchWorkspace } from "@/modules/tutoria-workbench/data";
import { renderMesaDocument } from "@/modules/tutoria-workbench/document-renderer";
import { validateWorkbenchPayload } from "@/modules/tutoria-workbench/tool-spec";

export const dynamic = "force-dynamic";
const requestSchema = z.object({ toolCode: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/), format: z.enum(["pdf", "xlsx"]), confirmed: z.literal(true) });

type AuditClient = { from: (table: "tutoria_workbench_document_export_audits") => { insert: (value: { organization_id: string; actor_identity_id: string; tool_code: string; format: string; outcome: "served" | "rejected" | "failed"; byte_size?: number; failure_code?: string }) => Promise<unknown> } };

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ message: "Solicitação inválida." }, { status: 403 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Confirme o formato antes de exportar." }, { status: 400 });
  const supabase = await createSupabaseServerClient(); const { data: claims } = await supabase.auth.getClaims(); const actorId = claims?.claims?.sub;
  if (!actorId) return NextResponse.json({ message: "Entre novamente para exportar." }, { status: 401 });
  const { data: membership } = await supabase.from("memberships").select("organization_id,status").eq("identity_id", actorId).eq("status", "active").maybeSingle();
  if (!membership) return NextResponse.json({ message: "Seu vínculo ativo não foi encontrado." }, { status: 403 });
  const audit = async (outcome: "served" | "rejected" | "failed", details: { byte_size?: number; failure_code?: string } = {}) => {
    await (supabase as unknown as AuditClient).from("tutoria_workbench_document_export_audits").insert({ organization_id: membership.organization_id, actor_identity_id: actorId, tool_code: parsed.data.toolCode, format: parsed.data.format, outcome, ...details });
  };
  const workspace = await loadWorkbenchWorkspace(supabase, parsed.data.toolCode);
  if (!workspace || !workspace.spec.exportFormats.includes(parsed.data.format) || !validateWorkbenchPayload(workspace.spec, workspace.payload).valid) { await audit("rejected", { failure_code: "incomplete_or_unsupported" }); return NextResponse.json({ message: "Salve todos os campos obrigatórios antes de exportar." }, { status: 422 }); }
  try {
    const file = await renderMesaDocument(workspace, parsed.data.format); await audit("served", { byte_size: file.byteLength });
    const extension = parsed.data.format; const mime = extension === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    return new NextResponse(Buffer.from(file), { headers: { "Content-Type": mime, "Content-Disposition": `attachment; filename="mesa-dos-donos-${workspace.spec.code}.${extension}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { await audit("failed", { failure_code: "renderer_failed" }); return NextResponse.json({ message: "Não foi possível gerar o documento agora." }, { status: 503 }); }
}
