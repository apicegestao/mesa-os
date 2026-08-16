-- MTH-3.4A: internal, immutable editorial source for the T1 pilot.
-- No row created here is exposed to members or published automatically.

create table private.methodology_editorial_unit_revisions (
  id uuid primary key default gen_random_uuid(),
  methodology_outcome_id uuid not null references public.development_outcomes(id),
  code text not null check (code ~ '^t[1-4]_[a-z0-9_]+$'),
  version integer not null check (version > 0),
  status text not null check (status in ('draft', 'published', 'retired')),
  title text not null check (char_length(trim(title)) between 3 and 160),
  business_outcome text not null check (char_length(trim(business_outcome)) between 20 and 1000),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  implementation_criteria jsonb not null check (jsonb_typeof(implementation_criteria) = 'array' and jsonb_array_length(implementation_criteria) between 1 and 20),
  evidence_criteria jsonb not null check (jsonb_typeof(evidence_criteria) = 'array' and jsonb_array_length(evidence_criteria) between 1 and 20),
  metric_contracts jsonb not null check (jsonb_typeof(metric_contracts) = 'array' and jsonb_array_length(metric_contracts) between 1 and 20),
  tutoria_guidance jsonb not null check (jsonb_typeof(tutoria_guidance) = 'object'),
  origin text not null default 'editorial',
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (code, version),
  unique (methodology_outcome_id, version),
  check ((status = 'published' and published_at is not null) or status <> 'published')
);

create index methodology_editorial_unit_revisions_outcome_idx
  on private.methodology_editorial_unit_revisions(methodology_outcome_id, version desc);

create table private.methodology_editorial_tool_links (
  id uuid primary key default gen_random_uuid(),
  editorial_revision_id uuid not null references private.methodology_editorial_unit_revisions(id) on delete restrict,
  workbench_tool_code text not null,
  workbench_tool_version integer not null check (workbench_tool_version > 0),
  role text not null check (role in ('primary', 'support')),
  created_at timestamptz not null default now(),
  unique (editorial_revision_id, workbench_tool_code, workbench_tool_version),
  foreign key (workbench_tool_code, workbench_tool_version)
    references public.workbench_tool_revisions(code, version)
);

create index methodology_editorial_tool_links_revision_idx
  on private.methodology_editorial_tool_links(editorial_revision_id);

alter table private.methodology_editorial_unit_revisions enable row level security;
alter table private.methodology_editorial_tool_links enable row level security;
revoke all on private.methodology_editorial_unit_revisions, private.methodology_editorial_tool_links from public, anon, authenticated;

create function private.reject_methodology_editorial_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'methodology editorial revisions are immutable; create a new revision' using errcode = '55000';
end;
$$;

revoke all on function private.reject_methodology_editorial_mutation() from public, anon, authenticated;

create trigger methodology_editorial_unit_revisions_immutable
before update or delete on private.methodology_editorial_unit_revisions
for each row execute function private.reject_methodology_editorial_mutation();

create trigger methodology_editorial_tool_links_immutable
before update or delete on private.methodology_editorial_tool_links
for each row execute function private.reject_methodology_editorial_mutation();

insert into public.workbench_tool_revisions (code, version, status, title, methodology_outcome_id, spec)
select seed.code, 1, 'draft', seed.title, outcome.id, seed.spec::jsonb
from (values
  ('sales_funnel_value_v1', 'Funil comercial e proposta', 't1_marketing_sales_funnel_value', '{"fields":[{"code":"opportunities","label":"Oportunidades reais","kind":"entries","required":true,"minEntries":1,"maxEntries":50,"entryFields":[{"code":"company","label":"Empresa ou oportunidade","required":true,"maxLength":120},{"code":"origin","label":"Origem","required":true,"maxLength":80},{"code":"stage","label":"Etapa observável","required":true,"maxLength":80},{"code":"estimated_value","label":"Valor estimado","required":false,"maxLength":40},{"code":"next_action","label":"Próxima ação","required":true,"maxLength":300},{"code":"owner","label":"Responsável","required":true,"maxLength":100}]}],"analysis_dimensions":["etapas do funil","próxima ação","proposta de valor","conversão"],"export_formats":["pdf","xlsx"]}'),
  ('critical_process_map_v1', 'Mapa de processo crítico', 't1_processes_map', '{"fields":[{"code":"process_name","label":"Processo crítico","kind":"text","required":true},{"code":"trigger","label":"Gatilho de início","kind":"text","required":true},{"code":"expected_output","label":"Saída esperada","kind":"text","required":true},{"code":"steps","label":"Etapas e controles","kind":"entries","required":true,"minEntries":1,"maxEntries":30,"entryFields":[{"code":"step","label":"Etapa","required":true,"maxLength":200},{"code":"owner","label":"Responsável","required":true,"maxLength":100},{"code":"control","label":"Ponto de controle","required":true,"maxLength":300},{"code":"risk","label":"Risco ou exceção","required":false,"maxLength":300}]}],"analysis_dimensions":["fluxo","responsáveis","controles","riscos"],"export_formats":["pdf","xlsx"]}')
) as seed(code, title, outcome_code, spec)
join public.development_outcomes outcome on outcome.code = seed.outcome_code
on conflict (code, version) do nothing;

