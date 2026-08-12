create table public.workbench_tool_revisions (
  id uuid primary key default gen_random_uuid(),
  code text not null check (code ~ '^[a-z][a-z0-9_]{2,63}$'),
  version integer not null check (version > 0),
  status text not null check (status in ('draft', 'published', 'retired')),
  title text not null check (char_length(trim(title)) between 3 and 120),
  methodology_outcome_id uuid not null references public.development_outcomes(id),
  spec jsonb not null check (jsonb_typeof(spec) = 'object' and jsonb_array_length(spec -> 'fields') between 1 and 80),
  created_at timestamptz not null default now(),
  unique (code, version)
);

create unique index workbench_tool_revisions_one_published_idx
  on public.workbench_tool_revisions(code) where status = 'published';
create index workbench_tool_revisions_outcome_idx on public.workbench_tool_revisions(methodology_outcome_id);

create table public.workbench_tool_instances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  tool_revision_id uuid not null references public.workbench_tool_revisions(id),
  status text not null default 'draft' check (status = 'draft'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 131072),
  created_by uuid not null references public.identities(id),
  updated_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tool_revision_id)
);

create index workbench_tool_instances_org_updated_idx on public.workbench_tool_instances(organization_id, updated_at desc);
create index workbench_tool_instances_revision_idx on public.workbench_tool_instances(tool_revision_id);

alter table public.workbench_tool_revisions enable row level security;
alter table public.workbench_tool_instances enable row level security;

create policy "active members can read published workbench tools"
on public.workbench_tool_revisions for select to authenticated
using (status = 'published' and exists (
  select 1 from public.memberships m
  where m.identity_id = (select auth.uid()) and m.status = 'active'
));

create policy "owners can read organization workbench drafts"
on public.workbench_tool_instances for select to authenticated
using ((select private.is_active_owner(organization_id)));

revoke all on public.workbench_tool_revisions, public.workbench_tool_instances from anon, authenticated;
grant select on public.workbench_tool_revisions, public.workbench_tool_instances to authenticated;

create function private.save_workbench_tool_draft(target_tool_revision_id uuid, submitted_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  allowed_fields text[];
  submitted_fields text[];
  instance_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if jsonb_typeof(submitted_payload) <> 'object' or octet_length(submitted_payload::text) > 131072 then
    raise exception 'invalid workbench payload' using errcode = '22023';
  end if;

  select m.organization_id, array_agg(field ->> 'code' order by field ->> 'code')
  into target_organization_id, allowed_fields
  from public.memberships m
  join public.workbench_tool_revisions r on r.id = target_tool_revision_id and r.status = 'published'
  cross join lateral jsonb_array_elements(r.spec -> 'fields') as field
  where m.identity_id = actor_id and m.role = 'owner' and m.status = 'active'
  group by m.organization_id;

  if target_organization_id is null or allowed_fields is null then
    raise exception 'published workbench tool not available' using errcode = '42501';
  end if;

  select coalesce(array_agg(key order by key), '{}'::text[]) into submitted_fields
  from jsonb_object_keys(submitted_payload) as key;
  if submitted_fields <@ allowed_fields is false then
    raise exception 'workbench payload contains unsupported fields' using errcode = '22023';
  end if;

  insert into public.workbench_tool_instances (
    organization_id, tool_revision_id, status, payload, created_by, updated_by
  ) values (
    target_organization_id, target_tool_revision_id, 'draft', submitted_payload, actor_id, actor_id
  ) on conflict (organization_id, tool_revision_id) do update set
    payload = excluded.payload,
    updated_by = excluded.updated_by,
    updated_at = now()
  returning id into instance_id;

  return instance_id;
end;
$$;

revoke all on function private.save_workbench_tool_draft(uuid, jsonb) from public, anon, authenticated;

create function public.save_workbench_tool_draft(target_tool_revision_id uuid, submitted_payload jsonb)
returns uuid
language sql
security invoker
set search_path = ''
as $$ select private.save_workbench_tool_draft($1, $2) $$;

revoke all on function public.save_workbench_tool_draft(uuid, jsonb) from public, anon;
grant execute on function public.save_workbench_tool_draft(uuid, jsonb) to authenticated;

insert into public.workbench_tool_revisions (code, version, status, title, methodology_outcome_id, spec)
select
  'dre_management_v1',
  1,
  'published',
  'DRE gerencial',
  outcome.id,
  '{
    "fields": [
      {"code":"period","label":"Período de referência","kind":"date","required":true},
      {"code":"revenue","label":"Receita líquida","kind":"money","required":true},
      {"code":"variable_costs","label":"Custos variáveis","kind":"money","required":true},
      {"code":"fixed_costs","label":"Custos fixos","kind":"money","required":true},
      {"code":"operating_expenses","label":"Despesas operacionais","kind":"money","required":true},
      {"code":"financial_result","label":"Resultado financeiro","kind":"money","required":false},
      {"code":"taxes","label":"Tributos","kind":"money","required":false}
    ],
    "analysis_dimensions":["receita","margem","estrutura de custos","despesas","resultado","tendência"],
    "export_formats":["pdf","xlsx"]
  }'::jsonb
from public.development_outcomes outcome
where outcome.code = 't1_finance_dre_dashboard';
