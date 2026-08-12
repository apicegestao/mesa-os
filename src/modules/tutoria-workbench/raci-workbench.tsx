"use client";

import { useState, useTransition } from "react";
import { saveWorkbenchDraft } from "./actions";
import type { WorkbenchEntry, WorkbenchPayload } from "./tool-spec";
import type { WorkbenchWorkspace } from "./data";
import { DocumentPreviewCard } from "./document-preview-card";

const emptyRole = (): WorkbenchEntry => ({ role_name: "", expected_result: "", responsibilities: "", decision_rights: "" });

export function RaciWorkbench({ workspace }: { workspace: WorkbenchWorkspace }) {
  const initialRoles = Array.isArray(workspace.payload.roles) ? workspace.payload.roles : [emptyRole()];
  const [roles, setRoles] = useState<WorkbenchEntry[]>(initialRoles);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const field = workspace.spec.fields.find((item) => item.kind === "entries");
  if (!field?.entryFields) return null;
  const entryFields = field.entryFields;
  const update = (index: number, code: string, value: string) => setRoles((current) => current.map((role, position) => position === index ? { ...role, [code]: value } : role));
  const remove = (index: number) => setRoles((current) => current.length > 1 ? current.filter((_, position) => position !== index) : current);
  const save = () => startTransition(async () => {
    setMessage(null);
    const payload: WorkbenchPayload = { [field.code]: roles };
    setMessage((await saveWorkbenchDraft(workspace.spec.code, payload)).message);
  });
  return <section className="tutoria-workbench" aria-labelledby="raci-workbench-title">
    <div><p className="eyebrow">Workspace guiado</p><h3 id="raci-workbench-title">{workspace.spec.title}</h3><p>Torne explícito quem responde pelo resultado, o que precisa fazer e quais decisões pode tomar.</p></div>
    <div className="raci-role-list">{roles.map((role, index) => <fieldset key={index} className="raci-role-card"><legend>Papel {index + 1}</legend>{entryFields.map((entryField) => <label key={entryField.code}><span>{entryField.label} *</span><textarea value={role[entryField.code] ?? ""} maxLength={entryField.maxLength} onChange={(event) => update(index, entryField.code, event.target.value)} /></label>)}<button type="button" className="button-secondary" onClick={() => remove(index)} disabled={pending || roles.length === 1}>Remover papel</button></fieldset>)}</div>
    <div className="tutoria-workbench-actions"><button type="button" className="button-secondary" onClick={() => setRoles((current) => current.length < (field.maxEntries ?? 20) ? [...current, emptyRole()] : current)} disabled={pending || roles.length >= (field.maxEntries ?? 20)}>Adicionar papel</button><button type="button" onClick={save} disabled={pending}>{pending ? "Salvando…" : "Salvar mapa de papéis"}</button></div>
    {message && <p className="tutoria-state" role="status">{message}</p>}
    <DocumentPreviewCard workspace={{ ...workspace, payload: { roles } }} />
  </section>;
}
