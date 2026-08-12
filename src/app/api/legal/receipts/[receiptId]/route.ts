import { NextResponse } from "next/server";
import { buildTermsReceiptPdf } from "@/modules/tutoria-consent/receipt-pdf";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ receiptId: string }> }) {
  const { receiptId } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ message: "Entre novamente para baixar o recibo." }, { status: 401 });
  const { data, error } = await supabase.rpc("get_my_mesa_os_terms_receipt", { target_receipt_id: receiptId });
  const receipt = data?.[0];
  if (error || !receipt) return NextResponse.json({ message: "Recibo não encontrado." }, { status: 404 });
  const file = await buildTermsReceiptPdf({ receiptId: receipt.receipt_id, event: receipt.event, occurredAt: receipt.occurred_at, hash: receipt.document_sha256, title: receipt.document_title, version: receipt.document_version });
  return new NextResponse(Buffer.from(file), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=\"mesa-os-recibo-termos-v${receipt.document_version}.pdf\"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
