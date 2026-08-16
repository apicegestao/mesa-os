"use client";

import { useState, useTransition } from "react";
import { saveWorkbenchDraft } from "./actions";
import type { WorkbenchEntry, WorkbenchPayload } from "./tool-spec";
import type { WorkbenchWorkspace } from "./data";
import { DocumentPreviewCard } from "./document-preview-card";

function emptyEntry(fields: { code: string }[] = []): WorkbenchEntry {
  return Object.fromEntries(fields.map((field) => [field.code, ""]));
}

function initialPayload(workspace: WorkbenchWorkspace): WorkbenchPayload {
  return Object.fromEntries(workspace.spec.fields.map((field) => {
    const stored = workspace.payload[field.code];
    if (field.kind === "entries") return [field.code, Array.isArray(stored) && stored.length > 0 ? stored : [emptyEntry(field.entryFields)]];
    return [field.code, stored ?? ""];
  })) as WorkbenchPayload;
}

export function StructuredWorkbench({ workspace }: { workspace: WorkbenchWorkspace }) {
  const [payload, setPayload] = useState<WorkbenchPayload>(() => initialPayload(workspace));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const updateField = (code: string, kind: string, value: string) => setPayload((current) => ({ ...current, [code]: ["money", "percentage", "number"].includes(kind) ? (value === "" ? null : Number(value)) : value }));
  const updateEntry = (fieldCode: string, index: number, code: string, value: string) => setPayload((current) => ({ ...current, [fieldCode]: (current[fieldCode] as WorkbenchEntry[]).map((entry, position) => position === index ? { ...entry, [code]: value } : entry) }));
  const addEntry = (fieldCode: string, fields: { code: string }[], maximum: number) => setPayload((current) => {
    const entries = (current[fieldCode] as WorkbenchEntry[] | undefined) ?? [];
    return { ...current, [fieldCode]: entries.length < maximum ? [...entries, emptyEntry(fields)] : entries };
  });
  const removeEntry = (fieldCode: string, index: number) => setPayload((current) => {
    const entries = (current[fieldCode] as WorkbenchEntry[] | undefined) ?? [];
    return { ...current, [fieldCode]: entries.length > 1 ? entries.filter((_, position) => position !== index) : entries };
  });
  const save = () => startTransition(async () => { setMessage(null); setMessage((await saveWorkbenchDraft(workspace.spec.code, payload)).message); });
  return <section className="tutoria-workbench" aria-labelledby={`${workspace.spec.code}-title`}>
    <div><p className="eyebrow">Workspace guiado</p><h3 id={`${workspace.spec.code}-title`}>{workspace.spec.title}</h3><p>Registre fatos da operação. O TutorIA usa os dados salvos para orientar a próxima ação com contexto.</p></div>
    <div className="tutoria-workbench-fields">{workspace.spec.fields.map((field) => {
      if (field.kind === "entries") {
        const entries = payload[field.code] as WorkbenchEntry[];
        return <section key={field.code} className="raci-role-list"><h4>{field.label}{field.required ? " *" : ""}</h4>{entries.map((entry, index) => <fieldset key={index} className="raci-role-card"><legend>Item {index + 1}</legend>{field.entryFields?.map((entryField) => <label key={entryField.code}><span>{entryField.label}{entryField.required ? " *" : ""}</span><textarea value={entry[entryField.code] ?? ""} maxLength={entryField.maxLength} onChange={(event) => updateEntry(field.code, index, entryField.code, event.target.value)} /></label>)}<button type="button" className="button-secondary" onClick={() => removeEntry(field.code, index)} disabled={pending || entries.length === 1}>Remover item</button></fieldset>)}<button type="button" className="button-secondary" onClick={() => addEntry(field.code, field.entryFields ?? [], field.maxEntries ?? 20)} disabled={pending || entries.length >= (field.maxEntries ?? 20)}>Adicionar item</button></section>;
      }
      const value = payload[field.code];
      return <label key={field.code}><span>{field.label}{field.required ? " *" : ""}</span>{field.kind === "choice" ? <select value={typeof value === "string" ? value : ""} onChange={(event) => updateField(field.code, field.kind, event.target.value)}><option value="">Selecione</option>{field.choices?.map((choice) => <option key={choice} value={choice}>{choice}</option>)}</select> : field.kind === "date" ? <input type="date" value={typeof value === "string" ? value : ""} onChange={(event) => updateField(field.code, field.kind, event.target.value)} /> : <input type={["money", "percentage", "number"].includes(field.kind) ? "number" : "text"} inputMode={["money", "percentage", "number"].includes(field.kind) ? "decimal" : undefined} step="any" value={typeof value === "string" || typeof value === "number" ? value : ""} onChange={(event) => updateField(field.code, field.kind, event.target.value)} />}</label>;
    })}</div>
    <div className="tutoria-workbench-actions"><button type="button" onClick={save} disabled={pending}>{pending ? "Salvando…" : "Salvar rascunho"}</button></div>
    {message && <p className="tutoria-state" role="status">{message}</p>}
    <DocumentPreviewCard workspace={{ ...workspace, payload }} />
  </section>;
}
