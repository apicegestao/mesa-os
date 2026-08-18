-- DIA-3.7 hotfix: the legacy entry RPC was not updated after diagnostic
-- executions gained mandatory temporal episode fields. Keep entry start
-- idempotent and compatible with published M0/entry revisions.
create or replace function private.start_diagnostic(target_revision_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  revision_period text;
  execution_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  target_organization_id := private.current_owner_organization_id();
  if target_organization_id is null then
    raise exception 'active owner membership required' using errcode = '42501';
  end if;

  select r.period_code into revision_period
  from public.diagnostic_revisions r
  where r.id = target_revision_id
    and r.status = 'published'
    and r.period_code in ('m0', 'entry');
  if revision_period is null then
    raise exception 'published entry diagnostic revision not found' using errcode = '22023';
  end if;

  perform 1 from public.organizations where id = target_organization_id for update;
  select e.id into execution_id
  from public.diagnostic_executions e
  where e.organization_id = target_organization_id
    and e.episode_type = 'entry'
    and e.episode_sequence = 0
  for update;
  if execution_id is not null then
    return execution_id;
  end if;

  insert into public.diagnostic_executions (
    organization_id, revision_id, period_code, status, started_by,
    episode_type, episode_sequence, cycle_id, effective_on
  ) values (
    target_organization_id, target_revision_id, revision_period, 'draft', actor_id,
    'entry', 0, null, current_date
  ) returning id into execution_id;

  return execution_id;
end;
$$;

revoke all on function private.start_diagnostic(uuid) from public, anon;
grant execute on function private.start_diagnostic(uuid) to authenticated;
