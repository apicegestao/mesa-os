create type public.diagnostic_revision_status as enum ('draft', 'published', 'retired');
create type public.diagnostic_execution_status as enum ('draft', 'completed');

create table public.diagnostic_definitions (
  id uuid primary key,
  code text not null unique check (code ~ '^[a-z0-9_]+$'),
  name text not null check (char_length(trim(name)) between 2 and 120),
  description text not null,
  created_at timestamptz not null default now()
);

create table public.diagnostic_revisions (
  id uuid primary key,
  definition_id uuid not null references public.diagnostic_definitions(id),
  version integer not null check (version > 0),
  status public.diagnostic_revision_status not null default 'draft',
  period_code text not null check (period_code = 'm0'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (definition_id, version),
  check ((status = 'published' and published_at is not null) or status <> 'published')
);

create unique index diagnostic_revisions_one_published_period_idx
  on public.diagnostic_revisions (definition_id, period_code)
  where status = 'published';

create table public.diagnostic_dimensions (
  id uuid primary key,
  revision_id uuid not null references public.diagnostic_revisions(id),
  code text not null check (code ~ '^[a-z0-9_]+$'),
  label text not null,
  position smallint not null check (position > 0),
  unique (revision_id, code),
  unique (revision_id, position),
  unique (id, revision_id)
);

create table public.diagnostic_questions (
  id uuid primary key,
  revision_id uuid not null references public.diagnostic_revisions(id),
  dimension_id uuid not null,
  code text not null check (code ~ '^[a-z0-9_]+$'),
  prompt text not null check (char_length(trim(prompt)) between 5 and 500),
  position smallint not null check (position > 0),
  required boolean not null default true,
  unique (revision_id, code),
  unique (dimension_id, position),
  foreign key (dimension_id, revision_id)
    references public.diagnostic_dimensions(id, revision_id)
);

create index diagnostic_questions_revision_id_idx on public.diagnostic_questions (revision_id);

create table public.diagnostic_options (
  id uuid primary key,
  revision_id uuid not null references public.diagnostic_revisions(id),
  value smallint not null check (value between 1 and 5),
  label text not null,
  position smallint not null check (position > 0),
  unique (revision_id, value),
  unique (revision_id, position)
);

create table public.diagnostic_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  revision_id uuid not null references public.diagnostic_revisions(id),
  period_code text not null check (period_code = 'm0'),
  status public.diagnostic_execution_status not null default 'draft',
  started_by uuid not null references public.identities(id),
  completed_by uuid references public.identities(id),
  ime_score smallint check (ime_score between 0 and 100),
  stage_code text,
  stage_label text,
  result_snapshot jsonb,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (organization_id, revision_id, period_code),
  check (
    (status = 'draft' and completed_by is null and completed_at is null and ime_score is null and result_snapshot is null)
    or
    (status = 'completed' and completed_by is not null and completed_at is not null and ime_score is not null and result_snapshot is not null)
  )
);

create index diagnostic_executions_organization_id_idx
  on public.diagnostic_executions (organization_id);

create table public.diagnostic_responses (
  execution_id uuid not null references public.diagnostic_executions(id) on delete cascade,
  question_id uuid not null references public.diagnostic_questions(id),
  value smallint not null check (value between 1 and 5),
  answered_by uuid not null references public.identities(id),
  updated_at timestamptz not null default now(),
  primary key (execution_id, question_id)
);

create index diagnostic_responses_question_id_idx on public.diagnostic_responses (question_id);

create or replace function private.is_active_owner(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.identity_id = (select auth.uid())
      and m.role = 'owner'
      and m.status = 'active'
  );
$$;

create or replace function private.current_owner_organization_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.organization_id
  from public.memberships m
  where m.identity_id = (select auth.uid())
    and m.role = 'owner'
    and m.status = 'active'
  limit 1;
$$;

create or replace function public.start_diagnostic(target_revision_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  execution_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  target_organization_id := private.current_owner_organization_id();
  if target_organization_id is null then
    raise exception 'active owner membership required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.diagnostic_revisions r
    where r.id = target_revision_id and r.status = 'published' and r.period_code = 'm0'
  ) then
    raise exception 'published diagnostic revision not found' using errcode = '22023';
  end if;

  insert into public.diagnostic_executions (
    organization_id, revision_id, period_code, started_by
  ) values (
    target_organization_id, target_revision_id, 'm0', actor_id
  )
  on conflict (organization_id, revision_id, period_code) do update
    set updated_at = public.diagnostic_executions.updated_at
  returning id into execution_id;

  return execution_id;
