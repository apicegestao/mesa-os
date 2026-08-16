"use client";

import { useState } from "react";

export type EditorialReleaseUnit = { id: string; code: string; version: number; status: "draft" | "published" | "retired"; title: string; business_outcome: string; tools: { code: string; version: number; role: "primary" | "support"; status: "draft" | "published" | "retired" }[] };

export function OpsEditorialConsole({ units }: { units: EditorialReleaseUnit[] }) {
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  async function publish(unit: EditorialReleaseUnit) {
    setPendingCode(unit.code); setMessage(null);
    try {
      const response = await fetch("/api/ops/editorial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: unit.code, version: unit.version }) });
      if (!response.ok) throw new Error("editorial_publish_failed");
      setMessage(`${unit.title} foi publicado em homologação. Atualize a página para conferir o estado.`);
    } catch { setMessage("Não foi possível publicar a unidade agora. Nenhuma mudança foi confirmada."); }
    finally { setPendingCode(null); }
  }
  return <section className="ops-finance"><header><p className="eyebrow">Metodologia T1</p><h2>Revisão editorial</h2><p className="summary">A publicação é deliberada e auditada. Ela libera somente esta unidade e suas ferramentas vinculadas em homologação.</p></header>{units.length ? <ul className="ops-finance-list">{units.map((unit) => <li key={unit.id}><p className="eyebrow">v{unit.version} · {unit.status === "draft" ? "Rascunho interno" : unit.status === "published" ? "Publicado" : "Arquivado"}</p><strong>{unit.title}</strong><p>{unit.business_outcome}</p><small>Ferramentas: {unit.tools.map((tool) => `${tool.code} (${tool.status})`).join(" · ")}</small>{unit.status === "draft" && <p><button type="button" disabled={pendingCode === unit.code} onClick={() => void publish(unit)}>{pendingCode === unit.code ? "Publicando…" : "Publicar em homologação"}</button></p>}</li>)}</ul> : <p className="feedback">Nenhuma unidade editorial disponível para revisão.</p>}{message && <p className="feedback" role="status">{message}</p>}</section>;
}
