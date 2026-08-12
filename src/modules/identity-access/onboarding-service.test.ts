import { describe, expect, it, vi } from "vitest";
import { provisionAuthorizedEnrollment, type EnrollmentRepository } from "./onboarding-service";

const enrollment = { id: "89d5c844-6c4a-4dc6-9ce8-37313557e9f7", organizationId: "03bc2f08-2c03-460b-ba7d-822d7d1d7611", email: "rafael@mesa.example", role: "owner" as const, status: "pending" as const, expiresAt: new Date("2026-08-20T12:00:00.000Z") };

describe("authorized enrollment provisioning", () => {
  it("uses the provisioner only for a valid enrollment", async () => {
    const repository: EnrollmentRepository = { findById: vi.fn().mockResolvedValue(enrollment), markProvisioned: vi.fn(), recordRejected: vi.fn() };
    const provisioner = { provision: vi.fn().mockResolvedValue({ identityId: "1ea1afcf-bfa1-443c-a796-aa5684a0d6b7" }) };
    await expect(provisionAuthorizedEnrollment({ enrollmentId: enrollment.id, repository, provisioner, now: new Date("2026-08-12T12:00:00.000Z") })).resolves.toMatchObject({ status: "provisioned" });
    expect(provisioner.provision).toHaveBeenCalledWith({ email: enrollment.email, organizationId: enrollment.organizationId, role: "owner" });
    expect(repository.markProvisioned).toHaveBeenCalledTimes(1);
  });

  it("never calls the provisioner for an expired enrollment", async () => {
    const repository: EnrollmentRepository = { findById: vi.fn().mockResolvedValue({ ...enrollment, expiresAt: new Date("2026-08-10T12:00:00.000Z") }), markProvisioned: vi.fn(), recordRejected: vi.fn() };
    const provisioner = { provision: vi.fn() };
    await expect(provisionAuthorizedEnrollment({ enrollmentId: enrollment.id, repository, provisioner, now: new Date("2026-08-12T12:00:00.000Z") })).resolves.toMatchObject({ status: "reject", reason: "expired" });
    expect(provisioner.provision).not.toHaveBeenCalled();
    expect(repository.recordRejected).toHaveBeenCalledTimes(1);
  });
});
