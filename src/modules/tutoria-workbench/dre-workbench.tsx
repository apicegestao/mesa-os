"use client";

import { useState, useTransition } from "react";
import { saveWorkbenchDraft } from "./actions";
import type { WorkbenchPayload } from "./tool-spec";
import type { WorkbenchWorkspace } from "./data";

export function DreWorkbench({ workspace }: { workspace: WorkbenchWorkspace }) {
  const [payload, setPayload] = useState<WorkbenchPayload>(workspace.payload);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  function update(code: string, kind: string, value: string) {
    setPayload((current) => ({ ...current, [code]: ["money", "percentage", "number"].includes(kind) ? (value === "" ? null : Number(value)) : value }));
  }
  function save() {
    setMessage(null);
    startTransition(async () => setMessage((await saveWorkbenchDraft(workspace.spec.code, payload)).message));
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
    <button type="button" onClick={save} disabled={pending}>{pending ? "Salvando…" : "Salvar rascunho para análise"}</button>
    {message && <p className="tutoria-state" role="status">{message}</p>}
  </section>;
}
