import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260813214349_iam_2_29_segregated_access.sql"), "utf8");
const hardening = readFileSync(resolve(process.cwd(), "supabase/migrations/20260813214746_iam_2_29_rpc_privileges_hardening.sql"), "utf8");

describe("IAM-2.29 internal access migration", () => {
  it("keeps staff access separate from business membership roles", () => {
    expect(migration).toContain("capability = 'internal_operator'");
    expect(migration).toContain("internal staff access deny direct access");
    expect(migration).not.toContain("create type public.internal_operator");
  });

  it("denies direct table access and anonymous privileged RPC execution", () => {
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("revoke all on public.internal_staff_access, public.internal_staff_access_audits from anon, authenticated");
    expect(hardening).toContain("revoke execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from anon");
    expect(hardening).toContain("revoke execute on function public.revoke_internal_access_enrollment(uuid) from anon");
  });
});
