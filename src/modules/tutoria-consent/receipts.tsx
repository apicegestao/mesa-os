import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

type Receipt = { id: string; event: "accepted" | "withdrawn"; createdAt: string; hash: string; title: string; version: number };

export async function loadMyTermsReceipts(supabase: SupabaseClient<Database>): Promise<Receipt[]> {
  const { data } = await supabase.rpc("list_my_mesa_os_terms_receipts");
  return (data ?? []).slice(0, 20).map((receipt) => ({ id: receipt.receipt_id, event: receipt.event, createdAt: receipt.occurred_at, hash: receipt.document_sha256, title: receipt.document_title, version: receipt.document_version }));
}

export function TermsReceipts({ receipts }: { receipts: Receipt[] }) {
  return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Comprovantes</p><h2>Histórico de aceite</h2><p>Seu histórico permanece associado à versão exata dos Termos que você viu.</p>{receipts.length ? <ul className="terms-receipts">{receipts.map((receipt) => <li key={receipt.id}><span><strong>{receipt.event === "accepted" ? "Aceite registrado" : "Personalização retirada"}</strong><small>{receipt.title} · v{receipt.version} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(receipt.createdAt))}</small></span><code>{receipt.hash}</code><a href={`/api/legal/receipts/${receipt.id}`}>Baixar PDF</a></li>)}</ul> : <p>Nenhum recibo disponível ainda.</p>}</section>;
}
