import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildTermsReceiptPdf } from "./receipt-pdf";

describe("Terms receipt PDF", () => {
  it("creates a one-page PDF with a verifiable acceptance record", async () => {
    const bytes = await buildTermsReceiptPdf({ receiptId: "e35c9197-af0a-4d7a-a31b-4f0ce92d9a33", event: "accepted", occurredAt: "2026-08-12T15:30:00.000Z", hash: "a".repeat(64), title: "Termos de Uso - Mesa dos Donos / Mesa OS", version: 1 });
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBe(1);
    expect(document.getTitle()).toContain("Recibo de aceite");
  });
});
