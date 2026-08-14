create table public.internal_staff_enrollments (
  id uuid primary key default gen_random_uuid(),
  access_enrollment_id uuid not null unique references public.access_enrollments(id) on delete cascade,
  internal_role public.internal_staff_role not null,
  created_by uuid not null references public.identities(id) on delete restrict,
  provisioned_identity_id uuid references public.identities(id) on delete set null,
  provisioned_at timestamptz,
  created_at timestamptz not null default now(),
  check ((provisioned_identity_id is null) = (provisioned_at is null))
);

alter table public.internal_staff_enrollments enable row level security;
revoke all on public.internal_staff_enrollments from anon, authenticated;
create policy "internal staff enrollments deny direct access"
  on public.internal_staff_enrollments for all to anon, authenticated
  using (false) with check (false);

create or replace function private.create_internal_staff_enrollment(
  target_organization_id uuid,
  target_email text,
  target_membership_role public.membership_role,
  target_internal_role public.internal_staff_role,
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
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'manage_roles') then
    raise exception 'admin access required' using errcode = '42501';
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
  if exists (select 1 from public.access_enrollments where lower(email) = normalized_email and status = 'pending') then
    raise exception 'a pending enrollment already exists for this email' using errcode = '23505';
  end if;

  insert into public.access_enrollments (organization_id, email, role, status, expires_at, created_by)
  values (target_organization_id, normalized_email, target_membership_role, 'pending', now() + make_interval(hours => target_valid_for_hours), actor_id)
  returning id into enrollment_id;

  insert into public.internal_staff_enrollments (access_enrollment_id, internal_role, created_by)
  values (enrollment_id, target_internal_role, actor_id);

  insert into public.access_enrollment_audits (enrollment_id, event, actor_identity_id, metadata)
  values (enrollment_id, 'created', actor_id, jsonb_build_object('source', 'internal_staff_enrollment', 'internal_role', target_internal_role));
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'internal_staff_enrollment_created', 'access_enrollment', enrollment_id, jsonb_build_object('internal_role', target_internal_role));
  return enrollment_id;
end;
$$;

create or replace function public.create_internal_staff_enrollment(
  target_organization_id uuid,
  target_email text,
  target_membership_role public.membership_role,
  target_internal_role public.internal_staff_role,
  target_valid_for_hours integer default 72
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.create_internal_staff_enrollment($1, $2, $3, $4, $5);
$$;

create or replace function private.provision_internal_staff_enrollment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  enrollment_record public.internal_staff_enrollments%rowtype;
begin
  if new.status <> 'provisioned' or old.status = 'provisioned' or new.provisioned_identity_id is null then
    return new;
  end if;

  select * into enrollment_record
  from public.internal_staff_enrollments
  where access_enrollment_id = new.id
    and provisioned_at is null;
  if not found then
    return new;
  end if;

  insert into public.internal_staff_access (identity_id, capability, status, activated_by)
  values (new.provisioned_identity_id, 'internal_operator', 'active', enrollment_record.created_by)
  on conflict (identity_id) do update
    set status = 'active', revoked_at = null, revoked_by = null, updated_at = now();

  insert into public.internal_staff_role_assignments (identity_id, role, granted_by)
  values (new.provisioned_identity_id, enrollment_record.internal_role, enrollment_record.created_by)
  on conflict (identity_id, role) where status = 'active' do update set updated_at = now();

  update public.internal_staff_enrollments
  set provisioned_identity_id = new.provisioned_identity_id, provisioned_at = now()
  where id = enrollment_record.id;

  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (enrollment_record.created_by, 'internal_staff_enrollment_provisioned', 'internal_staff_enrollment', enrollment_record.id, jsonb_build_object('identity_id', new.provisioned_identity_id, 'internal_role', enrollment_record.internal_role));
  return new;
end;
$$;

drop trigger if exists provision_internal_staff_enrollment on public.access_enrollments;
create trigger provision_internal_staff_enrollment
  after update of status, provisioned_identity_id on public.access_enrollments
  for each row execute function private.provision_internal_staff_enrollment();

revoke all on function private.create_internal_staff_enrollment(uuid, text, public.membership_role, public.internal_staff_role, integer) from public, anon;
grant execute on function private.create_internal_staff_enrollment(uuid, text, public.membership_role, public.internal_staff_role, integer) to authenticated;
revoke all on function private.provision_internal_staff_enrollment() from public, anon, authenticated;
revoke all on function public.create_internal_staff_enrollment(uuid, text, public.membership_role, public.internal_staff_role, integer) from public, anon;
grant execute on function public.create_internal_staff_enrollment(uuid, text, public.membership_role, public.internal_staff_role, integer) to authenticated;
