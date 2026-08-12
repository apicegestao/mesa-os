import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/infrastructure/supabase/database.types";

type Receipt = { id: string; event: "accepted" | "withdrawn"; createdAt: string; hash: string; title: string; version: number };

export async function loadMyTermsReceipts(supabase: SupabaseClient<Database>): Promise<Receipt[]> {
  const { data: receipts } = await supabase.from("legal_document_acceptances").select("id,event,created_at,document_sha256,document_version_id").order("created_at", { ascending: false }).limit(20);
  const ids = [...new Set((receipts ?? []).map((item) => item.document_version_id))];
  if (!ids.length) return [];
  const { data: documents } = await supabase.from("legal_document_versions").select("id,title,version").in("id", ids);
  const details = new Map((documents ?? []).map((document) => [document.id, document]));
  return (receipts ?? []).flatMap((receipt) => {
    const document = details.get(receipt.document_version_id);
    return document ? [{ id: receipt.id, event: receipt.event, createdAt: receipt.created_at, hash: receipt.document_sha256, title: document.title, version: document.version }] : [];
  });
}

export function TermsReceipts({ receipts }: { receipts: Receipt[] }) {
  return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Comprovantes</p><h2>Histórico de aceite</h2><p>Seu histórico permanece associado à versão exata dos Termos que você viu.</p>{receipts.length ? <ul className="terms-receipts">{receipts.map((receipt) => <li key={receipt.id}><span><strong>{receipt.event === "accepted" ? "Aceite registrado" : "Personalização retirada"}</strong><small>{receipt.title} · v{receipt.version} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(receipt.createdAt))}</small></span><code>{receipt.hash}</code></li>)}</ul> : <p>Nenhum recibo disponível ainda.</p>}</section>;
}
