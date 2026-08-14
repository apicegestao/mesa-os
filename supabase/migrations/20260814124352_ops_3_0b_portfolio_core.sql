-- OPS-3.0B: purpose-bound internal portfolios. The tables are never directly readable.
create type public.internal_portfolio_kind as enum ('concierge', 'mentor');
create type public.internal_portfolio_assignment_status as enum ('active', 'revoked');

create table public.internal_portfolio_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  assignee_identity_id uuid not null references public.identities(id) on delete restrict,
  kind public.internal_portfolio_kind not null,
  status public.internal_portfolio_assignment_status not null default 'active',
  reason text check (reason is null or char_length(trim(reason)) between 3 and 500),
  assigned_by uuid not null references public.identities(id) on delete restrict,
  assigned_at timestamptz not null default now(),
  revoked_by uuid references public.identities(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'revoked') = (revoked_at is not null))
);

create unique index internal_portfolio_assignments_active_scope_idx
  on public.internal_portfolio_assignments (organization_id, assignee_identity_id, kind)
  where status = 'active';
create index internal_portfolio_assignments_assignee_idx
  on public.internal_portfolio_assignments (assignee_identity_id, kind, assigned_at desc)
  where status = 'active';

create table public.internal_portfolio_audit_events (
  id uuid primary key default gen_random_uuid(),
  portfolio_assignment_id uuid references public.internal_portfolio_assignments(id) on delete set null,
  actor_identity_id uuid references public.identities(id) on delete set null,
  action text not null check (action in ('assigned', 'revoked', 'read')),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 2048),
  occurred_at timestamptz not null default now()
);
create index internal_portfolio_audit_events_assignment_idx
  on public.internal_portfolio_audit_events (portfolio_assignment_id, occurred_at desc);

alter table public.internal_portfolio_assignments enable row level security;
alter table public.internal_portfolio_audit_events enable row level security;
revoke all on public.internal_portfolio_assignments, public.internal_portfolio_audit_events from anon, authenticated;
create policy "portfolio assignments deny direct access" on public.internal_portfolio_assignments for all to anon, authenticated using (false) with check (false);
create policy "portfolio audits deny direct access" on public.internal_portfolio_audit_events for all to anon, authenticated using (false) with check (false);

create or replace function private.has_internal_capability(target_identity_id uuid, target_capability text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case target_capability
    when 'manage_roles' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_all' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_write_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_handoff_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'handoff_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'handoff_accept_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'manage_enrollments' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'finance_catalog_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_read_all' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_proposal_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance') or private.has_internal_role(target_identity_id, 'commercial')
    when 'finance_contract_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'portfolio_manage' then private.has_internal_role(target_identity_id, 'admin')
    when 'portfolio_read_assigned' then private.has_internal_role(target_identity_id, 'concierge') or private.has_internal_role(target_identity_id, 'mentor')
    else false
  end;
$$;

create or replace function public.list_portfolio_organizations()
returns table (organization_id uuid, organization_name text)
language sql stable security definer set search_path = '' as $$
  select organization.id, organization.name
  from public.organizations organization
  where private.has_internal_capability(auth.uid(), 'portfolio_manage')
  order by organization.name;
$$;

create or replace function public.assign_internal_portfolio(
  target_organization_id uuid,
  target_assignee_identity_id uuid,
  target_kind public.internal_portfolio_kind,
  target_reason text default null
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); assignment_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'portfolio_manage') then
    raise exception 'admin portfolio access required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.organizations where id = target_organization_id) then
    raise exception 'organization not found' using errcode = 'P0002';
  end if;
  if not private.has_internal_role(target_assignee_identity_id, target_kind::text::public.internal_staff_role) then
    raise exception 'assignee must have the matching active internal role' using errcode = '42501';
  end if;
  if target_reason is not null and char_length(trim(target_reason)) not between 3 and 500 then
    raise exception 'invalid assignment reason' using errcode = '22023';
  end if;
  insert into public.internal_portfolio_assignments (organization_id, assignee_identity_id, kind, reason, assigned_by)
  values (target_organization_id, target_assignee_identity_id, target_kind, nullif(trim(target_reason), ''), actor_id)
  on conflict (organization_id, assignee_identity_id, kind) where status = 'active'
    do update set reason = excluded.reason, updated_at = now()
  returning id into assignment_id;
  insert into public.internal_portfolio_audit_events (portfolio_assignment_id, actor_identity_id, action, metadata)
  values (assignment_id, actor_id, 'assigned', jsonb_build_object('kind', target_kind));
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'portfolio_assigned', 'internal_portfolio_assignment', assignment_id, jsonb_build_object('kind', target_kind, 'organization_id', target_organization_id, 'assignee_identity_id', target_assignee_identity_id));
  return assignment_id;
end;
$$;

