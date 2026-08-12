"use client";

import { useState, useTransition } from "react";
import { analyzeSavedDre, explainSavedDre, saveWorkbenchDraft } from "./actions";
import type { WorkbenchPayload } from "./tool-spec";
import type { WorkbenchWorkspace } from "./data";
import type { ExpertDelivery } from "./expert-delivery";
import { DocumentPreviewCard } from "./document-preview-card";

export function DreWorkbench({ workspace }: { workspace: WorkbenchWorkspace }) {
  const [payload, setPayload] = useState<WorkbenchPayload>(workspace.payload);
  const [message, setMessage] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<ExpertDelivery | null>(null);
  const [pending, startTransition] = useTransition();
  function update(code: string, kind: string, value: string) {
    setPayload((current) => ({ ...current, [code]: ["money", "percentage", "number"].includes(kind) ? (value === "" ? null : Number(value)) : value }));
  }
  function save() {
    setMessage(null);
    startTransition(async () => setMessage((await saveWorkbenchDraft(workspace.spec.code, payload)).message));
  }
  function analyze() {
    setMessage(null); setDelivery(null);
    startTransition(async () => {
      const result = await analyzeSavedDre();
      if (result.ok) setDelivery(result.delivery); else setMessage(result.message);
    });
  }
  function explain() {
    setMessage(null); setDelivery(null);
    startTransition(async () => {
      const result = await explainSavedDre();
      if (result.ok) setDelivery(result.delivery); else setMessage(result.message);
    });
  }
  return <section className="tutoria-workbench" aria-labelledby="dre-workbench-title">
    <div><p className="eyebrow">Workspace guiado</p><h3 id="dre-workbench-title">{workspace.spec.title}</h3><p>Preencha os dados; a análise especializada do TutorIA diferencia cálculos, alertas e lacunas.</p></div>
    <div className="tutoria-workbench-fields">
      {workspace.spec.fields.map((field) => {
        const value = payload[field.code];
        return <label key={field.code}><span>{field.label}{field.required ? " *" : ""}</span>
          {field.kind === "date" ? <input type="date" value={typeof value === "string" ? value : ""} onChange={(event) => update(field.code, field.kind, event.target.value)} />
            : field.kind === "money" || field.kind === "percentage" || field.kind === "number" ? <input type="number" inputMode="decimal" step="any" value={typeof value === "number" ? value : ""} onChange={(event) => update(field.code, field.kind, event.target.value)} />
              : <input value={typeof value === "string" ? value : ""} onChange={(event) => update(field.code, field.kind, event.target.value)} />}
        </label>;
      })}
    </div>
    <div className="tutoria-workbench-actions"><button type="button" onClick={save} disabled={pending}>{pending ? "Salvando…" : "Salvar rascunho"}</button><button type="button" className="button-secondary" onClick={analyze} disabled={pending}>{pending ? "Lendo…" : "Ver leitura verificável"}</button><button type="button" className="button-secondary" onClick={explain} disabled={pending}>{pending ? "Aprofundando…" : "Aprofundar com a TutorIA"}</button></div>
    {message && <p className="tutoria-state" role="status">{message}</p>}
    {delivery && <article className="tutoria-workbench-delivery"><p className="eyebrow">Leitura fundamentada</p><strong>{delivery.summary}</strong><ul>{delivery.items.map((item) => <li key={item.title}><b>{item.title}:</b> {item.detail}</li>)}</ul>{delivery.limitations.length > 0 && <p><b>Limites:</b> {delivery.limitations.join(" ")}</p>}<p><b>Próximos passos:</b> {delivery.nextSteps.join(" ")}</p></article>}
    <DocumentPreviewCard workspace={{ ...workspace, payload }} />
  </section>;
}
