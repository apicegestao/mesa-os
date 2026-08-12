import { describe, expect, it } from "vitest";
import { buildMesaDocumentPreview } from "./document-preview";
import { DRE_WORKBENCH_SPEC } from "./tool-spec";

describe("Mesa document preview", () => {
  it("keeps provenance, draft status and supported formats explicit", () => {
    const preview = buildMesaDocumentPreview({ revisionId: "dre-1", spec: DRE_WORKBENCH_SPEC, payload: { period: "2026-08-01", revenue: 1000 }, updatedAt: null }, "2026-08-12T12:00:00.000Z");
    expect(preview).toMatchObject({ brand: "Mesa dos Donos", status: "draft", toolVersion: 1, formats: ["pdf", "xlsx"] });
    expect(preview.sections.find((section) => section.label === "Receita líquida")?.value).toBe("1000");
  });
});
