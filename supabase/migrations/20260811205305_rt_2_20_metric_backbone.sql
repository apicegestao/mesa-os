alter table public.development_outcomes
  add constraint development_outcomes_id_revision_key unique (id, revision_id);

create table public.metric_definitions (
  id uuid primary key default gen_random_uuid(),
  methodology_revision_id uuid not null references public.methodology_revisions(id),
  pillar_id uuid,
  outcome_id uuid,
  code text not null check (code ~ '^[a-z0-9_]+$'),
  name text not null,
  description text not null,
  version integer not null check (version > 0),
  status text not null check (status in ('draft', 'published', 'retired')),
  value_kind text not null check (value_kind in ('numeric', 'text', 'boolean', 'json')),
  unit_code text not null,
  desired_direction text not null check (desired_direction in ('higher', 'lower', 'target', 'range', 'informational')),
  aggregation text not null check (aggregation in ('latest', 'sum', 'average', 'minimum', 'maximum', 'none')),
  minimum_value numeric,
  maximum_value numeric,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (code, version),
  foreign key (pillar_id, methodology_revision_id) references public.methodology_pillars(id, revision_id),
  foreign key (outcome_id, methodology_revision_id) references public.development_outcomes(id, revision_id),
  check ((status = 'published' and published_at is not null) or status <> 'published'),
  check (minimum_value is null or maximum_value is null or minimum_value <= maximum_value)
);

create unique index metric_definitions_one_published_code_idx on public.metric_definitions(code) where status = 'published';
create index metric_definitions_methodology_idx on public.metric_definitions(methodology_revision_id);
create index metric_definitions_pillar_revision_idx on public.metric_definitions(pillar_id, methodology_revision_id) where pillar_id is not null;
create index metric_definitions_outcome_revision_idx on public.metric_definitions(outcome_id, methodology_revision_id) where outcome_id is not null;

create table public.metric_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cycle_id uuid references public.cycles(id),
  definition_id uuid not null references public.metric_definitions(id),
  numeric_value numeric,
  text_value text,
  boolean_value boolean,
  json_value jsonb,
  effective_on date not null,
  observed_at timestamptz not null default now(),
  source_type text not null check (source_type in ('declared', 'diagnostic', 'evidence', 'tool', 'integration', 'system')),
  diagnostic_execution_id uuid references public.diagnostic_executions(id),
  mission_evidence_id uuid references public.mission_evidence(id),
  tool_instance_id uuid references public.tool_instances(id),
  source_reference text,
  provenance text not null check (provenance in ('declared', 'evidenced', 'validated', 'integrated')),
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  validation_status text not null check (validation_status in ('recorded', 'validated', 'rejected')),
  recorded_by uuid not null references public.identities(id),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, idempotency_key),
  check (num_nonnulls(numeric_value, text_value, boolean_value, json_value) = 1),
  check (num_nonnulls(diagnostic_execution_id, mission_evidence_id, tool_instance_id) <= 1),
  check (cycle_id is null or source_type <> 'diagnostic' or diagnostic_execution_id is not null)
);

create index metric_observations_org_effective_idx on public.metric_observations(organization_id, effective_on desc, id);
create index metric_observations_cycle_definition_idx on public.metric_observations(cycle_id, definition_id, effective_on desc) where cycle_id is not null;
create index metric_observations_definition_effective_idx on public.metric_observations(definition_id, effective_on desc);
create index metric_observations_diagnostic_idx on public.metric_observations(diagnostic_execution_id) where diagnostic_execution_id is not null;
create index metric_observations_evidence_idx on public.metric_observations(mission_evidence_id) where mission_evidence_id is not null;
create index metric_observations_tool_idx on public.metric_observations(tool_instance_id) where tool_instance_id is not null;
create index metric_observations_recorded_by_idx on public.metric_observations(recorded_by);

create table public.metric_targets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  cycle_id uuid references public.cycles(id),
  definition_id uuid not null references public.metric_definitions(id),
  numeric_value numeric,
  text_value text,
  boolean_value boolean,
  json_value jsonb,
  effective_from date not null,
  effective_until date,
  status text not null check (status in ('active', 'achieved', 'retired')),
  set_by uuid not null references public.identities(id),
  created_at timestamptz not null default now(),
  retired_at timestamptz,
  check (num_nonnulls(numeric_value, text_value, boolean_value, json_value) = 1),
  check (effective_until is null or effective_until >= effective_from),
  check ((status = 'retired' and retired_at is not null) or (status <> 'retired' and retired_at is null))
);

create index metric_targets_org_cycle_idx on public.metric_targets(organization_id, cycle_id, definition_id);
create unique index metric_targets_one_active_idx
  on public.metric_targets(organization_id, coalesce(cycle_id, '00000000-0000-0000-0000-000000000000'::uuid), definition_id)
  where status = 'active';
create index metric_targets_set_by_idx on public.metric_targets(set_by);

alter table public.metric_definitions enable row level security;
alter table public.metric_observations enable row level security;
alter table public.metric_targets enable row level security;

create policy "authenticated can read published metric definitions" on public.metric_definitions for select to authenticated
  using (status = 'published' and (select private.current_owner_organization_id()) is not null);
create policy "owners can read organization metric observations" on public.metric_observations for select to authenticated
  using ((select private.is_active_owner(organization_id)));
create policy "owners can read organization metric targets" on public.metric_targets for select to authenticated
  using ((select private.is_active_owner(organization_id)));

revoke all on public.metric_definitions, public.metric_observations, public.metric_targets from anon, authenticated;
grant select on public.metric_definitions, public.metric_observations, public.metric_targets to authenticated;

with revision as (
  select r.id from public.methodology_revisions r
  join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.status = 'published'
  order by r.version desc limit 1
)
insert into public.metric_definitions (
  methodology_revision_id, code, name, description, version, status, value_kind,
  unit_code, desired_direction, aggregation, minimum_value, maximum_value, published_at
)
select revision.id, seed.code, seed.name, seed.description, 1, 'published', 'numeric',
  seed.unit_code, seed.direction, 'latest', seed.minimum, seed.maximum, now()
from revision cross join (values
  ('ime', 'Índice de Maturidade Empresarial', 'Indicador sintético, versionado e explicável de maturidade empresarial.', 'score_0_100', 'higher', 0::numeric, 100::numeric),
  ('owner_operational_hours', 'Horas do dono na operação', 'Horas semanais dedicadas pelo dono à execução operacional.', 'hours_per_week', 'lower', 0::numeric, null::numeric),
  ('owner_decision_concentration', 'Concentração de decisões no dono', 'Percentual das decisões relevantes ainda concentradas no dono.', 'percentage', 'lower', 0::numeric, 100::numeric)
) as seed(code, name, description, unit_code, direction, minimum, maximum);

insert into public.metric_observations (
  organization_id, cycle_id, definition_id, numeric_value, effective_on, source_type,
  diagnostic_execution_id, provenance, confidence, validation_status, recorded_by, idempotency_key
)
select e.organization_id, e.cycle_id, d.id, e.ime_score, e.effective_on, 'diagnostic',
  e.id, 'validated', 1, 'validated', e.completed_by, 'diagnostic-ime:' || e.id::text
from public.diagnostic_executions e
join public.metric_definitions d on d.code = 'ime' and d.status = 'published'
where e.status = 'completed' and e.ime_score is not null
on conflict (organization_id, idempotency_key) do nothing;
