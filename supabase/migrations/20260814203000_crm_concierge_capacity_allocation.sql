create table public.internal_concierge_capacities (
  concierge_identity_id uuid primary key references public.identities(id) on delete restrict,
  max_active_organizations integer not null default 100 check (max_active_organizations between 1 and 1000),
  updated_by uuid not null references public.identities(id) on delete restrict,
  updated_at timestamptz not null default now()
);
alter table public.internal_concierge_capacities enable row level security;
revoke all on public.internal_concierge_capacities from anon, authenticated;
create policy "concierge capacity deny direct access" on public.internal_concierge_capacities for all to anon, authenticated using (false) with check (false);

create or replace function public.set_internal_concierge_capacity(target_identity_id uuid, target_capacity integer)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_role(actor_id, 'admin') then raise exception 'admin access required' using errcode = '42501'; end if;
  if not private.has_internal_role(target_identity_id, 'concierge') then raise exception 'concierge role required' using errcode = '42501'; end if;
  insert into public.internal_concierge_capacities (concierge_identity_id, max_active_organizations, updated_by)
  values (target_identity_id, target_capacity, actor_id)
  on conflict (concierge_identity_id) do update set max_active_organizations = excluded.max_active_organizations, updated_by = actor_id, updated_at = now();
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'concierge_capacity_updated', 'internal_concierge_capacity', target_identity_id, jsonb_build_object('max_active_organizations', target_capacity));
end; $$;

create or replace function private.allocate_available_concierge(target_organization_id uuid, target_actor_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare selected_id uuid; selected_load integer;
begin
  perform pg_advisory_xact_lock(hashtext(target_organization_id::text));
  if exists (select 1 from public.internal_portfolio_assignments where organization_id = target_organization_id and kind = 'concierge' and status = 'active') then return null; end if;
  select staff.identity_id, count(assignment.id)::integer into selected_id, selected_load
  from public.internal_staff_role_assignments staff
  left join public.internal_portfolio_assignments assignment on assignment.assignee_identity_id = staff.identity_id and assignment.kind = 'concierge' and assignment.status = 'active'
  left join public.internal_concierge_capacities capacity on capacity.concierge_identity_id = staff.identity_id
  where staff.role = 'concierge' and staff.status = 'active'
  group by staff.identity_id, coalesce(capacity.max_active_organizations, 100)
  having count(assignment.id) < coalesce(capacity.max_active_organizations, 100)
  order by count(assignment.id), min(staff.granted_at), staff.identity_id
  limit 1;
  if selected_id is null then
    insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, metadata)
    values (target_actor_id, 'concierge_allocation_waitlisted', 'organization', jsonb_build_object('organization_id', target_organization_id));
    return null;
  end if;
  insert into public.internal_portfolio_assignments (organization_id, assignee_identity_id, kind, reason, assigned_by)
  values (target_organization_id, selected_id, 'concierge', 'alocação automática após acesso provisionado', target_actor_id);
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (target_actor_id, 'concierge_auto_assigned', 'internal_portfolio_assignment', selected_id, jsonb_build_object('organization_id', target_organization_id, 'load_before', selected_load));
  return selected_id;
end; $$;

create or replace function private.allocate_concierge_after_enrollment()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'provisioned' and old.status = 'pending' then
    perform private.allocate_available_concierge(new.organization_id, new.created_by);
  end if;
  return new;
end; $$;
drop trigger if exists allocate_concierge_after_enrollment on public.access_enrollments;
create trigger allocate_concierge_after_enrollment after update of status on public.access_enrollments for each row execute function private.allocate_concierge_after_enrollment();

revoke all on function public.set_internal_concierge_capacity(uuid, integer) from public;
revoke execute on function public.set_internal_concierge_capacity(uuid, integer) from anon;
grant execute on function public.set_internal_concierge_capacity(uuid, integer) to authenticated;