with source(code, title, business_outcome, content, implementation_criteria, evidence_criteria, metric_contracts, tutoria_guidance) as (values
  ('t1_finance_dre_dashboard', 'DRE gerencial e painel mínimo',
   'O dono passa a decidir com resultado, caixa e indicadores essenciais, e não apenas pelo saldo bancário.',
   '{"summary":"Diferença entre faturamento, margem, lucro e caixa; estrutura mínima de DRE; fechamento mensal e leitura de variações.","example":"Uma decisão de reduzir despesa após leitura da margem do mês.","checklist":["Fechar um mês real","Separar receita, custos e despesas","Definir calendário de leitura","Registrar uma decisão baseada na DRE"],"common_error":"Confundir saldo de caixa com lucro."}',
   '["DRE de um período real fechada","Ritual semanal ou mensal definido","Responsável pela atualização identificado"]',
   '["DRE do período","Registro de decisão baseada na leitura","Fonte dos valores identificada"]',
   '["dias_para_fechamento","margem_de_contribuicao","saldo_de_caixa"]',
   '{"opening_question":"Qual mês real podemos fechar primeiro?","guide":"Explique os conceitos e peça dados faltantes antes de analisar.","limits":["Não inventar números","Não prestar aconselhamento contábil ou fiscal"]}'),
  ('t1_leadership_roles_org_chart', 'Papéis, decisões e organograma essencial',
   'A empresa torna explícito quem decide, executa e responde pelos resultados essenciais.',
   '{"summary":"Diferença entre cargo, papel e responsabilidade; limites de autonomia; relações mínimas de reporte.","example":"Uma decisão de compras passa a ter responsável final e limite de autonomia.","checklist":["Mapear papéis essenciais","Definir responsáveis e decisões","Desenhar relações de reporte","Testar em uma decisão real"],"common_error":"Criar organograma sofisticado sem mudar decisões reais."}',
   '["Mapa discutido com a equipe","Responsável final e executor identificados","Decisão ou ritual aplicado"]',
   '["Ata, decisão ou rotina em uso","Registro do papel e responsável","Exemplo de autonomia aplicada"]',
   '["decisoes_concentradas_no_dono","responsabilidades_sem_responsavel","frequencia_de_rituais"]',
   '{"opening_question":"Qual decisão ainda depende desnecessariamente de você?","guide":"Conduza clareza de papéis sem decidir por pessoas.","limits":["Não criar organograma fictício","Escalar conflito humano persistente"]}'),
  ('t1_marketing_sales_funnel_value', 'Funil comercial e proposta de valor',
   'A empresa visualiza oportunidades reais, critérios de etapa e a próxima ação que move cada negociação.',
   '{"summary":"ICP inicial, etapas observáveis, critérios de passagem, proposta de valor e próxima ação.","example":"Uma oportunidade avança porque a próxima reunião, responsável e hipótese de valor estão registrados.","checklist":["Registrar oportunidades reais","Definir etapas observáveis","Definir próxima ação e responsável","Revisar funil semanalmente"],"common_error":"Chamar de funil uma lista sem próxima ação nem critério de etapa."}',
   '["Oportunidades reais registradas","Etapas e critérios definidos","Rotina comercial semanal iniciada"]',
   '["Funil atualizado","Exemplo de proposta ou decisão comercial","Próximas ações identificadas"]',
   '["oportunidades_por_etapa","conversao","ticket_estimado","acoes_sem_proximo_passo"]',
   '{"opening_question":"Qual oportunidade real deve receber uma próxima ação agora?","guide":"Ajude a organizar hipótese e discurso a partir dos fatos informados.","limits":["Não prometer resultado comercial","Não contatar leads"]}'),
  ('t1_processes_map', 'Mapa de processo crítico',
   'Um processo crítico deixa de depender de memória e passa a ter fluxo, responsável e ponto de controle.',
   '{"summary":"Escolha de processo crítico, começo e fim, cliente interno, gargalo, responsável, padrão e exceção.","example":"O atendimento passa a seguir um fluxo com responsável e controle de retorno.","checklist":["Escolher processo crítico","Definir gatilho e saída","Mapear etapas e controles","Testar em operação real"],"common_error":"Documentar um fluxo idealizado que ninguém usa."}',
   '["Processo desenhado","Responsável e controle definidos","Teste operacional realizado"]',
   '["Registro de uso","Checklist preenchido","Falha ou retrabalho comparável quando houver fonte"]',
   '["tempo_de_ciclo","falhas_ou_retrabalho","etapas_sem_responsavel","aderencia_ao_checklist"]',
   '{"opening_question":"Qual processo causa mais retrabalho hoje?","guide":"Faça perguntas de mapeamento e destaque exceções antes de propor padronização.","limits":["Não criar procedimento fictício","Não afirmar melhoria sem fonte"]}')
)
insert into private.methodology_editorial_unit_revisions (
  methodology_outcome_id, code, version, status, title, business_outcome, content,
  implementation_criteria, evidence_criteria, metric_contracts, tutoria_guidance, origin
)
select outcome.id, source.code, 1, 'draft', source.title, source.business_outcome,
  source.content::jsonb, source.implementation_criteria::jsonb, source.evidence_criteria::jsonb,
  source.metric_contracts::jsonb, source.tutoria_guidance::jsonb, 'mth_3_4a_seed'
from source join public.development_outcomes outcome on outcome.code = source.code;

insert into private.methodology_editorial_tool_links (editorial_revision_id, workbench_tool_code, workbench_tool_version, role)
select editorial.id, seed.tool_code, 1, seed.role
from (values
  ('t1_finance_dre_dashboard', 'dre_management_v1', 'primary'),
  ('t1_leadership_roles_org_chart', 'raci_roles_decisions_v1', 'primary'),
  ('t1_marketing_sales_funnel_value', 'sales_funnel_value_v1', 'primary'),
  ('t1_processes_map', 'critical_process_map_v1', 'primary')
) as seed(editorial_code, tool_code, role)
join private.methodology_editorial_unit_revisions editorial on editorial.code = seed.editorial_code and editorial.version = 1;
