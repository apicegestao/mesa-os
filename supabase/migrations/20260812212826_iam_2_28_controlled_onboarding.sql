create type public.access_enrollment_status as enum ('pending', 'provisioned', 'revoked', 'expired');

create table public.access_enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email = lower(trim(email))),
  role public.membership_role not null,
  status public.access_enrollment_status not null default 'pending',
  expires_at timestamptz not null,
  provisioned_identity_id uuid references public.identities(id) on delete restrict,
  provisioned_at timestamptz,
  created_by uuid references public.identities(id) on delete set null,
  revoked_by uuid references public.identities(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at),
  check (
    (status = 'provisioned' and provisioned_identity_id is not null and provisioned_at is not null)
    or (status <> 'provisioned' and provisioned_identity_id is null and provisioned_at is null)
  ),
  check ((status = 'revoked') = (revoked_at is not null))
);

create unique index access_enrollments_one_pending_email_idx
  on public.access_enrollments (lower(email))
  where status = 'pending';
create index access_enrollments_organization_status_idx
  on public.access_enrollments (organization_id, status, expires_at);

create table public.access_enrollment_audits (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.access_enrollments(id) on delete restrict,
  event text not null check (event in ('created', 'provisioned', 'rejected', 'revoked', 'expired')),
  actor_identity_id uuid references public.identities(id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 4096)
);
create index access_enrollment_audits_enrollment_occurred_idx
  on public.access_enrollment_audits (enrollment_id, occurred_at desc);

alter table public.access_enrollments enable row level security;
alter table public.access_enrollment_audits enable row level security;

revoke all on public.access_enrollments, public.access_enrollment_audits from anon, authenticated;
