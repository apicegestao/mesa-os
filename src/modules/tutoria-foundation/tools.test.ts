import { describe, expect, it } from "vitest";
import { buildTutorIAMemberState, buildTutorIAMethodologySummary, isTutorIATool, TUTORIA_READ_TOOL_CATALOG } from "./tools";

describe("TutorIA read tool catalogue", () => {
  it("contains only the approved read tools", () => {
    expect(Object.keys(TUTORIA_READ_TOOL_CATALOG)).toEqual(["read_member_state", "read_methodology_map", "read_workbench_tool"]);
    expect(isTutorIATool("read_workbench_tool")).toBe(true);
    expect(isTutorIATool("write_evidence")).toBe(false);
  });

  it("builds a derived member state without free-form member content", () => {
    expect(buildTutorIAMemberState({ hasDiagnosticWorkspace: true, hasPriority: false, hasActiveCycle: true, hasAvailableMission: false, hasSubmittedEvidence: false })).toEqual({
      diagnosticWorkspace: "available", priority: "absent", cycle: "active", availableMission: "absent", evidence: "absent",
    });
  });

  it("summarizes a published methodology without exposing outcome text", () => {
    expect(buildTutorIAMethodologySummary({ stages: [{ id: "s", code: "t1", label: "Fundamentos", position: 1 }], pillars: [{ id: "p", code: "finance", label: "Financeiro", position: 1, outcomes: [{ id: "o", stageId: "s", title: "DRE" }] }] })).toEqual({
      status: "published", stageCount: 1, pillarCount: 1, outcomeCount: 1,
    });
  });

  it("marks a missing published methodology explicitly", () => {
    expect(buildTutorIAMethodologySummary(null)).toEqual({ status: "absent", stageCount: 0, pillarCount: 0, outcomeCount: 0 });
  });
});
