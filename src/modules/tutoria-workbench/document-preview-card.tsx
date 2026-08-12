"use client";
import { useState } from "react";
import { buildMesaDocumentPreview } from "./document-preview";
import type { WorkbenchWorkspace } from "./data";

export function DocumentPreviewCard({ workspace }: { workspace: WorkbenchWorkspace }) {
  const preview = buildMesaDocumentPreview(workspace);
  const [message, setMessage] = useState<string | null>(null);
  async function exportDocument(format: "pdf" | "xlsx") {
    setMessage(null);
    const response = await fetch("/api/documents/workbench", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toolCode: workspace.spec.code, format, confirmed: true }) });
    if (!response.ok) { const body = await response.json().catch(() => null); setMessage(body?.message ?? "Não foi possível gerar o documento."); return; }
    const file = await response.blob(); const url = URL.createObjectURL(file); const link = document.createElement("a"); link.href = url; link.download = `mesa-dos-donos-${workspace.spec.code}.${format}`; link.click(); URL.revokeObjectURL(url); setMessage("Documento gerado. Revise antes de utilizar.");
  }
  return <aside className="mesa-document-preview" aria-label={`Prévia do documento ${preview.title}`}>
    <p className="eyebrow">Prévia do documento</p><p className="mesa-document-title">{preview.title}</p>
    <p className="mesa-document-status">Rascunho · v{preview.toolVersion} · Mesa dos Donos</p>
    <dl>{preview.sections.map((section) => <div key={section.label}><dt>{section.label}</dt><dd>{section.value}</dd></div>)}</dl>
    <small>Origem metodológica: {preview.methodologyOutcomeCode}. A exportação em PDF/XLSX será liberada somente com confirmação explícita.</small>
    <div className="tutoria-workbench-actions"><button type="button" className="button-secondary" onClick={() => exportDocument("pdf")}>Confirmar e baixar PDF</button><button type="button" className="button-secondary" onClick={() => exportDocument("xlsx")}>Confirmar e baixar XLSX</button></div>
    {message && <p className="tutoria-state" role="status">{message}</p>}
  </aside>;
}
