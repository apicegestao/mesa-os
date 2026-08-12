import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { buildMesaDocumentPreview } from "./document-preview";
import type { WorkbenchWorkspace } from "./data";

export type DocumentFormat = "pdf" | "xlsx";

function lines(workspace: WorkbenchWorkspace) {
  const preview = buildMesaDocumentPreview(workspace);
  return ["MESA DOS DONOS", preview.title, `Rascunho · versão ${preview.toolVersion}`, `Origem metodológica: ${preview.methodologyOutcomeCode}`, ...preview.sections.map((item) => `${item.label}: ${item.value}`)];
}

export async function renderMesaDocument(workspace: WorkbenchWorkspace, format: DocumentFormat): Promise<Uint8Array> {
  const content = lines(workspace);
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Mesa dos Donos");
    sheet.columns = [{ width: 34 }, { width: 60 }]; sheet.addRow(["Mesa dos Donos", workspace.spec.title]);
    sheet.addRow(["Status", `Rascunho · versão ${workspace.spec.version}`]); sheet.addRow(["Origem metodológica", workspace.spec.methodologyOutcomeCode]);
    for (const section of buildMesaDocumentPreview(workspace).sections) sheet.addRow([section.label, section.value]);
    sheet.getRow(1).font = { bold: true, color: { argb: "FF101D37" } }; sheet.getColumn(1).font = { bold: true };
    return new Uint8Array(await workbook.xlsx.writeBuffer());
  }
  const pdf = await PDFDocument.create(); const page = pdf.addPage([595, 842]); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = 790; content.forEach((line, index) => { page.drawText(line.slice(0, 108), { x: 48, y, size: index < 2 ? 16 : 10, font: index < 2 ? bold : font, color: index < 2 ? rgb(.06, .11, .22) : rgb(.15, .2, .3) }); y -= index < 2 ? 30 : 20; });
  return pdf.save();
}
