-- MTH-3.4E: preserve the seed revision and add the complete internal T1 draft revision.

create or replace function private.allow_methodology_editorial_publication_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'draft'
    and new.status = 'published'
    and old.published_at is null
    and new.published_at is not null
    and (to_jsonb(new) - array['status', 'published_at']) is not distinct from (to_jsonb(old) - array['status', 'published_at']) then
    return new;
  end if;
  if old.status = 'draft'
    and new.status = 'retired'
    and old.published_at is null
    and new.published_at is null
    and (to_jsonb(new) - 'status') is not distinct from (to_jsonb(old) - 'status') then
    return new;
  end if;
  raise exception 'methodology editorial revisions are immutable; only draft publication or retirement is allowed' using errcode = '55000';
end;
$$;

update private.methodology_editorial_unit_revisions
set status = 'retired'
where version = 1 and status = 'draft' and origin = 'mth_3_4a_seed';

with source(code, title, business_outcome, content, implementation_criteria, evidence_criteria, metric_contracts, tutoria_guidance) as (values
  ('t1_finance_dre_dashboard', 'DRE gerencial e painel mínimo', 'O dono passa a decidir por resultado, caixa e indicadores essenciais, não pelo saldo bancário isolado.',
   '{"guide_document":"238-MTH-3-4D-GUIAS-EDITORIAIS-T1.md","summary":"Faturamento, margem, lucro e caixa são leituras distintas. A primeira DRE fecha um mês real com fontes e premissas declaradas.","example":"Receita de 100 mil, custos variáveis de 45 mil, despesas fixas de 25 mil e despesas operacionais de 15 mil exigem leitura separada de margem e resultado.","checklist":["Período definido","Receita, custos e despesas separados","Fonte dos valores declarada","Ritual de fechamento definido","Decisão registrada"],"common_error":"Confundir caixa com lucro."}',
   '["DRE de mês real fechada","Ritual de leitura iniciado","Responsável identificado"]', '["DRE","Decisão registrada","Fonte identificada"]', '["dias_para_fechamento","margem_de_contribuicao","saldo_de_caixa"]',
   '{"opening_question":"Qual mês real podemos fechar primeiro e onde estão esses números?","guide":"Explique a diferença entre resultado e caixa; peça dados faltantes antes de analisar.","limits":["Não inventar números","Não oferecer aconselhamento contábil ou fiscal"]}'),
  ('t1_leadership_roles_org_chart', 'Papéis, decisões e organograma essencial', 'A empresa torna explícito quem decide, executa e responde pelos resultados essenciais.',
   '{"guide_document":"238-MTH-3-4D-GUIAS-EDITORIAIS-T1.md","summary":"Cargo, papel e decisão são distintos. Cada resultado essencial precisa de responsável final e autonomia com limite conhecido.","example":"Em compras, o coordenador cota, o financeiro confere orçamento e o dono aprova apenas exceções acima do limite.","checklist":["Papéis mapeados","Resultados explícitos","Decisões sem escala identificadas","Mapa discutido","Decisão real aplicada"],"common_error":"Criar organograma bonito sem mudar decisões reais."}',
   '["Mapa discutido","Responsáveis identificados","Decisão ou ritual aplicado"]', '["Ata ou rotina em uso","Papel e responsável","Exemplo de autonomia"]', '["decisoes_concentradas_no_dono","responsabilidades_sem_responsavel","frequencia_de_rituais"]',
   '{"opening_question":"Qual decisão ainda depende de você sem necessidade?","guide":"Conduza clareza de papéis sem decidir por pessoas.","limits":["Não criar organograma fictício","Escalar conflito humano persistente"]}'),
  ('t1_marketing_sales_funnel_value', 'Funil comercial e proposta de valor', 'A empresa visualiza oportunidades reais, critérios de etapa e a próxima ação que move cada negociação.',
   '{"guide_document":"238-MTH-3-4D-GUIAS-EDITORIAIS-T1.md","summary":"Funil começa em oportunidade real; cada etapa tem critério observável e toda oportunidade aberta tem próximo passo, data e responsável.","example":"Uma indicação avança ao diagnóstico após reunião e necessidade confirmada; a proposta só entra após a ação e o responsável estarem registrados.","checklist":["Oportunidades reais","Etapas observáveis","Valor estimado separado","Próxima ação","Ritual semanal"],"common_error":"Manter lista de oportunidades sem próxima ação."}',
   '["Funil atualizado","Critérios de etapa","Rotina semanal"]', '["Funil","Proposta ou decisão","Próximas ações"]', '["oportunidades_por_etapa","conversao","ticket_estimado","acoes_sem_proximo_passo"]',
   '{"opening_question":"Qual oportunidade real precisa de uma próxima ação agora?","guide":"Ajude a organizar hipótese e discurso a partir de fatos informados.","limits":["Não prometer venda","Não contatar leads"]}'),
  ('t1_processes_map', 'Mapa de processo crítico', 'Um processo crítico deixa de depender de memória e passa a ter fluxo, responsável e ponto de controle.',
   '{"guide_document":"238-MTH-3-4D-GUIAS-EDITORIAIS-T1.md","summary":"Mapeie um processo de alto impacto: gatilho, saída, etapas, responsáveis, controles e exceções; teste em operação vale mais que documento bonito.","example":"No atendimento inicial, a solicitação é gatilho e a proposta com confirmação de recebimento é saída; etapas têm responsável, prazo e controle.","checklist":["Processo crítico escolhido","Gatilho e saída","Responsáveis","Controles","Exceções","Teste real"],"common_error":"Documentar um fluxo idealizado que ninguém usa."}',
   '["Processo desenhado","Controle definido","Teste operacional"]', '["Registro de uso","Checklist","Comparação verificável quando houver fonte"]', '["tempo_de_ciclo","falhas_ou_retrabalho","etapas_sem_responsavel","aderencia_ao_checklist"]',
   '{"opening_question":"Qual processo gera mais retrabalho hoje?","guide":"Faça perguntas de mapeamento e destaque exceções antes de propor padrão.","limits":["Não criar procedimento fictício","Não afirmar ganho sem fonte"]}')
)
insert into private.methodology_editorial_unit_revisions (methodology_outcome_id, code, version, status, title, business_outcome, content, implementation_criteria, evidence_criteria, metric_contracts, tutoria_guidance, origin)
select outcome.id, source.code, 2, 'draft', source.title, source.business_outcome, source.content::jsonb, source.implementation_criteria::jsonb, source.evidence_criteria::jsonb, source.metric_contracts::jsonb, source.tutoria_guidance::jsonb, 'mth_3_4d_guide_sync'
from source join public.development_outcomes outcome on outcome.code = source.code;

insert into private.methodology_editorial_tool_links (editorial_revision_id, workbench_tool_code, workbench_tool_version, role)
select editorial.id, seed.tool_code, 1, 'primary'
from (values
  ('t1_finance_dre_dashboard', 'dre_management_v1'),
  ('t1_leadership_roles_org_chart', 'raci_roles_decisions_v1'),
  ('t1_marketing_sales_funnel_value', 'sales_funnel_value_v1'),
  ('t1_processes_map', 'critical_process_map_v1')
) as seed(editorial_code, tool_code)
join private.methodology_editorial_unit_revisions editorial on editorial.code = seed.editorial_code and editorial.version = 2;
