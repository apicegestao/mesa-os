import { describe, expect, it } from "vitest";
import { parseWorkbenchSpec } from "./data";

describe("workbench revision parser", () => {
  it("maps the persisted revision into the canonical tool contract", () => {
    expect(parseWorkbenchSpec({ code: "dre_management_v1", version: 1, title: "DRE gerencial", development_outcomes: { code: "t1_finance_dre_dashboard" }, spec: { fields: [{ code: "period", label: "Período", kind: "date", required: true }], analysis_dimensions: ["margem"], export_formats: ["pdf"] } })).toEqual(expect.objectContaining({ methodologyOutcomeCode: "t1_finance_dre_dashboard", analysisDimensions: ["margem"] }));
  });
});
