-- OPS-3.0A: internal CRM and controlled Commercial -> Concierge handoff.
-- No member methodology, TutorIA, payment, provider or communication data belongs here.

create type public.internal_staff_role as enum ('admin', 'commercial', 'concierge');
create type public.internal_staff_role_assignment_status as enum ('active', 'revoked');
create type public.crm_opportunity_stage as enum ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
create type public.crm_task_status as enum ('open', 'done', 'cancelled');
create type public.crm_handoff_status as enum ('pending', 'accepted', 'enrollment_requested', 'completed', 'cancelled');

create table public.internal_staff_role_assignments (
  id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references public.identities(id) on delete cascade,
  role public.internal_staff_role not null,
  status public.internal_staff_role_assignment_status not null default 'active',
  granted_at timestamptz not null default now(),
  granted_by uuid references public.identities(id) on delete set null,
  revoked_at timestamptz,
  revoked_by uuid references public.identities(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'revoked') = (revoked_at is not null))
);

create unique index internal_staff_role_assignments_active_identity_role_idx
  on public.internal_staff_role_assignments (identity_id, role)
  where status = 'active';

create table public.internal_ops_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_identity_id uuid references public.identities(id) on delete set null,
  action text not null check (char_length(action) between 3 and 120),
  resource_type text not null check (char_length(resource_type) between 3 and 80),
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 4096),
  occurred_at timestamptz not null default now()
);

create index internal_ops_audit_events_resource_idx
  on public.internal_ops_audit_events (resource_type, resource_id, occurred_at desc);

create table public.crm_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 180),
  source text not null default 'manual' check (char_length(trim(source)) between 2 and 80),
  created_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crm_accounts_name_idx on public.crm_accounts (lower(name));

create table public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.crm_accounts(id) on delete restrict,
  full_name text not null check (char_length(trim(full_name)) between 2 and 180),
  email text check (email is null or lower(email) ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'),
  phone text check (phone is null or char_length(trim(phone)) between 7 and 32),
  created_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crm_contacts_account_idx on public.crm_contacts (account_id);
create index crm_contacts_email_idx on public.crm_contacts (lower(email)) where email is not null;

create table public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.crm_accounts(id) on delete restrict,
  primary_contact_id uuid references public.crm_contacts(id) on delete set null,
  title text not null check (char_length(trim(title)) between 2 and 180),
  stage public.crm_opportunity_stage not null default 'new',
  expected_value numeric(12, 2) check (expected_value is null or expected_value >= 0),
  currency_code text not null default 'BRL' check (currency_code ~ '^[A-Z]{3}$'),
  next_action text not null check (char_length(trim(next_action)) between 2 and 500),
  next_action_due_on date,
  owner_identity_id uuid not null references public.identities(id) on delete restrict,
  won_at timestamptz,
  lost_at timestamptz,
  lost_reason text check (lost_reason is null or char_length(trim(lost_reason)) <= 500),
  created_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((stage = 'won') = (won_at is not null)),
  check ((stage = 'lost') = (lost_at is not null)),
  check (stage <> 'lost' or lost_reason is not null)
);

create index crm_opportunities_owner_stage_idx
  on public.crm_opportunities (owner_identity_id, stage, next_action_due_on);
create index crm_opportunities_account_idx on public.crm_opportunities (account_id);

create table public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.crm_opportunities(id) on delete restrict,
  kind text not null check (kind in ('note', 'call', 'meeting', 'email', 'status_change', 'handoff')),
  summary text not null check (char_length(trim(summary)) between 2 and 1500),
  occurred_at timestamptz not null default now(),
  created_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index crm_activities_opportunity_occurred_idx
  on public.crm_activities (opportunity_id, occurred_at desc);

create table public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.crm_opportunities(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 2 and 300),
  due_on date,
  status public.crm_task_status not null default 'open',
  assignee_identity_id uuid not null references public.identities(id) on delete restrict,
  completed_at timestamptz,
  created_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'done') = (completed_at is not null))
);

create index crm_tasks_assignee_status_due_idx
  on public.crm_tasks (assignee_identity_id, status, due_on);

create table public.crm_onboarding_handoffs (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null unique references public.crm_opportunities(id) on delete restrict,
  concierge_identity_id uuid not null references public.identities(id) on delete restrict,
  status public.crm_handoff_status not null default 'pending',
  checklist jsonb not null default '{}'::jsonb
    check (jsonb_typeof(checklist) = 'object' and octet_length(checklist::text) <= 8192),
  created_by uuid not null references public.identities(id) on delete restrict,
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status in ('accepted', 'enrollment_requested', 'completed')) = (accepted_at is not null)),
  check ((status = 'completed') = (completed_at is not null)),
  check ((status = 'cancelled') = (cancelled_at is not null))
);

