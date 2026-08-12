import { describe, expect, it } from "vitest";
import { DRE_WORKBENCH_SPEC, RACI_WORKBENCH_SPEC, SWOT_WORKBENCH_SPEC, validateWorkbenchPayload, validateWorkbenchToolSpec } from "./tool-spec";

describe("TutorIA workbench tool specification", () => {
  it("defines a versioned DRE with structured inputs and exports", () => {
    expect(validateWorkbenchToolSpec(DRE_WORKBENCH_SPEC)).toEqual({ valid: true, spec: DRE_WORKBENCH_SPEC });
  });

  it("defines RACI as a bounded repeatable workspace", () => {
    expect(validateWorkbenchToolSpec(RACI_WORKBENCH_SPEC)).toEqual({ valid: true, spec: RACI_WORKBENCH_SPEC });
    expect(validateWorkbenchPayload(RACI_WORKBENCH_SPEC, { roles: [{ role_name: "Operações", expected_result: "Entregar no prazo", responsibilities: "Coordenar rotina", decision_rights: "Reorganizar agenda" }] }).valid).toBe(true);
    expect(validateWorkbenchPayload(RACI_WORKBENCH_SPEC, { roles: [] })).toEqual({ valid: false, reason: "entries_count_required:roles" });
  });

  it("requires evidence-linked entries in every SWOT quadrant", () => {
    const payload = { strengths: [{ insight: "Marca reconhecida", evidence: "NPS recente" }], weaknesses: [{ insight: "Baixa margem", evidence: "DRE de julho" }], opportunities: [{ insight: "Novo canal", evidence: "Demanda recorrente" }], threats: [{ insight: "Concorrente regional", evidence: "Perda de propostas" }] };
    expect(validateWorkbenchToolSpec(SWOT_WORKBENCH_SPEC)).toEqual({ valid: true, spec: SWOT_WORKBENCH_SPEC });
    expect(validateWorkbenchPayload(SWOT_WORKBENCH_SPEC, payload).valid).toBe(true);
  });

  it("rejects a definition that would make tool data ambiguous", () => {
    expect(validateWorkbenchToolSpec({ ...DRE_WORKBENCH_SPEC, fields: [DRE_WORKBENCH_SPEC.fields[0], DRE_WORKBENCH_SPEC.fields[0]] })).toEqual({ valid: false, reason: "duplicate_field:period" });
  });

  it("requires options for a selectable field", () => {
    expect(validateWorkbenchToolSpec({ ...DRE_WORKBENCH_SPEC, fields: [{ code: "priority", label: "Prioridade", kind: "choice", required: true }] })).toEqual({ valid: false, reason: "choice_requires_options" });
  });

  it("accepts only structured values compatible with the published tool", () => {
    expect(validateWorkbenchPayload(DRE_WORKBENCH_SPEC, { period: "2026-08-01", revenue: 100_000, variable_costs: 40_000, fixed_costs: 20_000, operating_expenses: 30_000 })).toEqual({ valid: true, payload: { period: "2026-08-01", revenue: 100_000, variable_costs: 40_000, fixed_costs: 20_000, operating_expenses: 30_000 } });
    expect(validateWorkbenchPayload(DRE_WORKBENCH_SPEC, { period: "agosto", revenue: 100_000, variable_costs: 40_000, fixed_costs: 20_000, operating_expenses: 30_000 })).toEqual({ valid: false, reason: "date_value_required:period" });
  });
});