end;
$$;

create or replace function public.save_diagnostic_responses(
  target_execution_id uuid,
  submitted_answers jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_revision_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select e.revision_id into target_revision_id
  from public.diagnostic_executions e
  where e.id = target_execution_id
    and e.status = 'draft'
    and private.is_active_owner(e.organization_id)
  for update;

  if target_revision_id is null then
    raise exception 'editable diagnostic execution not found' using errcode = '42501';
  end if;

  if jsonb_typeof(submitted_answers) <> 'array' then
    raise exception 'answers must be an array' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(submitted_answers) as a(question_id uuid, value smallint)
    left join public.diagnostic_questions q
      on q.id = a.question_id and q.revision_id = target_revision_id
    where q.id is null or a.value not between 1 and 5
  ) then
    raise exception 'invalid answer payload' using errcode = '22023';
  end if;

  if (
    select count(*) from jsonb_to_recordset(submitted_answers) as a(question_id uuid, value smallint)
  ) <> (
    select count(distinct a.question_id) from jsonb_to_recordset(submitted_answers) as a(question_id uuid, value smallint)
  ) then
    raise exception 'duplicate question in answer payload' using errcode = '22023';
  end if;

  insert into public.diagnostic_responses (execution_id, question_id, value, answered_by)
  select target_execution_id, a.question_id, a.value, actor_id
  from jsonb_to_recordset(submitted_answers) as a(question_id uuid, value smallint)
  on conflict (execution_id, question_id) do update
    set value = excluded.value,
        answered_by = excluded.answered_by,
        updated_at = now();

  update public.diagnostic_executions
  set updated_at = now()
  where id = target_execution_id;
end;
$$;

