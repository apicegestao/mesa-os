import { describe, expect, it } from "vitest";
import { renderMesaDocument } from "./document-renderer";
import { DRE_WORKBENCH_SPEC } from "./tool-spec";

const workspace = { revisionId: "dre-1", spec: DRE_WORKBENCH_SPEC, payload: { period: "2026-08-01", revenue: 1000, variable_costs: 200, fixed_costs: 100, operating_expenses: 100 }, updatedAt: null };
describe("Mesa document renderer", () => {
  it("renders standards-compliant PDF and XLSX bytes", async () => {
    await expect(renderMesaDocument(workspace, "pdf")).resolves.toEqual(expect.objectContaining({ 0: 37, 1: 80, 2: 68, 3: 70 }));
    await expect(renderMesaDocument(workspace, "xlsx")).resolves.toEqual(expect.objectContaining({ 0: 80, 1: 75 }));
  });
});
