import { describe, expect, it } from "vitest";
import { selectDiagnosticRevision } from "./workspace";

describe("selectDiagnosticRevision", () => {
  const legacy = { id: "legacy", status: "retired" as const, version: 1 };
  const current = { id: "current", status: "published" as const, version: 2 };

  it("preserves the revision already used by the organization", () => {
    expect(selectDiagnosticRevision([legacy, current], [{ revision_id: "legacy", updated_at: "2026-08-01T10:00:00Z" }])).toEqual(legacy);
  });

  it("selects the newest published revision for a new organization", () => {
    expect(selectDiagnosticRevision([legacy, current], [])).toEqual(current);
  });
});
