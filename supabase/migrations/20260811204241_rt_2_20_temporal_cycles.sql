alter table public.priorities drop constraint priorities_organization_id_key;
create index priorities_organization_confirmed_idx on public.priorities(organization_id, confirmed_at desc, id);

alter table public.cycles add column sequence_number integer;
alter table public.cycles add column methodology_revision_id uuid references public.methodology_revisions(id);
alter table public.cycles add column methodology_stage_id uuid;
alter table public.cycles add column completed_at timestamptz;
alter table public.cycles add column completed_by uuid references public.identities(id);

with ranked as (
  select id, row_number() over (partition by organization_id order by starts_on, created_at, id)::integer sequence_number
  from public.cycles
), published as (
  select r.id revision_id
  from public.methodology_revisions r
  join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.status = 'published'
  order by r.version desc limit 1
)
update public.cycles c
set sequence_number = ranked.sequence_number, methodology_revision_id = published.revision_id
from ranked, published where c.id = ranked.id;

update public.cycles c set methodology_stage_id = s.id
from public.methodology_stages s
where s.revision_id = c.methodology_revision_id and s.position = c.sequence_number;

alter table public.cycles alter column sequence_number set not null;
alter table public.cycles alter column methodology_revision_id set not null;
alter table public.cycles add constraint cycles_methodology_stage_revision_fkey
  foreign key (methodology_stage_id, methodology_revision_id)
  references public.methodology_stages(id, revision_id);
alter table public.cycles drop constraint cycles_organization_id_key;
alter table public.cycles drop constraint cycles_status_check;
alter table public.cycles add constraint cycles_status_check
  check (status in ('planned', 'active', 'completed')) not valid;
alter table public.cycles validate constraint cycles_status_check;
alter table public.cycles add constraint cycles_completion_check check (
  (status = 'completed' and completed_at is not null and completed_by is not null)
  or (status <> 'completed' and completed_at is null and completed_by is null)
) not valid;
alter table public.cycles validate constraint cycles_completion_check;
alter table public.cycles add constraint cycles_organization_sequence_key unique (organization_id, sequence_number);

create unique index cycles_one_active_per_organization_idx
  on public.cycles(organization_id) where status = 'active';
create index cycles_methodology_revision_idx on public.cycles(methodology_revision_id);
create index cycles_methodology_stage_revision_idx
  on public.cycles(methodology_stage_id, methodology_revision_id)
  where methodology_stage_id is not null;
create index cycles_completed_by_idx on public.cycles(completed_by) where completed_by is not null;

create or replace function public.start_cycle(target_priority_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := (select auth.uid());
  org uuid;
  label text;
  cycle_id uuid;
  next_sequence integer;
  target_revision uuid;
  target_stage uuid;
begin
  if actor is null then raise exception 'authentication required' using errcode = '42501'; end if;

  select p.organization_id, p.dimension_label into org, label
  from public.priorities p
  where p.id = target_priority_id and private.is_active_owner(p.organization_id)
  for share;
  if org is null then raise exception 'active priority not found' using errcode = '42501'; end if;

  perform 1 from public.organizations o where o.id = org for update;
  if exists (select 1 from public.cycles c where c.organization_id = org and c.status = 'active') then
    raise exception 'organization already has an active cycle' using errcode = '23505';
  end if;

  select coalesce(max(c.sequence_number), 0) + 1 into next_sequence
  from public.cycles c where c.organization_id = org;

  select r.id into target_revision
  from public.methodology_revisions r
  join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.status = 'published'
  order by r.version desc limit 1;
  if target_revision is null then raise exception 'published methodology revision not found' using errcode = 'P0002'; end if;

  select s.id into target_stage from public.methodology_stages s
  where s.revision_id = target_revision and s.position = next_sequence;

  insert into public.cycles (
    organization_id, priority_id, title, status, starts_on, ends_on, created_by,
    sequence_number, methodology_revision_id, methodology_stage_id
  ) values (
    org, target_priority_id, 'Ciclo — ' || label, 'active', current_date, current_date + 90, actor,
    next_sequence, target_revision, target_stage
  ) returning id into cycle_id;
  return cycle_id;
end;
$$;

revoke all on function public.start_cycle(uuid) from public, anon;
grant execute on function public.start_cycle(uuid) to authenticated;
