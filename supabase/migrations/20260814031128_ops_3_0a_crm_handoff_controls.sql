-- OPS-3.0A completion: controlled opportunity transition and Concierge selection.

create or replace function public.list_available_concierges()
returns table (identity_id uuid, email text)
language sql stable security definer set search_path = '' as $$
  select assignment.identity_id, identity.email
  from public.internal_staff_role_assignments assignment
  join public.identities identity on identity.id = assignment.identity_id
  where assignment.role = 'concierge' and assignment.status = 'active'
    and private.has_internal_capability(auth.uid(), 'crm_handoff_create')
  order by identity.email;
$$;

create or replace function public.update_crm_opportunity_stage(
  target_opportunity_id uuid,
  target_stage public.crm_opportunity_stage,
  target_next_action text,
  target_next_action_due_on date default null,
  target_lost_reason text default null
)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'crm_write_assigned') then raise exception 'commercial access required' using errcode = '42501'; end if;
  if char_length(trim(target_next_action)) not between 2 and 500 then raise exception 'next action required' using errcode = '22023'; end if;
  update public.crm_opportunities
  set stage = target_stage, next_action = trim(target_next_action), next_action_due_on = target_next_action_due_on,
    won_at = case when target_stage = 'won' then coalesce(won_at, now()) else null end,
    lost_at = case when target_stage = 'lost' then coalesce(lost_at, now()) else null end,
    lost_reason = case when target_stage = 'lost' then nullif(trim(target_lost_reason), '') else null end,
    updated_at = now()
  where id = target_opportunity_id
    and (owner_identity_id = actor_id or private.has_internal_capability(actor_id, 'crm_read_all'));
  if not found then raise exception 'opportunity unavailable' using errcode = 'P0002'; end if;
  if target_stage = 'lost' and nullif(trim(target_lost_reason), '') is null then raise exception 'lost reason required' using errcode = '22023'; end if;
  insert into public.crm_activities (opportunity_id, kind, summary, created_by)
  values (target_opportunity_id, 'status_change', concat('Etapa alterada para ', target_stage, '.'), actor_id);
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'crm_opportunity_stage_changed', 'crm_opportunity', target_opportunity_id, jsonb_build_object('stage', target_stage));
end;
$$;

revoke all on function public.list_available_concierges() from public;
revoke all on function public.update_crm_opportunity_stage(uuid, public.crm_opportunity_stage, text, date, text) from public;
revoke execute on function public.list_available_concierges() from anon;
revoke execute on function public.update_crm_opportunity_stage(uuid, public.crm_opportunity_stage, text, date, text) from anon;
grant execute on function public.list_available_concierges() to authenticated;
grant execute on function public.update_crm_opportunity_stage(uuid, public.crm_opportunity_stage, text, date, text) to authenticated;
