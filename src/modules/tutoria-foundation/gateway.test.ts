import { describe, expect, it, vi } from "vitest";
import { recordTutorIAReadGateway } from "./gateway";

const input = {
  authenticatedIdentityId: "00000000-0000-4000-8000-000000000001",
  organizationId: "00000000-0000-4000-8000-000000000002",
  membershipActive: true,
  requestedTool: "read_member_state" as const,
  sourceCodes: ["member_state"],
};

function createAuditClient(results: Record<string, { data?: { id: string } | null; error?: unknown }>) {
  const from = vi.fn((table: string) => ({
    insert: vi.fn(() => {
      const result = results[table] ?? { data: null, error: { code: "unexpected_table" } };
      if (table === "tutoria_tool_audits") return Promise.resolve(result);
      return { select: vi.fn(() => ({ single: vi.fn(async () => result) })) };
    }),
  }));
  return { from };
}

describe("TutorIA audit gateway", () => {
  it("records the approved, minimal read scope", async () => {
    const supabase = createAuditClient({
      tutoria_context_audits: { data: { id: "context" } },
      tutoria_policy_decisions: { data: { id: "decision" } },
      tutoria_tool_audits: { error: null },
    });

    await expect(recordTutorIAReadGateway({ ...input, supabase: supabase as never })).resolves.toEqual({ outcome: "allow", reasonCode: "read_only_allowed" });
    expect(supabase.from).toHaveBeenCalledWith("tutoria_context_audits");
    expect(supabase.from).toHaveBeenCalledWith("tutoria_policy_decisions");
    expect(supabase.from).toHaveBeenCalledWith("tutoria_tool_audits");
  });

  it("escalates rather than continuing if context auditing fails", async () => {
    const supabase = createAuditClient({ tutoria_context_audits: { data: null, error: { code: "rls_denied" } } });
    await expect(recordTutorIAReadGateway({ ...input, supabase: supabase as never })).resolves.toEqual({ outcome: "escalate", reasonCode: "audit_unavailable" });
  });

  it("escalates if the final tool audit cannot be written", async () => {
    const supabase = createAuditClient({
      tutoria_context_audits: { data: { id: "context" } },
      tutoria_policy_decisions: { data: { id: "decision" } },
      tutoria_tool_audits: { error: { code: "write_failed" } },
    });
    await expect(recordTutorIAReadGateway({ ...input, supabase: supabase as never })).resolves.toEqual({ outcome: "escalate", reasonCode: "audit_unavailable" });
  });
});
