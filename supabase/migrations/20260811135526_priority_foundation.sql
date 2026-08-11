create table public.priorities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  diagnostic_execution_id uuid not null unique references public.diagnostic_executions(id),
  diagnostic_dimension_id uuid not null references public.diagnostic_dimensions(id),
  dimension_code text not null,
  dimension_label text not null,
  source_score smallint not null check (source_score between 0 and 100),
  rationale text not null check (char_length(trim(rationale)) between 10 and 500),
  confirmed_by uuid not null references public.identities(id),
  confirmed_at timestamptz not null default now(),
  unique (organization_id)
);

create index priorities_diagnostic_dimension_id_idx on public.priorities (diagnostic_dimension_id);
create index priorities_confirmed_by_idx on public.priorities (confirmed_by);

create or replace function public.confirm_priority(
  target_execution_id uuid,
  priority_rationale text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_revision_id uuid;
  minimum_score integer;
  minimum_count integer;
  candidate_code text;
  candidate_label text;
  candidate_dimension_id uuid;
  priority_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if char_length(trim(priority_rationale)) not between 10 and 500 then
    raise exception 'rationale must contain between 10 and 500 characters' using errcode = '22023';
  end if;

  select e.organization_id, e.revision_id
  into target_organization_id, target_revision_id
  from public.diagnostic_executions e
  where e.id = target_execution_id
    and e.status = 'completed'
    and private.is_active_owner(e.organization_id)
  for share;

  if target_organization_id is null then
    raise exception 'completed diagnostic execution not found' using errcode = '42501';
  end if;

  select min((item ->> 'score')::integer)
  into minimum_score
  from public.diagnostic_executions e,
    jsonb_array_elements(e.result_snapshot -> 'dimensions') item
  where e.id = target_execution_id;

  select count(*), min(item ->> 'code'), min(item ->> 'label')
  into minimum_count, candidate_code, candidate_label
  from public.diagnostic_executions e,
    jsonb_array_elements(e.result_snapshot -> 'dimensions') item
  where e.id = target_execution_id
    and (item ->> 'score')::integer = minimum_score;

  if minimum_count <> 1 then
    raise exception 'priority tie requires TutorIA decision' using errcode = '23514';
  end if;

  select d.id into candidate_dimension_id
  from public.diagnostic_dimensions d
  where d.revision_id = target_revision_id and d.code = candidate_code;

  if candidate_dimension_id is null then
    raise exception 'candidate dimension not found' using errcode = '23503';
  end if;

  insert into public.priorities (
    organization_id, diagnostic_execution_id, diagnostic_dimension_id,
    dimension_code, dimension_label, source_score, rationale, confirmed_by
  ) values (
    target_organization_id, target_execution_id, candidate_dimension_id,
    candidate_code, candidate_label, minimum_score, trim(priority_rationale), actor_id
  ) returning id into priority_id;

  return priority_id;
end;
$$;

revoke all on function public.confirm_priority(uuid, text) from public, anon;
grant execute on function public.confirm_priority(uuid, text) to authenticated;

alter table public.priorities enable row level security;

create policy "owners can read organization priority"
on public.priorities for select to authenticated
using ((select private.is_active_owner(organization_id)));

revoke all on public.priorities from anon, authenticated;
grant select on public.priorities to authenticated;
