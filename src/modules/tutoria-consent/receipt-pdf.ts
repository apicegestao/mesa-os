import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type TermsReceiptPdfData = {
  receiptId: string;
  event: "accepted" | "withdrawn";
  occurredAt: string;
  hash: string;
  title: string;
  version: number;
};

const navy = rgb(16 / 255, 29 / 255, 55 / 255);
const blue = rgb(55 / 255, 125 / 255, 185 / 255);
const muted = rgb(84 / 255, 104 / 255, 131 / 255);

function formatOccurredAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Fortaleza" }).format(new Date(value));
}

function wrap(text: string, maxCharacters: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharacters && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildTermsReceiptPdf(receipt: TermsReceiptPdfData) {
  const document = await PDFDocument.create();
  document.setTitle("Recibo de aceite dos Termos de Uso - Mesa OS");
  document.setAuthor("Mesa Dos Donos");
  document.setSubject("Registro verificável de aceite dos Termos de Uso");
  document.setCreationDate(new Date());
  const page = document.addPage([595.28, 841.89]);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const left = 54;
  let y = height - 62;
  const write = (text: string, size: number, font = regular, color = navy) => {
    page.drawText(text, { x: left, y, size, font, color });
    y -= size + 8;
  };
  const paragraph = (text: string, size = 10.5, color = muted) => {
    for (const line of wrap(text, 78)) write(line, size, regular, color);
    y -= 8;
  };

  write("MESA DOS DONOS", 11, bold, blue);
  y -= 12;
  write("Recibo de aceite dos Termos de Uso", 22, bold);
  paragraph("Este documento comprova, de forma temporal e verificável, o evento registrado na sua conta autenticada do Mesa OS.", 11, muted);
  page.drawLine({ start: { x: left, y }, end: { x: width - left, y }, thickness: 1, color: rgb(218 / 255, 228 / 255, 240 / 255) });
  y -= 28;
  write("Dados do registro", 13, bold, navy);
  const label = (name: string, value: string) => {
    write(name.toUpperCase(), 8.5, bold, blue);
    for (const line of wrap(value, 78)) write(line, 10.5, regular, navy);
    y -= 8;
  };
  label("Evento", receipt.event === "accepted" ? "Aceite dos Termos registrado" : "Retirada da personalização longitudinal registrada");
  label("Documento", `${receipt.title} - versão ${receipt.version}`);
  label("Data e hora", `${formatOccurredAt(receipt.occurredAt)} (horário de Fortaleza)`);
  label("Hash SHA-256 do conteúdo", receipt.hash);
  label("Identificador do recibo", receipt.receiptId);
  y -= 6;
  page.drawRectangle({ x: left, y: y - 82, width: width - left * 2, height: 82, color: rgb(242 / 255, 247 / 255, 252 / 255) });
  y -= 17;
  paragraph("O hash identifica a versão exata dos Termos apresentada no momento do evento. Guarde este recibo para sua referência. O histórico também permanece disponível na sua conta, inclusive quando uma versão futura dos Termos for publicada.", 10, muted);
  page.drawLine({ start: { x: left, y: 55 }, end: { x: width - left, y: 55 }, thickness: 1, color: rgb(218 / 255, 228 / 255, 240 / 255) });
  page.drawText("Mesa OS - Mesa Dos Donos", { x: left, y: 36, size: 8.5, font: regular, color: muted });
  page.drawText("Recibo eletrônico verificável", { x: width - left - 128, y: 36, size: 8.5, font: regular, color: muted });
  return document.save();
}