create index crm_onboarding_handoffs_concierge_status_idx
  on public.crm_onboarding_handoffs (concierge_identity_id, status, created_at desc);

alter table public.internal_staff_role_assignments enable row level security;
alter table public.internal_ops_audit_events enable row level security;
alter table public.crm_accounts enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_opportunities enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.crm_onboarding_handoffs enable row level security;

revoke all on public.internal_staff_role_assignments, public.internal_ops_audit_events,
  public.crm_accounts, public.crm_contacts, public.crm_opportunities, public.crm_activities,
  public.crm_tasks, public.crm_onboarding_handoffs from anon, authenticated;

create policy "internal roles deny direct access" on public.internal_staff_role_assignments for all to anon, authenticated using (false) with check (false);
create policy "internal ops audits deny direct access" on public.internal_ops_audit_events for all to anon, authenticated using (false) with check (false);
create policy "crm accounts deny direct access" on public.crm_accounts for all to anon, authenticated using (false) with check (false);
create policy "crm contacts deny direct access" on public.crm_contacts for all to anon, authenticated using (false) with check (false);
create policy "crm opportunities deny direct access" on public.crm_opportunities for all to anon, authenticated using (false) with check (false);
create policy "crm activities deny direct access" on public.crm_activities for all to anon, authenticated using (false) with check (false);
create policy "crm tasks deny direct access" on public.crm_tasks for all to anon, authenticated using (false) with check (false);
create policy "crm handoffs deny direct access" on public.crm_onboarding_handoffs for all to anon, authenticated using (false) with check (false);

create or replace function private.has_internal_role(target_identity_id uuid, target_role public.internal_staff_role)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_active_internal_operator(target_identity_id)
    and exists (
      select 1 from public.internal_staff_role_assignments assignment
      where assignment.identity_id = target_identity_id
        and assignment.role = target_role
        and assignment.status = 'active'
    );
$$;

create or replace function private.has_internal_capability(target_identity_id uuid, target_capability text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case target_capability
    when 'manage_roles' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_all' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_write_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_assign' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_handoff_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'handoff_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'handoff_accept_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'manage_enrollments' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    else false
  end;
$$;

revoke all on function private.has_internal_role(uuid, public.internal_staff_role) from public;
revoke all on function private.has_internal_capability(uuid, text) from public;

create or replace function public.bootstrap_first_internal_admin()
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.is_active_internal_operator(actor_id) then
    raise exception 'internal operator access required' using errcode = '42501';
  end if;
  if exists (select 1 from public.internal_staff_role_assignments where status = 'active') then
    raise exception 'initial admin already bootstrapped' using errcode = '42501';
  end if;
  insert into public.internal_staff_role_assignments (identity_id, role, granted_by)
  values (actor_id, 'admin', actor_id);
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'bootstrap_admin', 'internal_staff_role_assignment', actor_id, '{}'::jsonb);
end;
$$;

create or replace function public.assign_internal_staff_role(target_identity_id uuid, target_role public.internal_staff_role)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); assignment_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'manage_roles') then
    raise exception 'admin access required' using errcode = '42501';
  end if;
  if not private.is_active_internal_operator(target_identity_id) then
    raise exception 'target must be an active internal operator' using errcode = '42501';
  end if;
  insert into public.internal_staff_role_assignments (identity_id, role, granted_by)
  values (target_identity_id, target_role, actor_id)
  on conflict (identity_id, role) where status = 'active' do update set updated_at = now()
  returning id into assignment_id;
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'role_assigned', 'internal_staff_role_assignment', assignment_id, jsonb_build_object('role', target_role, 'target_identity_id', target_identity_id));
  return assignment_id;
end;
$$;

create or replace function public.get_my_internal_ops_state()
returns table (active boolean, roles public.internal_staff_role[]) language sql stable security definer set search_path = '' as $$
  select private.is_active_internal_operator(auth.uid()), coalesce(array_agg(assignment.role order by assignment.role), '{}'::public.internal_staff_role[])
  from public.internal_staff_role_assignments assignment
  where assignment.identity_id = auth.uid() and assignment.status = 'active';
$$;

create or replace function public.list_active_internal_operators()
returns table (identity_id uuid, email text, roles public.internal_staff_role[])
language sql stable security definer set search_path = '' as $$
  select access.identity_id, identity.email,
    coalesce(array_agg(assignment.role order by assignment.role) filter (where assignment.status = 'active'), '{}'::public.internal_staff_role[])
  from public.internal_staff_access access
  join public.identities identity on identity.id = access.identity_id
  left join public.internal_staff_role_assignments assignment on assignment.identity_id = access.identity_id
  where private.has_internal_capability(auth.uid(), 'manage_roles')
    and access.status = 'active'
  group by access.identity_id, identity.email
  order by identity.email;
