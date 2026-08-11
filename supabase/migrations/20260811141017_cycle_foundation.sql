create table public.cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id),
  priority_id uuid not null unique references public.priorities(id),
  title text not null,
  status text not null default 'active' check (status = 'active'),
  starts_on date not null default current_date,
  ends_on date not null,
  created_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  check (ends_on = starts_on + 90)
);
create index cycles_created_by_idx on public.cycles(created_by);

create or replace function public.start_cycle(target_priority_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor uuid := (select auth.uid()); org uuid; label text; cycle_id uuid;
begin
  if actor is null then raise exception 'authentication required' using errcode='42501'; end if;
  select p.organization_id, p.dimension_label into org, label from public.priorities p
  where p.id=target_priority_id and private.is_active_owner(p.organization_id);
  if org is null then raise exception 'active priority not found' using errcode='42501'; end if;
  insert into public.cycles(organization_id,priority_id,title,starts_on,ends_on,created_by)
  values(org,target_priority_id,'Ciclo — '||label,current_date,current_date+90,actor)
  returning id into cycle_id;
  return cycle_id;
end; $$;
revoke all on function public.start_cycle(uuid) from public, anon;
grant execute on function public.start_cycle(uuid) to authenticated;
alter table public.cycles enable row level security;
create policy "owners can read organization cycle" on public.cycles for select to authenticated using ((select private.is_active_owner(organization_id)));
revoke all on public.cycles from anon, authenticated;
grant select on public.cycles to authenticated;
