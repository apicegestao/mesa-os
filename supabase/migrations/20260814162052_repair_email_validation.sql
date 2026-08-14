-- Repair email validation patterns created with a double escape.
-- This is additive/corrective: no identity, member or financial fact is changed.

alter table public.crm_contacts
  drop constraint if exists crm_contacts_email_check,
  add constraint crm_contacts_email_check
    check (email is null or lower(email) ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.finance_provider_checkouts
  drop constraint if exists finance_provider_checkouts_payer_email_check,
  add constraint finance_provider_checkouts_payer_email_check
    check (payer_email = lower(trim(payer_email)) and payer_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

create or replace function public.create_internal_access_enrollment(
  target_organization_id uuid,
  target_email text,
  target_role public.membership_role,
  target_valid_for_hours integer default 72
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); normalized_email text := lower(trim(target_email)); enrollment_id uuid; staff_access_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'manage_enrollments') then raise exception 'concierge access required' using errcode = '42501'; end if;
  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'valid email required' using errcode = '22023'; end if;
  if target_valid_for_hours < 1 or target_valid_for_hours > 168 then raise exception 'validity must be between 1 and 168 hours' using errcode = '22023'; end if;
  if not exists (select 1 from public.organizations where id = target_organization_id) then raise exception 'organization not found' using errcode = 'P0002'; end if;
  if exists (select 1 from public.access_enrollments where lower(email) = normalized_email and status = 'pending') then raise exception 'a pending enrollment already exists for this email' using errcode = '23505'; end if;
  insert into public.access_enrollments (organization_id, email, role, status, expires_at, created_by)
  values (target_organization_id, normalized_email, target_role, 'pending', now() + make_interval(hours => target_valid_for_hours), actor_id) returning id into enrollment_id;
  insert into public.access_enrollment_audits (enrollment_id, event, actor_identity_id, metadata) values (enrollment_id, 'created', actor_id, jsonb_build_object('source', 'concierge'));
  select id into staff_access_id from public.internal_staff_access where identity_id = actor_id and status = 'active';
  insert into public.internal_staff_access_audits (staff_access_id, event, actor_identity_id, metadata) values (staff_access_id, 'enrollment_created', actor_id, jsonb_build_object('enrollment_id', enrollment_id, 'source', 'concierge'));
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id) values (actor_id, 'member_enrollment_created', 'access_enrollment', enrollment_id);
  return enrollment_id;
end;
$$;

revoke all on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from public;
revoke execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from anon;
grant execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) to authenticated;
