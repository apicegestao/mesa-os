create table public.mission_implementations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  mission_id uuid not null unique references public.missions(id),
  tool_instance_id uuid not null unique references public.tool_instances(id),
  status text not null check (status in ('draft', 'implemented')),
  summary text not null check (char_length(trim(summary)) between 20 and 1000),
  implemented_on date not null,
  created_by uuid not null references public.identities(id),
  updated_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  constraint mission_implementations_confirmation_check check (
    (status = 'draft' and confirmed_at is null)
    or (status = 'implemented' and confirmed_at is not null)
  )
);

create index mission_implementations_organization_id_idx on public.mission_implementations(organization_id);
create index mission_implementations_created_by_idx on public.mission_implementations(created_by);

create or replace function private.prevent_confirmed_tool_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.mission_implementations mi
    where mi.mission_id = old.mission_id and mi.status = 'implemented'
  ) then
    raise exception 'confirmed implementation tool is immutable' using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger prevent_confirmed_tool_change
before update on public.tool_instances
for each row execute function private.prevent_confirmed_tool_change();

create or replace function public.save_mission_implementation(
  target_mission_id uuid,
  implementation_summary text,
  implementation_date date,
  confirm_implementation boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_tool_instance_id uuid;
  cycle_start date;
  existing_status text;
  implementation_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select m.organization_id, ti.id, c.starts_on
  into target_organization_id, target_tool_instance_id, cycle_start
  from public.missions m
  join public.cycles c on c.id = m.cycle_id and c.status = 'active'
  join public.tool_instances ti on ti.mission_id = m.id and ti.status = 'draft'
  where m.id = target_mission_id
    and m.status = 'available'
    and private.is_active_owner(m.organization_id)
  for update of m;

  if target_organization_id is null then
    raise exception 'available mission with tool not found' using errcode = '42501';
  end if;
  if char_length(trim(implementation_summary)) not between 20 and 1000 then
    raise exception 'invalid implementation summary' using errcode = '22023';
  end if;
  if implementation_date < cycle_start or implementation_date > current_date then
    raise exception 'invalid implementation date' using errcode = '22023';
  end if;

  select status into existing_status
  from public.mission_implementations
  where mission_id = target_mission_id
  for update;

  if existing_status = 'implemented' then
    raise exception 'implementation already confirmed' using errcode = '22023';
  end if;

  insert into public.mission_implementations (
    organization_id, mission_id, tool_instance_id, status, summary,
    implemented_on, created_by, updated_by, confirmed_at
  ) values (
    target_organization_id, target_mission_id, target_tool_instance_id,
    case when confirm_implementation then 'implemented' else 'draft' end,
    trim(implementation_summary), implementation_date, actor_id, actor_id,
    case when confirm_implementation then now() else null end
  )
  on conflict (mission_id) do update set
    summary = excluded.summary,
    implemented_on = excluded.implemented_on,
    status = excluded.status,
    updated_by = excluded.updated_by,
    updated_at = now(),
    confirmed_at = excluded.confirmed_at
  returning id into implementation_id;

  return implementation_id;
end;
$$;

revoke all on function public.save_mission_implementation(uuid, text, date, boolean) from public, anon;
grant execute on function public.save_mission_implementation(uuid, text, date, boolean) to authenticated;

alter table public.mission_implementations enable row level security;
create policy "owners can read organization implementations"
on public.mission_implementations for select to authenticated
using ((select private.is_active_owner(organization_id)));
revoke all on public.mission_implementations from anon, authenticated;
grant select on public.mission_implementations to authenticated;
