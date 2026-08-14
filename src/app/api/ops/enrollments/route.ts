import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicEnv } from "@/shared/config/env";
import { createSupabaseServerClient } from "@/shared/infrastructure/supabase/server";

const enrollmentSchema = z.object({
  email: z.string().email().max(254),
  organizationId: z.string().uuid(),
  role: z.enum(["owner", "member"]),
  validForHours: z.number().int().min(1).max(168).default(72),
});

const staffEnrollmentSchema = z.object({
  email: z.string().email().max(254),
  organizationId: z.string().uuid(),
  membershipRole: z.enum(["owner", "member"]).default("owner"),
  internalRole: z.enum(["admin", "commercial", "concierge", "finance", "mentor"]).default("admin"),
  validForHours: z.number().int().min(1).max(168).default(72),
});

async function getOperatorClient() {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) return null;

  const { data, error } = await supabase.rpc("get_my_internal_operator_state");
  if (error || !data?.[0]?.active) return null;
  return supabase;
}

async function provisionEnrollment(supabase: Awaited<ReturnType<typeof getOperatorClient>>, enrollmentId: string) {
  if (!supabase) return false;
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) return false;

  const env = getPublicEnv();
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/provision-authorized-enrollment`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ enrollment_id: enrollmentId }),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const supabase = await getOperatorClient();
  if (!supabase) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await supabase.rpc("list_my_internal_access_enrollments");
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json({ enrollments: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const supabase = await getOperatorClient();
  if (!supabase) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = enrollmentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const { data: enrollmentId, error: enrollmentError } = await supabase.rpc("create_internal_access_enrollment", {
    target_email: parsed.data.email,
    target_organization_id: parsed.data.organizationId,
    target_role: parsed.data.role,
    target_valid_for_hours: parsed.data.validForHours,
  });
  if (enrollmentError || !enrollmentId) return NextResponse.json({ error: "enrollment_unavailable" }, { status: 422 });

  if (!await provisionEnrollment(supabase, enrollmentId)) {
    await supabase.rpc("revoke_internal_access_enrollment", { target_enrollment_id: enrollmentId });
    return NextResponse.json({ error: "provisioning_unavailable" }, { status: 503 });
  }

  return NextResponse.json({ status: "provisioned" }, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = await getOperatorClient();
  if (!supabase) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = staffEnrollmentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const rpc = supabase.rpc as unknown as (functionName: string, args: Record<string, unknown>) => Promise<{ data: string | null; error: unknown }>;
  const { data: enrollmentId, error: enrollmentError } = await rpc("create_internal_staff_enrollment", {
    target_email: parsed.data.email,
    target_organization_id: parsed.data.organizationId,
    target_membership_role: parsed.data.membershipRole,
    target_internal_role: parsed.data.internalRole,
    target_valid_for_hours: parsed.data.validForHours,
  });
  if (enrollmentError || !enrollmentId) return NextResponse.json({ error: "staff_enrollment_unavailable" }, { status: 422 });

  if (!await provisionEnrollment(supabase, enrollmentId)) {
    await supabase.rpc("revoke_internal_access_enrollment", { target_enrollment_id: enrollmentId });
    return NextResponse.json({ error: "provisioning_unavailable" }, { status: 503 });
  }

  return NextResponse.json({ status: "provisioned" }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await getOperatorClient();
  if (!supabase) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = z.object({ enrollmentId: z.string().uuid() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const { error } = await supabase.rpc("revoke_internal_access_enrollment", {
    target_enrollment_id: parsed.data.enrollmentId,
  });
  if (error) return NextResponse.json({ error: "revocation_unavailable" }, { status: 422 });
  return NextResponse.json({ status: "revoked" }, { headers: { "Cache-Control": "no-store" } });
}
