import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "supabase/functions/provision-authorized-enrollment/index.ts"), "utf8");

describe("authorized enrollment edge function", () => {
  it("keeps gateway JWT verification and accepts only authorized internal callers", () => {
    expect(source).toContain("verify_jwt=true");
    expect(source).toContain('in("role", ["admin", "concierge"])');
    expect(source).toContain('eq("capability", "internal_operator")');
    expect(source).toContain('caller.role !== "service_role"');
  });
});
