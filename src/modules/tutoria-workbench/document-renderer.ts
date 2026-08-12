import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { buildMesaDocumentPreview } from "./document-preview";
import type { WorkbenchWorkspace } from "./data";

export type DocumentFormat = "pdf" | "xlsx";

type DocumentRow = { label: string; value: string };

function rows(workspace: WorkbenchWorkspace): DocumentRow[] {
  const preview = buildMesaDocumentPreview(workspace);
  const values = workspace.spec.fields.flatMap((field) => {
    const value = workspace.payload[field.code];
    if (Array.isArray(value)) return value.flatMap((entry, index) => (field.entryFields ?? []).map((entryField) => ({ label: `${field.label} ${index + 1} · ${entryField.label}`, value: entry[entryField.code] || "Não informado" })));
    return [{ label: field.label, value: value === null || value === undefined || value === "" ? "Não informado" : String(value) }];
  });
  return [{ label: "Status", value: `Rascunho · versão ${preview.toolVersion}` }, { label: "Origem metodológica", value: preview.methodologyOutcomeCode }, ...values];
}

function lines(workspace: WorkbenchWorkspace) {
  const preview = buildMesaDocumentPreview(workspace);
  return ["MESA DOS DONOS", preview.title, ...rows(workspace).flatMap((row) => `${row.label}: ${row.value}`.match(/.{1,90}(?:\s|$)|.{1,90}/g) ?? [])];
}

export async function renderMesaDocument(workspace: WorkbenchWorkspace, format: DocumentFormat): Promise<Uint8Array> {
  const content = lines(workspace);
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Mesa dos Donos");
    sheet.columns = [{ width: 40 }, { width: 78 }]; sheet.addRow(["Mesa dos Donos", workspace.spec.title]);
    for (const row of rows(workspace)) sheet.addRow([row.label, row.value]);
    sheet.getRow(1).font = { bold: true, color: { argb: "FF101D37" } }; sheet.getColumn(1).font = { bold: true };
    sheet.eachRow((row) => row.alignment = { vertical: "top", wrapText: true });
    return new Uint8Array(await workbook.xlsx.writeBuffer());
  }
  const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]); let y = 790;
  content.forEach((line, index) => { if (y < 56) { page = pdf.addPage([595, 842]); y = 790; } page.drawText(line, { x: 48, y, size: index < 2 ? 16 : 10, font: index < 2 ? bold : font, color: index < 2 ? rgb(.06, .11, .22) : rgb(.15, .2, .3) }); y -= index < 2 ? 30 : 18; });
  return pdf.save();
}
