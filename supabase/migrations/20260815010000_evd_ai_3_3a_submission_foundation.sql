-- EVD-AI-3.3A: evidence submission is append-only and no longer advances a mission by itself.
create or replace function private.submit_mission_evidence_for_tutoria_review(
  target_mission_id uuid,
  submitted_evidence_type text,
  evidence_description text,
  evidence_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  target_organization_id uuid;
  target_status text;
  implementation_id uuid;
  implementation_date date;
  evidence_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select mission.organization_id, mission.status into target_organization_id, target_status
  from public.missions mission join public.cycles cycle on cycle.id = mission.cycle_id and cycle.status = 'active'
  where mission.id = target_mission_id and private.is_active_owner(mission.organization_id) for update of mission;
  if target_organization_id is null then raise exception 'mission not found' using errcode = '42501'; end if;
  if target_status <> 'available' then raise exception 'mission is not available' using errcode = '22023'; end if;
  if submitted_evidence_type not in ('decision_example', 'operational_record', 'meeting_routine', 'observed_result') or char_length(trim(evidence_description)) not between 20 and 1000 then raise exception 'invalid evidence' using errcode = '22023'; end if;
  select id, implemented_on into implementation_id, implementation_date from public.mission_implementations where mission_id = target_mission_id and status = 'implemented' for update;
  if implementation_id is null or evidence_date < implementation_date or evidence_date > current_date then raise exception 'invalid evidence date' using errcode = '22023'; end if;
  insert into public.mission_evidence (organization_id, mission_id, implementation_id, evidence_type, description, occurred_on, submitted_by)
  values (target_organization_id, target_mission_id, implementation_id, submitted_evidence_type, trim(evidence_description), evidence_date, actor_id)
  returning id into evidence_id;
  return evidence_id;
end;
$$;

create function public.submit_mission_evidence_for_tutoria_review(target_mission_id uuid, submitted_evidence_type text, evidence_description text, evidence_date date)
returns uuid language sql security invoker set search_path = '' as $$
  select private.submit_mission_evidence_for_tutoria_review($1, $2, $3, $4)
$$;

revoke all on function private.submit_mission_evidence_for_tutoria_review(uuid, text, text, date) from public, anon;
revoke all on function public.submit_mission_evidence_for_tutoria_review(uuid, text, text, date) from public, anon;
grant execute on function private.submit_mission_evidence_for_tutoria_review(uuid, text, text, date) to authenticated;
grant execute on function public.submit_mission_evidence_for_tutoria_review(uuid, text, text, date) to authenticated;
