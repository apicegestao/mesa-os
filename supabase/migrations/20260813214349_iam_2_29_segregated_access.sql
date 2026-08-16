-- IAM-2.29: member access remains separate from Mesa's internal operations.
-- This migration deliberately creates no broad administrator role and grants
-- authenticated callers no direct read/write access to the operational tables.

create type public.internal_staff_access_status as enum ('active', 'revoked');

create table public.internal_staff_access (
  id uuid primary key default gen_random_uuid(),
  identity_id uuid not null unique references public.identities(id) on delete cascade,
  capability text not null default 'internal_operator' check (capability = 'internal_operator'),
  status public.internal_staff_access_status not null default 'active',
  activated_at timestamptz not null default now(),
  activated_by uuid references public.identities(id) on delete set null,
  revoked_at timestamptz,
  revoked_by uuid references public.identities(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'revoked') = (revoked_at is not null))
);

create index internal_staff_access_active_identity_idx
  on public.internal_staff_access (identity_id)
  where status = 'active';

create table public.internal_staff_access_audits (
  id uuid primary key default gen_random_uuid(),
  staff_access_id uuid not null references public.internal_staff_access(id) on delete restrict,
  event text not null check (event in ('granted', 'revoked', 'enrollment_created', 'enrollment_revoked')),
  actor_identity_id uuid references public.identities(id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 4096)
);

create index internal_staff_access_audits_access_occurred_idx
  on public.internal_staff_access_audits (staff_access_id, occurred_at desc);

alter table public.internal_staff_access enable row level security;
alter table public.internal_staff_access_audits enable row level security;

revoke all on public.internal_staff_access, public.internal_staff_access_audits from anon, authenticated;

create policy "internal staff access deny direct access"
  on public.internal_staff_access for all to anon, authenticated
  using (false) with check (false);

create policy "internal staff access audits deny direct access"
  on public.internal_staff_access_audits for all to anon, authenticated
  using (false) with check (false);

create or replace function private.is_active_internal_operator(target_identity_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.internal_staff_access access
    where access.identity_id = target_identity_id
      and access.capability = 'internal_operator'
      and access.status = 'active'
  );
$$;

revoke all on function private.is_active_internal_operator(uuid) from public;

create or replace function public.get_my_internal_operator_state()
returns table (active boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_active_internal_operator(auth.uid());
$$;

create or replace function public.create_internal_access_enrollment(
  target_organization_id uuid,
  target_email text,
  target_role public.membership_role,
  target_valid_for_hours integer default 72
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_email text := lower(trim(target_email));
  enrollment_id uuid;
  staff_access_id uuid;
begin
  if actor_id is null or not private.is_active_internal_operator(actor_id) then
    raise exception 'internal operator access required' using errcode = '42501';
  end if;

  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$' then
    raise exception 'valid email required' using errcode = '22023';
  end if;

  if target_valid_for_hours < 1 or target_valid_for_hours > 168 then
    raise exception 'validity must be between 1 and 168 hours' using errcode = '22023';
  end if;

  if not exists (select 1 from public.organizations where id = target_organization_id) then
    raise exception 'organization not found' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.access_enrollments
    where lower(email) = normalized_email and status = 'pending'
  ) then
    raise exception 'a pending enrollment already exists for this email' using errcode = '23505';
  end if;

  insert into public.access_enrollments (
    organization_id, email, role, status, expires_at, created_by
  ) values (
    target_organization_id, normalized_email, target_role, 'pending',
    now() + make_interval(hours => target_valid_for_hours), actor_id
  ) returning id into enrollment_id;

  insert into public.access_enrollment_audits (enrollment_id, event, actor_identity_id, metadata)
  values (enrollment_id, 'created', actor_id, jsonb_build_object('source', 'internal_operator'));

  select id into staff_access_id
  from public.internal_staff_access
  where identity_id = actor_id and status = 'active';

  insert into public.internal_staff_access_audits (staff_access_id, event, actor_identity_id, metadata)
  values (staff_access_id, 'enrollment_created', actor_id, jsonb_build_object('enrollment_id', enrollment_id));

  return enrollment_id;
end;
$$;

create or replace function public.revoke_internal_access_enrollment(target_enrollment_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  staff_access_id uuid;
begin
  if actor_id is null or not private.is_active_internal_operator(actor_id) then
    raise exception 'internal operator access required' using errcode = '42501';
  end if;

  update public.access_enrollments
  set status = 'revoked', revoked_by = actor_id, revoked_at = now(), updated_at = now()
  where id = target_enrollment_id and status = 'pending';

  if not found then
    raise exception 'pending enrollment not found' using errcode = 'P0002';
  end if;

  insert into public.access_enrollment_audits (enrollment_id, event, actor_identity_id, metadata)
  values (target_enrollment_id, 'revoked', actor_id, jsonb_build_object('source', 'internal_operator'));

  select id into staff_access_id
  from public.internal_staff_access
  where identity_id = actor_id and status = 'active';

  insert into public.internal_staff_access_audits (staff_access_id, event, actor_identity_id, metadata)
  values (staff_access_id, 'enrollment_revoked', actor_id, jsonb_build_object('enrollment_id', target_enrollment_id));
end;
$$;

create or replace function public.list_my_internal_access_enrollments()
returns table (
  id uuid,
  organization_id uuid,
  email text,
  role public.membership_role,
  status public.access_enrollment_status,
  expires_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select enrollment.id, enrollment.organization_id, enrollment.email, enrollment.role,
    enrollment.status, enrollment.expires_at, enrollment.created_at
  from public.access_enrollments enrollment
  where enrollment.created_by = auth.uid()
    and private.is_active_internal_operator(auth.uid())
  order by enrollment.created_at desc;
$$;

revoke all on function public.get_my_internal_operator_state() from public;
revoke all on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from public;
revoke all on function public.revoke_internal_access_enrollment(uuid) from public;
revoke all on function public.list_my_internal_access_enrollments() from public;
revoke execute on function public.get_my_internal_operator_state() from anon;
revoke execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from anon;
revoke execute on function public.revoke_internal_access_enrollment(uuid) from anon;
revoke execute on function public.list_my_internal_access_enrollments() from anon;

grant execute on function public.get_my_internal_operator_state() to authenticated;
grant execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) to authenticated;
grant execute on function public.revoke_internal_access_enrollment(uuid) to authenticated;
grant execute on function public.list_my_internal_access_enrollments() to authenticated;