create or replace function public.revoke_internal_portfolio(target_assignment_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'portfolio_manage') then
    raise exception 'admin portfolio access required' using errcode = '42501';
  end if;
  update public.internal_portfolio_assignments
  set status = 'revoked', revoked_at = now(), revoked_by = actor_id, updated_at = now()
  where id = target_assignment_id and status = 'active';
  if not found then raise exception 'active portfolio assignment not found' using errcode = 'P0002'; end if;
  insert into public.internal_portfolio_audit_events (portfolio_assignment_id, actor_identity_id, action)
  values (target_assignment_id, actor_id, 'revoked');
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id)
  values (actor_id, 'portfolio_revoked', 'internal_portfolio_assignment', target_assignment_id);
end;
$$;

create or replace function public.list_managed_internal_portfolios()
returns table (assignment_id uuid, organization_id uuid, organization_name text, assignee_identity_id uuid, assignee_email text, kind public.internal_portfolio_kind, assigned_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select assignment.id, organization.id, organization.name, assignee.id, assignee.email, assignment.kind, assignment.assigned_at
  from public.internal_portfolio_assignments assignment
  join public.organizations organization on organization.id = assignment.organization_id
  join public.identities assignee on assignee.id = assignment.assignee_identity_id
  where assignment.status = 'active' and private.has_internal_capability(auth.uid(), 'portfolio_manage')
  order by organization.name, assignment.kind, assignee.email;
$$;

create or replace function public.get_my_internal_portfolios()
returns table (
  assignment_id uuid,
  kind public.internal_portfolio_kind,
  organization_id uuid,
  organization_name text,
  assigned_at timestamptz,
  active_cycle_title text,
  active_cycle_ends_on date,
  next_action_label text,
  approved_milestone_count integer,
  onboarding_pending_enrollments integer
)
language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'portfolio_read_assigned') then
    raise exception 'assigned portfolio access required' using errcode = '42501';
  end if;
  insert into public.internal_portfolio_audit_events (portfolio_assignment_id, actor_identity_id, action)
  select assignment.id, actor_id, 'read'
  from public.internal_portfolio_assignments assignment
  where assignment.assignee_identity_id = actor_id and assignment.status = 'active';
  return query
  select assignment.id, assignment.kind, organization.id, organization.name, assignment.assigned_at,
    case when assignment.kind = 'mentor' then cycle.title else null end,
    case when assignment.kind = 'mentor' then cycle.ends_on else null end,
    case when assignment.kind = 'mentor' then next_mission.title else null end,
    case when assignment.kind = 'mentor' then coalesce(milestones.approved_count, 0) else 0 end,
    case when assignment.kind = 'concierge' then coalesce(onboarding.pending_count, 0) else 0 end
  from public.internal_portfolio_assignments assignment
  join public.organizations organization on organization.id = assignment.organization_id
  left join public.cycles cycle on cycle.organization_id = organization.id and cycle.status = 'active'
  left join lateral (
    select mission.title
    from public.missions mission
    where mission.organization_id = organization.id and mission.cycle_id = cycle.id and mission.status = 'available'
    order by mission.position
    limit 1
  ) next_mission on true
  left join lateral (
    select count(*)::integer as approved_count
    from public.mission_evidence evidence
    join lateral (
      select review.outcome
      from public.evidence_reviews review
      where review.evidence_id = evidence.id
      order by review.review_sequence desc, review.created_at desc
      limit 1
    ) latest_review on true
    where evidence.organization_id = organization.id and latest_review.outcome = 'approved'
  ) milestones on true
  left join lateral (
    select count(*)::integer as pending_count
    from public.access_enrollments enrollment
    where enrollment.organization_id = organization.id and enrollment.status = 'pending'
  ) onboarding on true
  where assignment.assignee_identity_id = actor_id and assignment.status = 'active'
  order by assignment.assigned_at desc;
end;
$$;

revoke all on function public.list_portfolio_organizations() from public;
revoke all on function public.assign_internal_portfolio(uuid, uuid, public.internal_portfolio_kind, text) from public;
revoke all on function public.revoke_internal_portfolio(uuid) from public;
revoke all on function public.list_managed_internal_portfolios() from public;
revoke all on function public.get_my_internal_portfolios() from public;
revoke execute on function public.list_portfolio_organizations(), public.assign_internal_portfolio(uuid, uuid, public.internal_portfolio_kind, text), public.revoke_internal_portfolio(uuid), public.list_managed_internal_portfolios(), public.get_my_internal_portfolios() from anon;
grant execute on function public.list_portfolio_organizations(), public.assign_internal_portfolio(uuid, uuid, public.internal_portfolio_kind, text), public.revoke_internal_portfolio(uuid), public.list_managed_internal_portfolios(), public.get_my_internal_portfolios() to authenticated;
