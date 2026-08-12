import { z } from "zod";

export const enrollmentEmailSchema = z.string().trim().toLowerCase().email();
export const enrollmentRoleSchema = z.enum(["owner", "member"]);
export const enrollmentStatusSchema = z.enum(["pending", "provisioned", "revoked", "expired"]);

export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  email: enrollmentEmailSchema,
  role: enrollmentRoleSchema,
  status: enrollmentStatusSchema,
  expiresAt: z.coerce.date(),
});

export type AccessEnrollment = z.infer<typeof enrollmentSchema>;

export type ProvisioningDecision =
  | { status: "provision"; enrollment: AccessEnrollment }
  | { status: "reject"; reason: "not-pending" | "expired" };

export function decideProvisioning(enrollment: AccessEnrollment, now = new Date()): ProvisioningDecision {
  if (enrollment.status !== "pending") return { status: "reject", reason: "not-pending" };
  if (enrollment.expiresAt.getTime() <= now.getTime()) return { status: "reject", reason: "expired" };
  return { status: "provision", enrollment };
}
