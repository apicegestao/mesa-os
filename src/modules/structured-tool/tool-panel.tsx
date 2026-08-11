"use client";

import { useState, useTransition } from "react";
import { saveToolDraft } from "./actions";
import { asToolPayload, type ToolEntry, type ToolWorkspace } from "./index";

function emptyEntry(workspace: ToolWorkspace) {
  return Object.fromEntries(workspace.schema.fields.map((field) => [field.key, ""]));
}

export function ToolPanel({ missionId, workspace }: { missionId: string; workspace: ToolWorkspace }) {
  const [entries, setEntries] = useState<ToolEntry[]>(workspace.entries.length ? workspace.entries : [emptyEntry(workspace)]);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, run] = useTransition();

  function updateEntry(index: number, key: string, value: string) {
    setEntries((current) => current.map((entry, position) => position === index ? { ...entry, [key]: value } : entry));
  }

  function move(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= entries.length) return;
    setEntries((current) => {
      const next = [...current];
      const source = next[index];
      const target = next[destination];
      if (!source || !target) return current;
      next[index] = target;
      next[destination] = source;
      return next;
    });
  }

  function save() {
    setMessage(null);
    run(async () => {
      const result = await saveToolDraft(missionId, asToolPayload(entries));
      setMessage(result.message);
    });
  }

  return <section className="priority-card card tool-card">
    <p className="eyebrow">Ferramenta · Rascunho</p>
    <h2>{workspace.name}</h2>
    <p>Organize papéis, resultados, responsabilidades e decisões. Salvar não conclui a Missão.</p>
    <div className="tool-entries">
      {entries.map((entry, index) => <fieldset className="tool-entry" key={index}>
        <legend>Entrada {index + 1}</legend>
        {workspace.schema.fields.map((field) => <label key={field.key}>
          <span>{field.label}</span><small>{field.help}</small>
          {field.control === "textarea" ? <textarea required={field.required} maxLength={field.maxLength} value={entry[field.key] ?? ""} onChange={(event) => updateEntry(index, field.key, event.target.value)} /> : <input required={field.required} maxLength={field.maxLength} value={entry[field.key] ?? ""} onChange={(event) => updateEntry(index, field.key, event.target.value)} />}
        </label>)}
        <div className="tool-entry-actions">
          <button type="button" className="button-secondary" disabled={index === 0} onClick={() => move(index, -1)}>Subir</button>
          <button type="button" className="button-secondary" disabled={index === entries.length - 1} onClick={() => move(index, 1)}>Descer</button>
          <button type="button" className="button-secondary" disabled={entries.length <= workspace.schema.minItems} onClick={() => setEntries((current) => current.filter((_, position) => position !== index))}>Remover</button>
        </div>
      </fieldset>)}
    </div>
    <div className="tool-main-actions">
      <button type="button" className="button-secondary" disabled={entries.length >= workspace.schema.maxItems} onClick={() => setEntries((current) => [...current, emptyEntry(workspace)])}>Adicionar entrada</button>
      <button type="button" disabled={pending} onClick={save}>{pending ? "Salvando…" : "Salvar rascunho"}</button>
    </div>
    {message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
