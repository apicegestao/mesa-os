import { createClient } from "@supabase/supabase-js";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required runtime configuration: ${name}`);
  return value;
};

const enrollmentId = required("MESA_OS_ENROLLMENT_ID");
const supabaseUrl = required("SUPABASE_URL");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");

if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(enrollmentId)) {
  throw new Error("MESA_OS_ENROLLMENT_ID must be a UUID");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const fail = (message) => {
  throw new Error(message);
};

const { data: enrollment, error: enrollmentError } = await supabase
  .from("access_enrollments")
  .select("id, organization_id, email, role, status, expires_at")
  .eq("id", enrollmentId)
  .maybeSingle();

if (enrollmentError) fail("Unable to read authorized enrollment");
if (!enrollment) fail("Authorized enrollment was not found");
if (enrollment.status !== "pending") fail("Authorized enrollment is not pending");
if (new Date(enrollment.expires_at).getTime() <= Date.now()) {
  await supabase.from("access_enrollment_audits").insert({ enrollment_id: enrollment.id, event: "expired", metadata: {} });
  await supabase.from("access_enrollments").update({ status: "expired" }).eq("id", enrollment.id);
  fail("Authorized enrollment has expired");
}

const { data: existingIdentity, error: identityError } = await supabase
  .from("identities")
  .select("id")
  .eq("email", enrollment.email)
  .maybeSingle();

if (identityError) fail("Unable to inspect the authorized identity");

let identityId = existingIdentity?.id;
let createdIdentityId;

try {
  if (!identityId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: enrollment.email,
      email_confirm: true,
    });
    if (error || !data.user) fail("Unable to provision the authorized identity");
    identityId = data.user.id;
    createdIdentityId = data.user.id;
  }

  const { data: existingMembership, error: membershipReadError } = await supabase
    .from("memberships")
    .select("organization_id, role, status")
    .eq("identity_id", identityId)
    .maybeSingle();

  if (membershipReadError) fail("Unable to inspect the authorized membership");
  if (existingMembership && (
    existingMembership.organization_id !== enrollment.organization_id
    || existingMembership.role !== enrollment.role
    || existingMembership.status !== "active"
  )) {
    fail("Authorized identity already has an incompatible membership");
  }

  if (!existingMembership) {
    const { error } = await supabase.from("memberships").insert({
      identity_id: identityId,
      organization_id: enrollment.organization_id,
      role: enrollment.role,
      status: "active",
    });
    if (error) fail("Unable to create the authorized membership");
  }

  const occurredAt = new Date().toISOString();
  const { error: provisionError } = await supabase
    .from("access_enrollments")
    .update({ status: "provisioned", provisioned_identity_id: identityId, provisioned_at: occurredAt })
    .eq("id", enrollment.id)
    .eq("status", "pending");
  if (provisionError) fail("Unable to record authorized provisioning");

  const { error: auditError } = await supabase.from("access_enrollment_audits").insert({
    enrollment_id: enrollment.id,
    event: "provisioned",
    metadata: {},
  });
  if (auditError) fail("Unable to write provisioning audit");

  console.log(JSON.stringify({ status: "provisioned", enrollmentId: enrollment.id, identityId }));
} catch (error) {
  if (createdIdentityId) {
    await supabase.auth.admin.deleteUser(createdIdentityId).catch(() => undefined);
  }
  await supabase.from("access_enrollment_audits").insert({
    enrollment_id: enrollment.id,
    event: "rejected",
    metadata: { reason: "operational_provisioning_failed" },
  }).catch(() => undefined);
  throw error;
}
