import { describe, expect, it } from "vitest";
import { decideProvisioning, enrollmentSchema } from "./onboarding";

const validEnrollment = {
  id: "89d5c844-6c4a-4dc6-9ce8-37313557e9f7",
  organizationId: "03bc2f08-2c03-460b-ba7d-822d7d1d7611",
  email: " Rafael@Mesa.Example ",
  role: "owner",
  status: "pending",
  expiresAt: "2026-08-20T12:00:00.000Z",
};

describe("controlled onboarding", () => {
  it("normalizes the enrolled email before provisioning", () => {
    expect(enrollmentSchema.parse(validEnrollment).email).toBe("rafael@mesa.example");
  });

  it("provisions only a pending enrollment that has not expired", () => {
    const enrollment = enrollmentSchema.parse(validEnrollment);
    expect(decideProvisioning(enrollment, new Date("2026-08-12T12:00:00.000Z")).status).toBe("provision");
  });

  it("rejects an expired or previously consumed enrollment", () => {
    const enrollment = enrollmentSchema.parse(validEnrollment);
    expect(decideProvisioning(enrollment, new Date("2026-08-21T12:00:00.000Z"))).toMatchObject({ status: "reject", reason: "expired" });
    expect(decideProvisioning({ ...enrollment, status: "provisioned" })).toMatchObject({ status: "reject", reason: "not-pending" });
  });
});
