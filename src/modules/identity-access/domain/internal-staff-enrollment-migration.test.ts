import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260814223000_internal_staff_enrollment.sql"), "utf8");

describe("internal staff enrollment migration", () => {
  it("keeps staff provisioning audited and inaccessible through direct table access", () => {
    expect(migration).toContain("internal_staff_enrollments enable row level security");
    expect(migration).toContain("internal staff enrollments deny direct access");
    expect(migration).toContain("internal_staff_enrollment_created");
    expect(migration).toContain("internal_staff_enrollment_provisioned");
  });

  it("uses an authenticated invoker boundary and private trigger", () => {
    expect(migration).toContain("security invoker");
    expect(migration).toContain("revoke all on function private.provision_internal_staff_enrollment() from public, anon, authenticated");
    expect(migration).toContain("grant execute on function public.create_internal_staff_enrollment");
  });
});
