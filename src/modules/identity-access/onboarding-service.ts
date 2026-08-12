import { decideProvisioning, enrollmentSchema, type AccessEnrollment } from "./domain/onboarding";

export type EnrollmentRepository = {
  findById(id: string): Promise<AccessEnrollment | null>;
  markProvisioned(input: { enrollmentId: string; identityId: string; occurredAt: Date }): Promise<void>;
  recordRejected(input: { enrollmentId: string; reason: "not-pending" | "expired"; occurredAt: Date }): Promise<void>;
};

export type IdentityProvisioner = {
  provision(input: { email: string; organizationId: string; role: "owner" | "member" }): Promise<{ identityId: string }>;
};

export async function provisionAuthorizedEnrollment(input: {
  enrollmentId: string;
  repository: EnrollmentRepository;
  provisioner: IdentityProvisioner;
  now?: Date;
}) {
  const candidate = await input.repository.findById(input.enrollmentId);
  if (!candidate) return { status: "not-found" as const };

  const enrollment = enrollmentSchema.parse(candidate);
  const now = input.now ?? new Date();
  const decision = decideProvisioning(enrollment, now);
  if (decision.status === "reject") {
    await input.repository.recordRejected({ enrollmentId: enrollment.id, reason: decision.reason, occurredAt: now });
    return decision;
  }

  const identity = await input.provisioner.provision({
    email: enrollment.email,
    organizationId: enrollment.organizationId,
    role: enrollment.role,
  });
  await input.repository.markProvisioned({ enrollmentId: enrollment.id, identityId: identity.identityId, occurredAt: now });
  return { status: "provisioned" as const, enrollmentId: enrollment.id, identityId: identity.identityId };
}
