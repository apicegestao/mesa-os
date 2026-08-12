import type { WorkbenchWorkspace } from "./data";

export type MesaDocumentPreview = {
  brand: "Mesa dos Donos";
  title: string;
  methodologyOutcomeCode: string;
  toolVersion: number;
  status: "draft";
  generatedAt: string;
  formats: ("pdf" | "xlsx")[];
  sections: { label: string; value: string }[];
};

/** Canonical, non-downloadable source for future PDF/XLSX rendering. It makes
 * output provenance visible before any file leaves the organization boundary. */
export function buildMesaDocumentPreview(workspace: WorkbenchWorkspace, generatedAt = new Date().toISOString()): MesaDocumentPreview {
  const sections = workspace.spec.fields.map((field) => {
    const value = workspace.payload[field.code];
    if (Array.isArray(value)) return { label: field.label, value: `${value.length} item(ns) estruturado(s)` };
    if (value === null || value === undefined || value === "") return { label: field.label, value: "Não informado" };
    return { label: field.label, value: String(value) };
  });
  return { brand: "Mesa dos Donos", title: workspace.spec.title, methodologyOutcomeCode: workspace.spec.methodologyOutcomeCode, toolVersion: workspace.spec.version, status: "draft", generatedAt, formats: workspace.spec.exportFormats, sections };
}