create or replace function public.submit_diagnostic(target_execution_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_revision_id uuid;
  required_count integer;
  answered_count integer;
  overall_score integer;
  stage text;
  stage_name text;
  snapshot jsonb;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select e.revision_id into target_revision_id
  from public.diagnostic_executions e
  where e.id = target_execution_id
    and e.status = 'draft'
    and private.is_active_owner(e.organization_id)
  for update;

  if target_revision_id is null then
    raise exception 'submittable diagnostic execution not found' using errcode = '42501';
  end if;

  select count(*) into required_count
  from public.diagnostic_questions q
  where q.revision_id = target_revision_id and q.required;

  select count(*) into answered_count
  from public.diagnostic_responses a
  join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id
    and q.revision_id = target_revision_id
    and q.required;

  if required_count = 0 or answered_count <> required_count then
    raise exception 'all required questions must be answered' using errcode = '23514';
  end if;

  select round((sum(a.value)::numeric / (required_count * 5)) * 100)::integer
  into overall_score
  from public.diagnostic_responses a
  join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id and q.required;

  if overall_score < 40 then stage := 'empresa_refem'; stage_name := 'Empresa Refém';
  elsif overall_score < 60 then stage := 'em_transicao'; stage_name := 'Em Transição';
  elsif overall_score < 80 then stage := 'em_maturacao'; stage_name := 'Em Maturação';
  else stage := 'autogerenciavel'; stage_name := 'Autogerenciável';
  end if;

  select jsonb_build_object(
    'ime', overall_score,
    'stageCode', stage,
    'stageLabel', stage_name,
    'dimensions', jsonb_agg(
      jsonb_build_object(
        'code', dimension_scores.code,
        'label', dimension_scores.label,
        'score', dimension_scores.score
      ) order by dimension_scores.position
    )
  ) into snapshot
  from (
    select d.code, d.label, d.position,
      round((sum(a.value)::numeric / (count(*) * 5)) * 100)::integer as score
    from public.diagnostic_dimensions d
    join public.diagnostic_questions q on q.dimension_id = d.id
    join public.diagnostic_responses a
      on a.question_id = q.id and a.execution_id = target_execution_id
    where d.revision_id = target_revision_id
    group by d.id, d.code, d.label, d.position
  ) as dimension_scores;

  update public.diagnostic_executions
  set status = 'completed',
      completed_by = actor_id,
      ime_score = overall_score,
      stage_code = stage,
      stage_label = stage_name,
      result_snapshot = snapshot,
      completed_at = now(),
      updated_at = now()
  where id = target_execution_id;

  return snapshot;
end;
$$;

revoke all on function private.is_active_owner(uuid) from public;
revoke all on function private.current_owner_organization_id() from public;
revoke all on function public.start_diagnostic(uuid) from public, anon;
revoke all on function public.save_diagnostic_responses(uuid, jsonb) from public, anon;
revoke all on function public.submit_diagnostic(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_active_owner(uuid) to authenticated;
grant execute on function private.current_owner_organization_id() to authenticated;
grant execute on function public.start_diagnostic(uuid) to authenticated;
grant execute on function public.save_diagnostic_responses(uuid, jsonb) to authenticated;
grant execute on function public.submit_diagnostic(uuid) to authenticated;

alter table public.diagnostic_definitions enable row level security;
alter table public.diagnostic_revisions enable row level security;
alter table public.diagnostic_dimensions enable row level security;
alter table public.diagnostic_questions enable row level security;
alter table public.diagnostic_options enable row level security;
alter table public.diagnostic_executions enable row level security;
alter table public.diagnostic_responses enable row level security;

create policy "active owners can read diagnostic definitions"
on public.diagnostic_definitions for select to authenticated
using ((select private.current_owner_organization_id()) is not null);

create policy "active owners can read published diagnostic revisions"
on public.diagnostic_revisions for select to authenticated
using (status = 'published' and (select private.current_owner_organization_id()) is not null);

create policy "active owners can read diagnostic dimensions"
on public.diagnostic_dimensions for select to authenticated
using ((select private.current_owner_organization_id()) is not null);

create policy "active owners can read diagnostic questions"
on public.diagnostic_questions for select to authenticated
using ((select private.current_owner_organization_id()) is not null);

create policy "active owners can read diagnostic options"
on public.diagnostic_options for select to authenticated
using ((select private.current_owner_organization_id()) is not null);

create policy "owners can read organization diagnostic executions"
on public.diagnostic_executions for select to authenticated
using ((select private.is_active_owner(organization_id)));

create policy "owners can read organization diagnostic responses"
on public.diagnostic_responses for select to authenticated
using (
  execution_id in (
    select e.id from public.diagnostic_executions e
    where (select private.is_active_owner(e.organization_id))
  )
);

revoke all on public.diagnostic_definitions, public.diagnostic_revisions,
  public.diagnostic_dimensions, public.diagnostic_questions, public.diagnostic_options,
  public.diagnostic_executions, public.diagnostic_responses from anon, authenticated;
grant select on public.diagnostic_definitions, public.diagnostic_revisions,
  public.diagnostic_dimensions, public.diagnostic_questions, public.diagnostic_options,
  public.diagnostic_executions, public.diagnostic_responses to authenticated;

insert into public.diagnostic_definitions (id, code, name, description) values
  ('10000000-0000-4000-8000-000000000001', 'raio_x_empresario', 'Raio-X do Empresário', 'Diagnóstico de maturidade empresarial na entrada da Mesa dos Donos')
on conflict (id) do nothing;

insert into public.diagnostic_revisions (id, definition_id, version, status, period_code, published_at) values
  ('10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 1, 'published', 'm0', now())
on conflict (id) do nothing;

insert into public.diagnostic_dimensions (id, revision_id, code, label, position) values
  ('10000000-0000-4000-8000-000000000101', '10000000-0000-4000-8000-000000000002', 'financial', 'Financeiro', 1),
  ('10000000-0000-4000-8000-000000000102', '10000000-0000-4000-8000-000000000002', 'leadership', 'Liderança & Equipe', 2),
  ('10000000-0000-4000-8000-000000000103', '10000000-0000-4000-8000-000000000002', 'marketing', 'Marketing & Captação', 3),
  ('10000000-0000-4000-8000-000000000104', '10000000-0000-4000-8000-000000000002', 'sales', 'Vendas & Comercial', 4),
  ('10000000-0000-4000-8000-000000000105', '10000000-0000-4000-8000-000000000002', 'autonomy', 'Autonomia do Dono', 5)
on conflict (id) do nothing;

insert into public.diagnostic_questions (id, revision_id, dimension_id, code, prompt, position) values
  ('10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000101', 'financial_1', 'Você conhece a margem de contribuição de cada produto ou serviço?', 1),
  ('10000000-0000-4000-8000-000000000202', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000101', 'financial_2', 'Tem previsibilidade de caixa para os próximos 60 a 90 dias?', 2),
  ('10000000-0000-4000-8000-000000000203', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000101', 'financial_3', 'Toma decisões com base em indicadores, não em feeling?', 3),
  ('10000000-0000-4000-8000-000000000204', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000101', 'financial_4', 'Seu financeiro é atualizado e monitorado pela equipe, sem depender de você?', 4),
  ('10000000-0000-4000-8000-000000000205', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000102', 'leadership_1', 'Seu time executa tarefas críticas do dia a dia sem te consultar?', 1),
  ('10000000-0000-4000-8000-000000000206', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000102', 'leadership_2', 'Cada área tem um responsável com metas claramente definidas?', 2),
  ('10000000-0000-4000-8000-000000000207', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000102', 'leadership_3', 'Você conduz reuniões de gestão com cadência definida e consistente?', 3),
  ('10000000-0000-4000-8000-000000000208', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000102', 'leadership_4', 'A cultura da empresa se mantém mesmo quando você está ausente?', 4),
  ('10000000-0000-4000-8000-000000000209', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000103', 'marketing_1', 'Seu posicionamento no mercado é claro e diferenciado da concorrência?', 1),
  ('10000000-0000-4000-8000-000000000210', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000103', 'marketing_2', 'Você tem canais de geração de leads previsíveis e mensuráveis?', 2),
  ('10000000-0000-4000-8000-000000000211', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000103', 'marketing_3', 'A jornada do cliente está mapeada do primeiro contato até a recompra?', 3),
  ('10000000-0000-4000-8000-000000000212', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000103', 'marketing_4', 'Você monitora ativamente retenção e recompra de clientes?', 4),
  ('10000000-0000-4000-8000-000000000213', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000104', 'sales_1', 'O processo de vendas está documentado e qualquer vendedor consegue replicar?', 1),
  ('10000000-0000-4000-8000-000000000214', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000104', 'sales_2', 'As metas comerciais são atingidas sem a sua intervenção direta?', 2),
  ('10000000-0000-4000-8000-000000000215', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000104', 'sales_3', 'Existe um roteiro de vendas utilizado ativamente pelo time?', 3),
  ('10000000-0000-4000-8000-000000000216', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000104', 'sales_4', 'Você monitora a taxa de conversão por etapa do funil de vendas?', 4),
  ('10000000-0000-4000-8000-000000000217', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000105', 'autonomy_1', 'Sua empresa funciona normalmente por 5 ou mais dias sem sua presença?', 1),
  ('10000000-0000-4000-8000-000000000218', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000105', 'autonomy_2', 'As decisões operacionais são tomadas pela equipe, não por você?', 2),
  ('10000000-0000-4000-8000-000000000219', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000105', 'autonomy_3', 'Você tem tempo dedicado exclusivamente à estratégia do negócio?', 3),
  ('10000000-0000-4000-8000-000000000220', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000105', 'autonomy_4', 'Existe um líder ou gerente conduzindo o time operacional no lugar do dono?', 4)
on conflict (id) do nothing;

insert into public.diagnostic_options (id, revision_id, value, label, position) values
  ('10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000002', 1, 'Não existe', 1),
  ('10000000-0000-4000-8000-000000000302', '10000000-0000-4000-8000-000000000002', 2, 'Raramente funciona', 2),
  ('10000000-0000-4000-8000-000000000303', '10000000-0000-4000-8000-000000000002', 3, 'Às vezes', 3),
  ('10000000-0000-4000-8000-000000000304', '10000000-0000-4000-8000-000000000002', 4, 'Com frequência', 4),
  ('10000000-0000-4000-8000-000000000305', '10000000-0000-4000-8000-000000000002', 5, 'Totalmente estruturado', 5)
on conflict (id) do nothing;
