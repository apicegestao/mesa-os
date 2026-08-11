create table public.tool_definition_revisions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  version integer not null check (version > 0),
  status text not null check (status in ('published', 'retired')),
  schema jsonb not null check (jsonb_typeof(schema) = 'object'),
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table public.mission_tool_bindings (
  id uuid primary key default gen_random_uuid(),
  mission_definition_id uuid not null unique references public.mission_definitions(id),
  tool_revision_id uuid not null references public.tool_definition_revisions(id),
  created_at timestamptz not null default now()
);
create index mission_tool_bindings_tool_revision_id_idx on public.mission_tool_bindings(tool_revision_id);

create table public.tool_instances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  mission_id uuid not null unique references public.missions(id),
  tool_revision_id uuid not null references public.tool_definition_revisions(id),
  status text not null default 'draft' check (status = 'draft'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  created_by uuid not null references public.identities(id),
  updated_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tool_instances_organization_id_idx on public.tool_instances(organization_id);
create index tool_instances_tool_revision_id_idx on public.tool_instances(tool_revision_id);
create index tool_instances_created_by_idx on public.tool_instances(created_by);
create index tool_instances_updated_by_idx on public.tool_instances(updated_by);

insert into public.tool_definition_revisions (id, code, name, version, status, schema)
values (
  '30000000-0000-4000-8000-000000000001',
  'roles_and_decisions_map_v1',
  'Mapa de Papéis e Decisões',
  1,
  'published',
  '{
    "type": "repeatable_object",
    "key": "entries",
    "minItems": 1,
    "maxItems": 20,
    "fields": [
      {"key":"role_name","label":"Papel ou área","help":"Ex.: Financeiro, Comercial ou Líder de Operações","control":"input","required":true,"maxLength":80},
      {"key":"expected_result","label":"Resultado esperado","help":"Qual é o principal resultado pelo qual esse papel responde?","control":"textarea","required":true,"maxLength":300},
      {"key":"responsibilities","label":"Responsabilidades essenciais","help":"Quais responsabilidades não podem ficar sem dono?","control":"textarea","required":true,"maxLength":1000},
      {"key":"decision_rights","label":"Decisões com autonomia","help":"Quais decisões podem ser tomadas sem escalar ao dono?","control":"textarea","required":true,"maxLength":1000}
    ]
  }'::jsonb
);

insert into public.mission_tool_bindings (
  id, mission_definition_id, tool_revision_id
) values (
  '30000000-0000-4000-8000-000000000101',
  '20000000-0000-4000-8000-000000000101',
  '30000000-0000-4000-8000-000000000001'
);

create or replace function public.save_mission_tool_draft(
  target_mission_id uuid,
  submitted_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_tool_revision_id uuid;
  entries jsonb;
  entry jsonb;
  instance_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select m.organization_id, b.tool_revision_id
  into target_organization_id, target_tool_revision_id
  from public.missions m
  join public.mission_tool_bindings b on b.mission_definition_id = m.definition_id
  join public.tool_definition_revisions r on r.id = b.tool_revision_id and r.status = 'published'
  where m.id = target_mission_id
    and m.status = 'available'
    and private.is_active_owner(m.organization_id)
  for share of m;

  if target_organization_id is null then
    raise exception 'available mission not found' using errcode = '42501';
  end if;

  if jsonb_typeof(submitted_payload) <> 'object'
    or not (submitted_payload ? 'entries')
    or (submitted_payload - 'entries') <> '{}'::jsonb then
    raise exception 'invalid tool payload' using errcode = '22023';
  end if;

  entries := submitted_payload -> 'entries';
  if jsonb_typeof(entries) <> 'array'
    or jsonb_array_length(entries) not between 1 and 20
    or octet_length(submitted_payload::text) > 131072 then
    raise exception 'invalid tool entries' using errcode = '22023';
  end if;

  for entry in select value from jsonb_array_elements(entries)
  loop
    if jsonb_typeof(entry) <> 'object'
      or (entry - array['role_name','expected_result','responsibilities','decision_rights']) <> '{}'::jsonb
      or not (entry ?& array['role_name','expected_result','responsibilities','decision_rights'])
      or jsonb_typeof(entry -> 'role_name') <> 'string'
      or jsonb_typeof(entry -> 'expected_result') <> 'string'
      or jsonb_typeof(entry -> 'responsibilities') <> 'string'
      or jsonb_typeof(entry -> 'decision_rights') <> 'string'
      or char_length(trim(entry ->> 'role_name')) not between 1 and 80
      or char_length(trim(entry ->> 'expected_result')) not between 1 and 300
      or char_length(trim(entry ->> 'responsibilities')) not between 1 and 1000
      or char_length(trim(entry ->> 'decision_rights')) not between 1 and 1000 then
      raise exception 'invalid tool entry' using errcode = '22023';
    end if;
  end loop;

  insert into public.tool_instances (
    organization_id, mission_id, tool_revision_id, status,
    payload, created_by, updated_by
  ) values (
    target_organization_id, target_mission_id, target_tool_revision_id,
    'draft', submitted_payload, actor_id, actor_id
  )
  on conflict (mission_id) do update set
    payload = excluded.payload,
    updated_by = excluded.updated_by,
    updated_at = now()
  returning id into instance_id;

  return instance_id;
end;
$$;

revoke all on function public.save_mission_tool_draft(uuid, jsonb) from public, anon;
grant execute on function public.save_mission_tool_draft(uuid, jsonb) to authenticated;

alter table public.tool_definition_revisions enable row level security;
alter table public.mission_tool_bindings enable row level security;
alter table public.tool_instances enable row level security;

create policy "owners can read published tool revisions"
on public.tool_definition_revisions for select to authenticated
using (
  status = 'published' and exists (
    select 1 from public.memberships m
    where m.identity_id = (select auth.uid())
      and m.role = 'owner' and m.status = 'active'
  )
);

create policy "owners can read mission tool bindings"
on public.mission_tool_bindings for select to authenticated
using (
  exists (
    select 1 from public.memberships m
    where m.identity_id = (select auth.uid())
      and m.role = 'owner' and m.status = 'active'
  )
);

create policy "owners can read organization tool drafts"
on public.tool_instances for select to authenticated
using ((select private.is_active_owner(organization_id)));

revoke all on public.tool_definition_revisions from anon, authenticated;
revoke all on public.mission_tool_bindings from anon, authenticated;
revoke all on public.tool_instances from anon, authenticated;
grant select on public.tool_definition_revisions to authenticated;
grant select on public.mission_tool_bindings to authenticated;
grant select on public.tool_instances to authenticated;
