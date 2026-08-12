"use client";

import { useState, useTransition } from "react";
import { saveWorkbenchDraft } from "./actions";
import type { WorkbenchEntry, WorkbenchPayload } from "./tool-spec";
import type { WorkbenchWorkspace } from "./data";

const emptyInsight = (): WorkbenchEntry => ({ insight: "", evidence: "" });

export function SwotWorkbench({ workspace }: { workspace: WorkbenchWorkspace }) {
  const [payload, setPayload] = useState<WorkbenchPayload>(() => Object.fromEntries(workspace.spec.fields.map((field) => [field.code, Array.isArray(workspace.payload[field.code]) ? workspace.payload[field.code] : [emptyInsight()]])) as WorkbenchPayload);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const update = (quadrant: string, index: number, code: string, value: string) => setPayload((current) => ({ ...current, [quadrant]: (current[quadrant] as WorkbenchEntry[]).map((item, position) => position === index ? { ...item, [code]: value } : item) } as WorkbenchPayload));
  const add = (quadrant: string, maximum: number) => setPayload((current) => ({ ...current, [quadrant]: (current[quadrant] as WorkbenchEntry[]).length < maximum ? [...(current[quadrant] as WorkbenchEntry[]), emptyInsight()] : (current[quadrant] as WorkbenchEntry[]) } as WorkbenchPayload));
  const remove = (quadrant: string, index: number) => setPayload((current) => ({ ...current, [quadrant]: (current[quadrant] as WorkbenchEntry[]).length > 1 ? (current[quadrant] as WorkbenchEntry[]).filter((_, position) => position !== index) : (current[quadrant] as WorkbenchEntry[]) } as WorkbenchPayload));
  const save = () => startTransition(async () => { setMessage(null); setMessage((await saveWorkbenchDraft(workspace.spec.code, payload)).message); });
  return <section className="tutoria-workbench" aria-labelledby="swot-workbench-title"><div><p className="eyebrow">Workspace guiado</p><h3 id="swot-workbench-title">{workspace.spec.title}</h3><p>Transforme percepções em leitura estratégica: cada ponto precisa ter um sinal ou evidência.</p></div><div className="swot-grid">{workspace.spec.fields.map((field) => { const items = payload[field.code] as WorkbenchEntry[]; const entryFields = field.entryFields ?? []; return <section key={field.code} className={`swot-quadrant ${field.code}`}><h4>{field.label}</h4>{items.map((item, index) => <fieldset key={index}><legend>Item {index + 1}</legend>{entryFields.map((entryField) => <label key={entryField.code}><span>{entryField.label} *</span><textarea value={item[entryField.code] ?? ""} maxLength={entryField.maxLength} onChange={(event) => update(field.code, index, entryField.code, event.target.value)} /></label>)}<button type="button" className="button-secondary" onClick={() => remove(field.code, index)} disabled={pending || items.length === 1}>Remover</button></fieldset>)}<button type="button" className="button-secondary" onClick={() => add(field.code, field.maxEntries ?? 12)} disabled={pending || items.length >= (field.maxEntries ?? 12)}>Adicionar item</button></section>; })}</div><div className="tutoria-workbench-actions"><button type="button" onClick={save} disabled={pending}>{pending ? "Salvando…" : "Salvar leitura SWOT"}</button></div>{message && <p className="tutoria-state" role="status">{message}</p>}</section>;
}
