import { describe, expect, it } from "vitest";
import { canCreateOpportunities, canManageEnrollments, canManageRoles } from "./domain";

describe("internal CRM capabilities", () => {
  it("keeps commercial limited to CRM work", () => {
    expect(canCreateOpportunities(["commercial"])).toBe(true);
    expect(canManageEnrollments(["commercial"])).toBe(false);
    expect(canManageRoles(["commercial"])).toBe(false);
  });

  it("gives Concierge the controlled enrollment capability", () => {
    expect(canManageEnrollments(["concierge"])).toBe(true);
    expect(canCreateOpportunities(["concierge"])).toBe(false);
  });

  it("keeps role administration with admins", () => {
    expect(canManageRoles(["admin"])).toBe(true);
    expect(canCreateOpportunities(["admin"])).toBe(true);
  });
});
