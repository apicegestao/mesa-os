import { describe, expect, it } from "vitest";
import { parseWorkbenchSpec } from "./data";

describe("workbench revision parser", () => {
  it("maps the persisted revision into the canonical tool contract", () => {
    expect(parseWorkbenchSpec({ code: "dre_management_v1", version: 1, title: "DRE gerencial", development_outcomes: { code: "t1_finance_dre_dashboard" }, spec: { fields: [{ code: "period", label: "Período", kind: "date", required: true }], analysis_dimensions: ["margem"], export_formats: ["pdf"] } })).toEqual(expect.objectContaining({ methodologyOutcomeCode: "t1_finance_dre_dashboard", analysisDimensions: ["margem"] }));
  });

  it("normalizes persisted structured-entry settings without relaxing the canonical schema", () => {
    expect(parseWorkbenchSpec({ code: "raci_roles_decisions_v1", version: 1, title: "Mapa de papéis e decisões", development_outcomes: { code: "t1_leadership_roles_org_chart" }, spec: { fields: [{ code: "roles", label: "Papéis essenciais", kind: "entries", required: true, min_entries: 1, max_entries: 20, entry_fields: [{ code: "role_name", label: "Papel ou área", required: true, max_length: 80 }] }], analysis_dimensions: ["clareza"], export_formats: ["pdf"] } })).toEqual(expect.objectContaining({ fields: [expect.objectContaining({ code: "roles", minEntries: 1, maxEntries: 20, entryFields: [expect.objectContaining({ maxLength: 80 })] })] }));
  });
});
