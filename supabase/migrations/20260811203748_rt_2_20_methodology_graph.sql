create table public.methodology_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_]+$'),
  name text not null check (char_length(trim(name)) between 2 and 120),
  description text not null,
  created_at timestamptz not null default now()
);

create table public.methodology_revisions (
  id uuid primary key default gen_random_uuid(),
  definition_id uuid not null references public.methodology_definitions(id),
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'retired')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (definition_id, version),
  check ((status = 'published' and published_at is not null) or status <> 'published')
);

create unique index methodology_revisions_one_published_idx
  on public.methodology_revisions(definition_id) where status = 'published';

create table public.methodology_stages (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.methodology_revisions(id),
  code text not null check (code ~ '^t[1-9][0-9]*$'),
  label text not null check (char_length(trim(label)) between 2 and 80),
  position smallint not null check (position > 0),
  recommended_days smallint not null default 90 check (recommended_days > 0),
  unique (revision_id, code), unique (revision_id, position), unique (id, revision_id)
);

create index methodology_stages_revision_id_idx on public.methodology_stages(revision_id);

create table public.methodology_pillars (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.methodology_revisions(id),
  code text not null check (code ~ '^[a-z0-9_]+$'),
  label text not null check (char_length(trim(label)) between 2 and 120),
  position smallint not null check (position > 0),
  color_token text not null check (color_token ~ '^pillar\.[a-z0-9_]+$'),
  unique (revision_id, code), unique (revision_id, position), unique (id, revision_id)
);

create index methodology_pillars_revision_id_idx on public.methodology_pillars(revision_id);

create table public.development_outcomes (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.methodology_revisions(id),
  stage_id uuid not null,
  pillar_id uuid not null,
  code text not null check (code ~ '^[a-z0-9_]+$'),
  title text not null check (char_length(trim(title)) between 2 and 160),
  position smallint not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (revision_id, code), unique (revision_id, stage_id, pillar_id),
  foreign key (stage_id, revision_id) references public.methodology_stages(id, revision_id),
  foreign key (pillar_id, revision_id) references public.methodology_pillars(id, revision_id)
);

create index development_outcomes_revision_stage_idx on public.development_outcomes(revision_id, stage_id);
create index development_outcomes_revision_pillar_idx on public.development_outcomes(revision_id, pillar_id);

alter table public.methodology_definitions enable row level security;
alter table public.methodology_revisions enable row level security;
alter table public.methodology_stages enable row level security;
alter table public.methodology_pillars enable row level security;
alter table public.development_outcomes enable row level security;

create policy "authenticated can read methodology definitions" on public.methodology_definitions for select to authenticated using (true);
create policy "authenticated can read methodology revisions" on public.methodology_revisions for select to authenticated using (true);
create policy "authenticated can read methodology stages" on public.methodology_stages for select to authenticated using (true);
create policy "authenticated can read methodology pillars" on public.methodology_pillars for select to authenticated using (true);
create policy "authenticated can read development outcomes" on public.development_outcomes for select to authenticated using (true);

revoke all on public.methodology_definitions, public.methodology_revisions, public.methodology_stages,
  public.methodology_pillars, public.development_outcomes from anon, authenticated;
grant select on public.methodology_definitions, public.methodology_revisions, public.methodology_stages,
  public.methodology_pillars, public.development_outcomes to authenticated;

with definition as (
  insert into public.methodology_definitions(code, name, description)
  values ('mesa_dos_donos', 'Mesa dos Donos', 'Metodologia de desenvolvimento empresarial organizada pelo Mapa de Desenvolvimento 4 × 4.')
  returning id
)
insert into public.methodology_revisions(definition_id, version, status, published_at)
select id, 1, 'published', now() from definition;

with revision as (
  select r.id from public.methodology_revisions r join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.version = 1
)
insert into public.methodology_stages(revision_id, code, label, position, recommended_days)
select revision.id, seed.code, seed.label, seed.position, 90 from revision cross join (values
  ('t1', 'Fundamentos', 1), ('t2', 'Controle', 2),
  ('t3', 'Previsibilidade', 3), ('t4', 'Autonomia', 4)
) as seed(code, label, position);

with revision as (
  select r.id from public.methodology_revisions r join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.version = 1
)
insert into public.methodology_pillars(revision_id, code, label, position, color_token)
select revision.id, seed.code, seed.label, seed.position, seed.color_token from revision cross join (values
  ('finance', 'Financeiro e indicadores', 1, 'pillar.finance'),
  ('leadership', 'Equipe, cultura e liderança', 2, 'pillar.leadership'),
  ('marketing_sales', 'Marketing e vendas', 3, 'pillar.marketing_sales'),
  ('processes', 'Processos internos', 4, 'pillar.processes')
) as seed(code, label, position, color_token);

with revision as (
  select r.id from public.methodology_revisions r join public.methodology_definitions d on d.id = r.definition_id
  where d.code = 'mesa_dos_donos' and r.version = 1
), seed(stage_code, pillar_code, code, title, position) as (values
  ('t1','finance','t1_finance_dre_dashboard','DRE e painel mínimo',1), ('t2','finance','t2_finance_budget_cash','Orçamento e caixa',2),
  ('t3','finance','t3_finance_goals_forecasts','Metas e projeções',3), ('t4','finance','t4_finance_indicator_decisions','Decisão por indicadores',4),
  ('t1','leadership','t1_leadership_roles_org_chart','Papéis e organograma',1), ('t2','leadership','t2_leadership_rituals','Rituais de liderança',2),
  ('t3','leadership','t3_leadership_performance','Gestão de desempenho',3), ('t4','leadership','t4_leadership_autonomy_succession','Autonomia e sucessão',4),
  ('t1','marketing_sales','t1_marketing_sales_funnel_value','Funil e proposta',1), ('t2','marketing_sales','t2_marketing_sales_routine','Rotina comercial',2),
  ('t3','marketing_sales','t3_marketing_sales_predictability','Previsibilidade de vendas',3), ('t4','marketing_sales','t4_marketing_sales_growth_engine','Motor de crescimento',4),
  ('t1','processes','t1_processes_map','Mapa de processos',1), ('t2','processes','t2_processes_critical_sops','SOPs críticos',2),
  ('t3','processes','t3_processes_indicators','Indicadores de processo',3), ('t4','processes','t4_processes_continuous_improvement','Melhoria contínua',4)
)
insert into public.development_outcomes(revision_id, stage_id, pillar_id, code, title, position)
select revision.id, stage.id, pillar.id, seed.code, seed.title, seed.position
from revision join seed on true
join public.methodology_stages stage on stage.revision_id = revision.id and stage.code = seed.stage_code
join public.methodology_pillars pillar on pillar.revision_id = revision.id and pillar.code = seed.pillar_code;
