import { describe, expect, it } from "vitest";
import { DRE_WORKBENCH_SPEC, validateWorkbenchToolSpec } from "./tool-spec";

describe("TutorIA workbench tool specification", () => {
  it("defines a versioned DRE with structured inputs and exports", () => {
    expect(validateWorkbenchToolSpec(DRE_WORKBENCH_SPEC)).toEqual({ valid: true, spec: DRE_WORKBENCH_SPEC });
  });

  it("rejects a definition that would make tool data ambiguous", () => {
    expect(validateWorkbenchToolSpec({ ...DRE_WORKBENCH_SPEC, fields: [DRE_WORKBENCH_SPEC.fields[0], DRE_WORKBENCH_SPEC.fields[0]] })).toEqual({ valid: false, reason: "duplicate_field:period" });
  });

  it("requires options for a selectable field", () => {
    expect(validateWorkbenchToolSpec({ ...DRE_WORKBENCH_SPEC, fields: [{ code: "priority", label: "Prioridade", kind: "choice", required: true }] })).toEqual({ valid: false, reason: "choice_requires_options" });
  });
});
