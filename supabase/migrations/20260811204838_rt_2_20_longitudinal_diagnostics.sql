alter table public.diagnostic_revisions drop constraint diagnostic_revisions_period_code_check;
alter table public.diagnostic_revisions add constraint diagnostic_revisions_period_code_check
  check (period_code in ('m0', 'entry', 'pulse', 'quarterly', 'exit')) not valid;
alter table public.diagnostic_revisions validate constraint diagnostic_revisions_period_code_check;

alter table public.diagnostic_executions add column episode_type text;
alter table public.diagnostic_executions add column episode_sequence integer;
alter table public.diagnostic_executions add column cycle_id uuid references public.cycles(id);
alter table public.diagnostic_executions add column effective_on date;

update public.diagnostic_executions
set episode_type = 'entry', episode_sequence = 0,
    effective_on = coalesce(completed_at::date, started_at::date)
where period_code = 'm0';

alter table public.diagnostic_executions alter column episode_type set not null;
alter table public.diagnostic_executions alter column episode_sequence set not null;
alter table public.diagnostic_executions alter column effective_on set not null;
alter table public.diagnostic_executions add constraint diagnostic_executions_episode_type_check
  check (episode_type in ('entry', 'pulse', 'quarterly', 'exit')) not valid;
alter table public.diagnostic_executions validate constraint diagnostic_executions_episode_type_check;
alter table public.diagnostic_executions add constraint diagnostic_executions_episode_sequence_check
  check (episode_sequence >= 0) not valid;
alter table public.diagnostic_executions validate constraint diagnostic_executions_episode_sequence_check;
alter table public.diagnostic_executions add constraint diagnostic_executions_cycle_scope_check check (
  (episode_type in ('pulse', 'quarterly') and cycle_id is not null)
  or (episode_type in ('entry', 'exit'))
) not valid;
alter table public.diagnostic_executions validate constraint diagnostic_executions_cycle_scope_check;
alter table public.diagnostic_executions drop constraint diagnostic_executions_period_code_check;
alter table public.diagnostic_executions add constraint diagnostic_executions_period_code_check
  check (period_code in ('m0', 'entry', 'pulse', 'quarterly', 'exit')) not valid;
alter table public.diagnostic_executions validate constraint diagnostic_executions_period_code_check;
alter table public.diagnostic_executions
  drop constraint diagnostic_executions_organization_id_revision_id_period_co_key;
alter table public.diagnostic_executions add constraint diagnostic_executions_org_episode_sequence_key
  unique (organization_id, episode_type, episode_sequence);

create index diagnostic_executions_cycle_id_idx
  on public.diagnostic_executions(cycle_id) where cycle_id is not null;
create index diagnostic_executions_org_effective_idx
  on public.diagnostic_executions(organization_id, effective_on desc, id);

create or replace function public.start_diagnostic_episode(
  target_revision_id uuid,
  target_episode_type text,
  target_cycle_id uuid default null,
  target_effective_on date default current_date
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  actor_id uuid := (select auth.uid());
  org uuid;
  revision_period text;
  execution_id uuid;
  episode_ordinal integer;
  cycle_sequence integer;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  org := private.current_owner_organization_id();
  if org is null then raise exception 'active owner membership required' using errcode = '42501'; end if;
  if target_episode_type not in ('entry', 'pulse', 'quarterly', 'exit') then
    raise exception 'invalid diagnostic episode type' using errcode = '22023';
  end if;
  if target_effective_on > current_date then raise exception 'effective date cannot be future' using errcode = '22023'; end if;

  select r.period_code into revision_period from public.diagnostic_revisions r
  where r.id = target_revision_id and r.status = 'published';
  if revision_period is null or not (
    (target_episode_type = 'entry' and revision_period in ('m0', 'entry'))
    or revision_period = target_episode_type
  ) then
    raise exception 'published revision does not match episode type' using errcode = '22023';
  end if;

  perform 1 from public.organizations o where o.id = org for update;
  if target_episode_type in ('pulse', 'quarterly') then
    select c.sequence_number into cycle_sequence from public.cycles c
    where c.id = target_cycle_id and c.organization_id = org;
    if cycle_sequence is null then raise exception 'organization cycle required' using errcode = '22023'; end if;
  elsif target_cycle_id is not null then
    raise exception 'cycle not allowed for this episode type' using errcode = '22023';
  end if;

  if target_episode_type = 'quarterly' then episode_ordinal := cycle_sequence;
  elsif target_episode_type in ('entry', 'exit') then episode_ordinal := 0;
  else
    select coalesce(max(e.episode_sequence), 0) + 1 into episode_ordinal
    from public.diagnostic_executions e
    where e.organization_id = org and e.episode_type = 'pulse';
  end if;

  insert into public.diagnostic_executions (
    organization_id, revision_id, period_code, status, started_by,
    episode_type, episode_sequence, cycle_id, effective_on
  ) values (
    org, target_revision_id, revision_period, 'draft', actor_id,
    target_episode_type, episode_ordinal, target_cycle_id, target_effective_on
  ) returning id into execution_id;
  return execution_id;
end;
$$;

revoke all on function public.start_diagnostic_episode(uuid, text, uuid, date) from public, anon;
grant execute on function public.start_diagnostic_episode(uuid, text, uuid, date) to authenticated;
