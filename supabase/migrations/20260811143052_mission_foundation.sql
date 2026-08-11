create table public.mission_definition_revisions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  version integer not null check (version > 0),
  status text not null check (status in ('published', 'retired')),
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table public.mission_definitions (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.mission_definition_revisions(id),
  dimension_code text not null,
  position smallint not null check (position > 0),
  title text not null check (char_length(trim(title)) between 3 and 120),
  objective text not null check (char_length(trim(objective)) between 10 and 500),
  rationale text not null check (char_length(trim(rationale)) between 10 and 500),
  unique (revision_id, dimension_code, position)
);
create index mission_definitions_revision_id_idx on public.mission_definitions(revision_id);
create index mission_definitions_dimension_code_idx on public.mission_definitions(dimension_code);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cycle_id uuid not null references public.cycles(id),
  definition_id uuid not null references public.mission_definitions(id),
  position smallint not null check (position > 0),
  title text not null,
  objective text not null,
  rationale text not null,
  status text not null check (status in ('locked', 'available')),
  created_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  unique (cycle_id, position),
  unique (cycle_id, definition_id)
);
create index missions_organization_id_idx on public.missions(organization_id);
create index missions_definition_id_idx on public.missions(definition_id);
create index missions_created_by_idx on public.missions(created_by);
create unique index missions_one_available_per_cycle_idx
on public.missions(cycle_id) where status = 'available';

insert into public.mission_definition_revisions (id, code, name, version, status)
values (
  '20000000-0000-4000-8000-000000000001',
  'mesa_dos_donos_leadership_v1',
  'Mesa dos Donos — Liderança & Equipe',
  1,
  'published'
);

insert into public.mission_definitions (
  id, revision_id, dimension_code, position, title, objective, rationale
) values
  (
    '20000000-0000-4000-8000-000000000101',
    '20000000-0000-4000-8000-000000000001',
    'leadership', 1, 'Clareza de papéis e decisões',
    'Tornar explícito quem decide, quem executa e quem responde pelos resultados essenciais da empresa.',
    'Papéis claros reduzem dependência do dono, retrabalho e decisões que ficam sem responsável.'
  ),
  (
    '20000000-0000-4000-8000-000000000102',
    '20000000-0000-4000-8000-000000000001',
    'leadership', 2, 'Ritmo de gestão da equipe',
    'Estabelecer uma cadência consistente para acompanhar prioridades, decisões e responsabilidades da equipe.',
    'Um ritmo previsível de gestão transforma alinhamento pontual em disciplina operacional.'
  ),
  (
    '20000000-0000-4000-8000-000000000103',
    '20000000-0000-4000-8000-000000000001',
    'leadership', 3, 'Delegação com responsabilidade',
    'Ampliar a autonomia da equipe com limites de decisão e responsabilidades claramente compreendidos.',
    'Delegar com clareza permite que a operação avance sem concentrar decisões rotineiras no dono.'
  );

create or replace function public.provision_cycle_missions(target_cycle_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_dimension_code text;
  target_revision_id uuid;
  inserted_count integer;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select c.organization_id, p.dimension_code
  into target_organization_id, target_dimension_code
  from public.cycles c
  join public.priorities p on p.id = c.priority_id
  where c.id = target_cycle_id
    and c.status = 'active'
    and private.is_active_owner(c.organization_id)
  for share of c;

  if target_organization_id is null then
    raise exception 'active cycle not found' using errcode = '42501';
  end if;

  select r.id into target_revision_id
  from public.mission_definition_revisions r
  where r.status = 'published'
    and exists (
      select 1 from public.mission_definitions d
      where d.revision_id = r.id and d.dimension_code = target_dimension_code
    )
  order by r.version desc
  limit 1;

  if target_revision_id is null then
    raise exception 'mission definition not found' using errcode = 'P0002';
  end if;

  insert into public.missions (
    organization_id, cycle_id, definition_id, position,
    title, objective, rationale, status, created_by
  )
  select
    target_organization_id, target_cycle_id, d.id, d.position,
    d.title, d.objective, d.rationale,
    case when d.position = 1 then 'available' else 'locked' end,
    actor_id
  from public.mission_definitions d
  where d.revision_id = target_revision_id
    and d.dimension_code = target_dimension_code
  order by d.position
  on conflict (cycle_id, definition_id) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.provision_cycle_missions(uuid) from public, anon;
grant execute on function public.provision_cycle_missions(uuid) to authenticated;

alter table public.mission_definition_revisions enable row level security;
alter table public.mission_definitions enable row level security;
alter table public.missions enable row level security;

create policy "owners can read published mission revisions"
on public.mission_definition_revisions for select to authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.memberships m
    where m.identity_id = (select auth.uid())
      and m.role = 'owner' and m.status = 'active'
  )
);

create policy "owners can read published mission definitions"
on public.mission_definitions for select to authenticated
using (
  exists (
    select 1 from public.mission_definition_revisions r
    where r.id = revision_id and r.status = 'published'
  )
  and exists (
    select 1 from public.memberships m
    where m.identity_id = (select auth.uid())
      and m.role = 'owner' and m.status = 'active'
  )
);

create policy "owners can read organization missions"
on public.missions for select to authenticated
using ((select private.is_active_owner(organization_id)));

revoke all on public.mission_definition_revisions from anon, authenticated;
revoke all on public.mission_definitions from anon, authenticated;
revoke all on public.missions from anon, authenticated;
grant select on public.mission_definition_revisions to authenticated;
grant select on public.mission_definitions to authenticated;
grant select on public.missions to authenticated;
