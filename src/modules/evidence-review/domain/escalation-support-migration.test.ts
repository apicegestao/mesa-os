import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260815020000_evd_ai_3_3b_escalation_support_queue.sql"), "utf8");

describe("EVD-AI escalation support queue migration", () => {
  it("creates one traceable support case for an escalated evidence", () => {
    expect(migration).toContain("member_support_requests_source_evidence_unique");
    expect(migration).toContain("on conflict (source_evidence_id)");
    expect(migration).toContain("'management_decision'");
    expect(migration).toContain("'tutoria_evidence_review'");
  });

  it("keeps the privileged evidence decision unavailable to browser roles", () => {
    expect(migration).toContain("revoke all on function private.apply_tutoria_evidence_decision");
    expect(migration).toContain("from public, anon, authenticated");
  });
});