$$;

create or replace function public.create_crm_opportunity(
  target_account_name text,
  target_source text,
  target_contact_name text,
  target_contact_email text,
  target_title text,
  target_expected_value numeric,
  target_next_action text,
  target_next_action_due_on date
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); account_id uuid; contact_id uuid; opportunity_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'crm_write_assigned') then
    raise exception 'commercial access required' using errcode = '42501';
  end if;
  if char_length(trim(target_account_name)) not between 2 and 180 or char_length(trim(target_title)) not between 2 and 180 or char_length(trim(target_next_action)) not between 2 and 500 then
    raise exception 'invalid CRM payload' using errcode = '22023';
  end if;
  insert into public.crm_accounts (name, source, created_by) values (trim(target_account_name), coalesce(nullif(trim(target_source), ''), 'manual'), actor_id) returning id into account_id;
  if target_contact_name is not null and char_length(trim(target_contact_name)) >= 2 then
    insert into public.crm_contacts (account_id, full_name, email, created_by) values (account_id, trim(target_contact_name), nullif(lower(trim(target_contact_email)), ''), actor_id) returning id into contact_id;
  end if;
  insert into public.crm_opportunities (account_id, primary_contact_id, title, expected_value, next_action, next_action_due_on, owner_identity_id, created_by)
  values (account_id, contact_id, trim(target_title), target_expected_value, trim(target_next_action), target_next_action_due_on, actor_id, actor_id) returning id into opportunity_id;
  insert into public.crm_activities (opportunity_id, kind, summary, created_by) values (opportunity_id, 'note', 'Oportunidade criada.', actor_id);
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id)
  values (actor_id, 'crm_opportunity_created', 'crm_opportunity', opportunity_id);
  return opportunity_id;
end;
$$;

create or replace function public.get_my_crm_workspace()
returns jsonb language sql stable security definer set search_path = '' as $$
  with actor as (select auth.uid() as identity_id),
  opportunities as (
    select opportunity.id, opportunity.title, opportunity.stage, opportunity.next_action, opportunity.next_action_due_on,
      opportunity.expected_value, opportunity.currency_code, account.name as account_name, opportunity.owner_identity_id
    from public.crm_opportunities opportunity
    join public.crm_accounts account on account.id = opportunity.account_id
    cross join actor
    where private.has_internal_capability(actor.identity_id, 'crm_read_all')
      or (private.has_internal_capability(actor.identity_id, 'crm_read_assigned') and opportunity.owner_identity_id = actor.identity_id)
  ), handoffs as (
    select handoff.id, handoff.status, handoff.created_at, opportunity.title as opportunity_title, account.name as account_name
    from public.crm_onboarding_handoffs handoff
    join public.crm_opportunities opportunity on opportunity.id = handoff.opportunity_id
    join public.crm_accounts account on account.id = opportunity.account_id
    cross join actor
    where private.has_internal_capability(actor.identity_id, 'crm_read_all')
      or (private.has_internal_capability(actor.identity_id, 'handoff_read_assigned') and handoff.concierge_identity_id = actor.identity_id)
  )
  select jsonb_build_object(
    'opportunities', coalesce((select jsonb_agg(to_jsonb(opportunities) order by next_action_due_on nulls last, title) from opportunities), '[]'::jsonb),
    'handoffs', coalesce((select jsonb_agg(to_jsonb(handoffs) order by created_at desc) from handoffs), '[]'::jsonb)
  );
$$;

create or replace function public.create_crm_handoff(target_opportunity_id uuid, target_concierge_identity_id uuid, target_checklist jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); handoff_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'crm_handoff_create') then
    raise exception 'commercial access required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.crm_opportunities where id = target_opportunity_id and stage = 'won' and (owner_identity_id = actor_id or private.has_internal_capability(actor_id, 'crm_read_all'))) then
    raise exception 'won opportunity access required' using errcode = '42501';
  end if;
  if not private.has_internal_role(target_concierge_identity_id, 'concierge') then
    raise exception 'active concierge required' using errcode = '42501';
  end if;
  if jsonb_typeof(target_checklist) <> 'object' or octet_length(target_checklist::text) > 8192 then
    raise exception 'invalid checklist' using errcode = '22023';
  end if;
  insert into public.crm_onboarding_handoffs (opportunity_id, concierge_identity_id, checklist, created_by)
  values (target_opportunity_id, target_concierge_identity_id, target_checklist, actor_id) returning id into handoff_id;
  insert into public.crm_activities (opportunity_id, kind, summary, created_by) values (target_opportunity_id, 'handoff', 'Handoff enviado para Concierge.', actor_id);
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id)
  values (actor_id, 'crm_handoff_created', 'crm_onboarding_handoff', handoff_id);
  return handoff_id;
