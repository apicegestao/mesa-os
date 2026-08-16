-- OPS-3.0C: a fixed, global methodological envelope for active Mentors only.
create or replace function public.get_global_mentor_workspace()
returns table (organization_id uuid, organization_name text, active_cycle_title text, active_cycle_ends_on date, next_action_label text, available_mission_count integer, approved_milestone_count integer)
language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_role(actor_id, 'mentor') then
    raise exception 'mentor access required' using errcode = '42501';
  end if;
  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, metadata)
  values (actor_id, 'mentor_global_workspace_read', 'mentor_workspace', '{}'::jsonb);
  return query
  select organization.id, organization.name, cycle.title, cycle.ends_on, next_mission.title,
    coalesce(available_missions.count, 0), coalesce(approved_milestones.count, 0)
  from public.organizations organization
  left join public.cycles cycle on cycle.organization_id = organization.id and cycle.status = 'active'
  left join lateral (select mission.title from public.missions mission where mission.organization_id = organization.id and mission.cycle_id = cycle.id and mission.status = 'available' order by mission.position limit 1) next_mission on true
  left join lateral (select count(*)::integer as count from public.missions mission where mission.organization_id = organization.id and mission.cycle_id = cycle.id and mission.status = 'available') available_missions on true
  left join lateral (select count(*)::integer as count from public.mission_evidence evidence join lateral (select review.outcome from public.evidence_reviews review where review.evidence_id = evidence.id order by review.review_sequence desc, review.created_at desc limit 1) latest on true where evidence.organization_id = organization.id and latest.outcome = 'approved') approved_milestones on true
  order by organization.name;
end;
$$;
revoke all on function public.get_global_mentor_workspace() from public;
revoke execute on function public.get_global_mentor_workspace() from anon;
grant execute on function public.get_global_mentor_workspace() to authenticated;
