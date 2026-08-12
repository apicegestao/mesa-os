import { buildMesaDocumentPreview } from "./document-preview";
import type { WorkbenchWorkspace } from "./data";

export function DocumentPreviewCard({ workspace }: { workspace: WorkbenchWorkspace }) {
  const preview = buildMesaDocumentPreview(workspace);
  return <aside className="mesa-document-preview" aria-label={`Prévia do documento ${preview.title}`}>
    <p className="eyebrow">Prévia do documento</p><p className="mesa-document-title">{preview.title}</p>
    <p className="mesa-document-status">Rascunho · v{preview.toolVersion} · Mesa dos Donos</p>
    <dl>{preview.sections.map((section) => <div key={section.label}><dt>{section.label}</dt><dd>{section.value}</dd></div>)}</dl>
    <small>Origem metodológica: {preview.methodologyOutcomeCode}. A exportação em PDF/XLSX será liberada somente com confirmação explícita.</small>
  </aside>;
}
