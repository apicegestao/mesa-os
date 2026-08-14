import { createClient } from "npm:@supabase/supabase-js@2";

type Enrollment = {
  id: string;
  organization_id: string;
  email: string;
  role: "owner" | "member";
  status: "pending" | "provisioned" | "revoked" | "expired";
  expires_at: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(status: number, body: Record<string, string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function getVerifiedCallerRole(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  try {
    // The platform validates the JWT before this handler runs (verify_jwt=true).
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (getVerifiedCallerRole(request) !== "service_role") return json(403, { error: "forbidden" });

  let enrollmentId: string;
  try {
    const body = await request.json();
    enrollmentId = typeof body.enrollment_id === "string" ? body.enrollment_id : "";
  } catch {
    return json(400, { error: "invalid_request" });
  }

  if (!uuidPattern.test(enrollmentId)) return json(400, { error: "invalid_request" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("access_enrollments")
    .select("id, organization_id, email, role, status, expires_at")
    .eq("id", enrollmentId)
    .maybeSingle<Enrollment>();

  if (enrollmentError || !enrollment) return json(404, { error: "not_found" });
  // An upstream retry after a successful invocation must be harmless.
  if (enrollment.status === "provisioned") {
    return json(200, { status: "already_provisioned", enrollment_id: enrollment.id });
  }
  if (enrollment.status !== "pending") return json(409, { error: "not_pending" });

  if (new Date(enrollment.expires_at).getTime() <= Date.now()) {
    await supabase.from("access_enrollment_audits").insert({ enrollment_id: enrollment.id, event: "expired", metadata: {} });
    await supabase.from("access_enrollments").update({ status: "expired" }).eq("id", enrollment.id).eq("status", "pending");
    return json(409, { error: "expired" });
  }

  const { data: existingIdentity, error: identityError } = await supabase
    .from("identities")
    .select("id")
    .eq("email", enrollment.email)
    .maybeSingle<{ id: string }>();

  if (identityError) return json(500, { error: "provisioning_failed" });

  let identityId = existingIdentity?.id;
  let createdIdentityId: string | undefined;

  try {
    if (!identityId) {
      const { data, error } = await supabase.auth.admin.createUser({ email: enrollment.email, email_confirm: true });
      if (error || !data.user) throw new Error("identity_provision_failed");
      identityId = data.user.id;
      createdIdentityId = data.user.id;
    }

    const { data: membership, error: membershipReadError } = await supabase
      .from("memberships")
      .select("organization_id, role, status")
      .eq("identity_id", identityId)
      .maybeSingle<{ organization_id: string; role: "owner" | "member"; status: "active" | "revoked" }>();

    if (membershipReadError) throw new Error("membership_read_failed");
    if (membership && (
      membership.organization_id !== enrollment.organization_id
      || membership.role !== enrollment.role
      || membership.status !== "active"
    )) throw new Error("membership_conflict");

    if (!membership) {
      const { error } = await supabase.from("memberships").insert({
        identity_id: identityId,
        organization_id: enrollment.organization_id,
        role: enrollment.role,
        status: "active",
      });
      if (error) throw new Error("membership_provision_failed");
    }

    const { error: provisionError } = await supabase
      .from("access_enrollments")
      .update({ status: "provisioned", provisioned_identity_id: identityId, provisioned_at: new Date().toISOString() })
      .eq("id", enrollment.id)
      .eq("status", "pending");
    if (provisionError) throw new Error("enrollment_update_failed");

    const { error: auditError } = await supabase.from("access_enrollment_audits").insert({
      enrollment_id: enrollment.id,
      event: "provisioned",
      metadata: {},
    });
    if (auditError) throw new Error("audit_write_failed");

    return json(200, { status: "provisioned", enrollment_id: enrollment.id, identity_id: identityId });
  } catch {
    if (createdIdentityId) await supabase.auth.admin.deleteUser(createdIdentityId).catch(() => undefined);
    await supabase.from("access_enrollment_audits").insert({
      enrollment_id: enrollment.id,
      event: "rejected",
      metadata: { reason: "operational_provisioning_failed" },
    }).catch(() => undefined);
    return json(500, { error: "provisioning_failed" });
  }
});