end;
$$;

create or replace function public.accept_crm_handoff(target_handoff_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'handoff_accept_assigned') then
    raise exception 'concierge access required' using errcode = '42501';
  end if;
  update public.crm_onboarding_handoffs
  set status = 'accepted', accepted_at = now(), updated_at = now()
  where id = target_handoff_id and status = 'pending'
    and (concierge_identity_id = actor_id or private.has_internal_capability(actor_id, 'crm_read_all'));
  if not found then raise exception 'handoff unavailable' using errcode = 'P0002'; end if;
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id)
  values (actor_id, 'crm_handoff_accepted', 'crm_onboarding_handoff', target_handoff_id);
end;
$$;

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
  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$' then raise exception 'valid email required' using errcode = '22023'; end if;
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

create or replace function public.revoke_internal_access_enrollment(target_enrollment_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); staff_access_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'manage_enrollments') then raise exception 'concierge access required' using errcode = '42501'; end if;
  update public.access_enrollments set status = 'revoked', revoked_by = actor_id, revoked_at = now(), updated_at = now()
  where id = target_enrollment_id and status = 'pending';
  if not found then raise exception 'pending enrollment not found' using errcode = 'P0002'; end if;
  insert into public.access_enrollment_audits (enrollment_id, event, actor_identity_id, metadata) values (target_enrollment_id, 'revoked', actor_id, jsonb_build_object('source', 'concierge'));
  select id into staff_access_id from public.internal_staff_access where identity_id = actor_id and status = 'active';
  insert into public.internal_staff_access_audits (staff_access_id, event, actor_identity_id, metadata) values (staff_access_id, 'enrollment_revoked', actor_id, jsonb_build_object('enrollment_id', target_enrollment_id, 'source', 'concierge'));
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id) values (actor_id, 'member_enrollment_revoked', 'access_enrollment', target_enrollment_id);
end;
$$;

create or replace function public.list_my_internal_access_enrollments()
returns table (id uuid, organization_id uuid, email text, role public.membership_role, status public.access_enrollment_status, expires_at timestamptz, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select enrollment.id, enrollment.organization_id, enrollment.email, enrollment.role, enrollment.status, enrollment.expires_at, enrollment.created_at
  from public.access_enrollments enrollment
  where enrollment.created_by = auth.uid()
    and private.has_internal_capability(auth.uid(), 'manage_enrollments')
  order by enrollment.created_at desc;
$$;

revoke all on function public.bootstrap_first_internal_admin() from public;
revoke all on function public.assign_internal_staff_role(uuid, public.internal_staff_role) from public;
revoke all on function public.get_my_internal_ops_state() from public;
revoke all on function public.list_active_internal_operators() from public;
revoke all on function public.create_crm_opportunity(text, text, text, text, text, numeric, text, date) from public;
revoke all on function public.get_my_crm_workspace() from public;
revoke all on function public.create_crm_handoff(uuid, uuid, jsonb) from public;
revoke all on function public.accept_crm_handoff(uuid) from public;
revoke all on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from public;
revoke execute on function public.bootstrap_first_internal_admin() from anon;
revoke execute on function public.assign_internal_staff_role(uuid, public.internal_staff_role) from anon;
revoke execute on function public.get_my_internal_ops_state() from anon;
revoke execute on function public.list_active_internal_operators() from anon;
revoke execute on function public.create_crm_opportunity(text, text, text, text, text, numeric, text, date) from anon;
revoke execute on function public.get_my_crm_workspace() from anon;
revoke execute on function public.create_crm_handoff(uuid, uuid, jsonb) from anon;
revoke execute on function public.accept_crm_handoff(uuid) from anon;
revoke execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from anon;
grant execute on function public.bootstrap_first_internal_admin() to authenticated;
grant execute on function public.assign_internal_staff_role(uuid, public.internal_staff_role) to authenticated;
grant execute on function public.get_my_internal_ops_state() to authenticated;
grant execute on function public.list_active_internal_operators() to authenticated;
grant execute on function public.create_crm_opportunity(text, text, text, text, text, numeric, text, date) to authenticated;
grant execute on function public.get_my_crm_workspace() to authenticated;
grant execute on function public.create_crm_handoff(uuid, uuid, jsonb) to authenticated;
grant execute on function public.accept_crm_handoff(uuid) to authenticated;
grant execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) to authenticated;
