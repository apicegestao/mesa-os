import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260816124755_gem_3_5_direct_provider_audit.sql"), "utf8");

describe("Gemini direct provider audit migration", () => {
  it("extends only the bounded provider vocabulary", () => {
    expect(migration).toContain("drop constraint if exists tutoria_orientation_audits_provider_code_check");
    expect(migration).toContain("'gemini_direct', 'netlify_ai_gateway', 'none'");
    expect(migration).not.toMatch(/grant\s+/i);
    expect(migration).not.toMatch(/create\s+(table|function|policy)/i);
  });
});
