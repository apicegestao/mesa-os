-- Keep the existing mission-completion path compatible with append-only evidence.
create or replace function private.initialize_mission_evidence_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.revision_number := coalesce(new.revision_number, 1);
  new.root_evidence_id := coalesce(new.root_evidence_id, new.id);

  if new.revision_number = 1 and (new.root_evidence_id <> new.id or new.supersedes_evidence_id is not null) then
    raise exception 'initial evidence must be its own root' using errcode = '22023';
  end if;
  if new.revision_number > 1 and new.supersedes_evidence_id is null then
    raise exception 'revised evidence must identify the preceding revision' using errcode = '22023';
  end if;

  return new;
end;
$$;

create trigger mission_evidence_initialize_revision
before insert on public.mission_evidence
for each row execute function private.initialize_mission_evidence_revision();

create or replace function public.submit_mission_evidence_and_advance(
  target_mission_id uuid,
  submitted_evidence_type text,
  evidence_description text,
  evidence_date date
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_cycle_id uuid;
  target_position smallint;
  target_status text;
  implementation_id uuid;
  implementation_date date;
  existing_evidence public.mission_evidence%rowtype;
  evidence_id uuid;
  next_mission_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select m.organization_id, m.cycle_id, m.position, m.status
  into target_organization_id, target_cycle_id, target_position, target_status
  from public.missions m
  join public.cycles c on c.id = m.cycle_id and c.status = 'active'
  where m.id = target_mission_id
    and private.is_active_owner(m.organization_id)
  for update of m;
  if target_organization_id is null then
    raise exception 'mission not found' using errcode = '42501';
  end if;

  select * into existing_evidence
  from public.mission_evidence
  where mission_id = target_mission_id
  order by revision_number desc
  limit 1;
  if target_status = 'completed' and existing_evidence.id is not null then
    if existing_evidence.evidence_type = submitted_evidence_type
      and existing_evidence.description = trim(evidence_description)
      and existing_evidence.occurred_on = evidence_date then
      select id into next_mission_id from public.missions
      where cycle_id = target_cycle_id and status = 'available' order by position limit 1;
      return jsonb_build_object('evidence_id', existing_evidence.id, 'next_mission_id', next_mission_id);
    end if;
    raise exception 'mission already completed' using errcode = '22023';
  end if;

  if target_status <> 'available' then
    raise exception 'mission is not available' using errcode = '22023';
  end if;
  if submitted_evidence_type not in ('decision_example', 'operational_record', 'meeting_routine', 'observed_result')
    or char_length(trim(evidence_description)) not between 20 and 1000 then
    raise exception 'invalid evidence' using errcode = '22023';
  end if;

  select id, implemented_on into implementation_id, implementation_date
  from public.mission_implementations
  where mission_id = target_mission_id and status = 'implemented'
  for update;
  if implementation_id is null then
    raise exception 'confirmed implementation required' using errcode = '22023';
  end if;
  if evidence_date < implementation_date or evidence_date > current_date then
    raise exception 'invalid evidence date' using errcode = '22023';
  end if;

  insert into public.mission_evidence (
    organization_id, mission_id, implementation_id, evidence_type,
    description, occurred_on, submitted_by
  ) values (
    target_organization_id, target_mission_id, implementation_id,
    submitted_evidence_type, trim(evidence_description), evidence_date, actor_id
  ) returning id into evidence_id;

  update public.missions set status = 'completed', completed_at = now(), completed_by = actor_id
  where id = target_mission_id;
  update public.missions set status = 'available'
  where id = (
    select id from public.missions
    where cycle_id = target_cycle_id and position > target_position and status = 'locked'
    order by position limit 1
    for update skip locked
  ) returning id into next_mission_id;

  return jsonb_build_object('evidence_id', evidence_id, 'next_mission_id', next_mission_id);
end;
$$;
revoke all on function public.submit_mission_evidence_and_advance(uuid, text, text, date) from public, anon;
grant execute on function public.submit_mission_evidence_and_advance(uuid, text, text, date) to authenticated;
