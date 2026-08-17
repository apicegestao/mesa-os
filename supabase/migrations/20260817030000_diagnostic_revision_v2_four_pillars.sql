-- DIA-3.6: a new, versioned M0 diagnostic for organizations that have not
-- started the legacy revision. Completed and in-progress executions remain
-- immutable and keep their original revision.

update public.diagnostic_revisions
set status = 'retired'
where id = '10000000-0000-4000-8000-000000000002'
  and status = 'published';

insert into public.diagnostic_revisions (
  id, definition_id, version, status, period_code, published_at
) values (
  '30000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  2,
  'published',
  'm0',
  now()
);

insert into public.diagnostic_dimensions (id, revision_id, code, label, position) values
  ('30000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000001', 'financial_indicators', 'Financeiro e indicadores', 1),
  ('30000000-0000-4000-8000-000000000102', '30000000-0000-4000-8000-000000000001', 'team_culture_leadership', 'Equipe, cultura e liderança', 2),
  ('30000000-0000-4000-8000-000000000103', '30000000-0000-4000-8000-000000000001', 'marketing_sales', 'Marketing e vendas', 3),
  ('30000000-0000-4000-8000-000000000104', '30000000-0000-4000-8000-000000000001', 'internal_processes', 'Processos internos', 4);

insert into public.diagnostic_questions (id, revision_id, dimension_id, code, prompt, position) values
  ('30000000-0000-4000-8000-000000000201', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'financial_close', 'Fechamos os resultados financeiros mensais em até 15 dias e usamos um DRE gerencial para entender receita, margem e despesas.', 1),
  ('30000000-0000-4000-8000-000000000202', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'cash_projection', 'Mantemos uma projeção de caixa atualizada ao menos semanalmente, cobrindo as próximas 13 semanas.', 2),
  ('30000000-0000-4000-8000-000000000203', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'contribution_margin', 'Conhecemos e revisamos a margem de contribuição dos principais produtos ou serviços.', 3),
  ('30000000-0000-4000-8000-000000000204', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'budget_variance', 'Comparamos o planejado com o realizado e registramos as causas dos desvios financeiros relevantes.', 4),
  ('30000000-0000-4000-8000-000000000205', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'financial_metrics', 'Acompanhamos em cadência definida indicadores financeiros críticos, como caixa, margem, receita, inadimplência ou endividamento.', 5),
  ('30000000-0000-4000-8000-000000000206', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'metric_ownership', 'Cada indicador financeiro importante possui fonte de dados, responsável e data de atualização definidos.', 6),
  ('30000000-0000-4000-8000-000000000207', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'data_informed_decisions', 'Decisões relevantes de preço, investimento ou corte de custo usam dados financeiros atualizados.', 7),
  ('30000000-0000-4000-8000-000000000208', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'financial_continuity', 'A rotina financeira crítica continua funcionando quando o dono não está disponível.', 8),
  ('30000000-0000-4000-8000-000000000209', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'role_clarity', 'Papéis e responsabilidades essenciais estão explícitos e são compreendidos pela equipe.', 1),
  ('30000000-0000-4000-8000-000000000210', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'decision_rights', 'Decisões recorrentes têm responsável definido e limites de autonomia conhecidos.', 2),
  ('30000000-0000-4000-8000-000000000211', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'management_cadence', 'Reuniões de gestão ocorrem em cadência fixa, com pauta, dados e encaminhamentos registrados.', 3),
  ('30000000-0000-4000-8000-000000000212', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'leadership_metrics', 'Cada líder acompanha as metas ou indicadores sob sua responsabilidade.', 4),
  ('30000000-0000-4000-8000-000000000213', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'feedback_development', 'Líderes realizam conversas regulares de feedback e desenvolvimento com suas equipes.', 5),
  ('30000000-0000-4000-8000-000000000214', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'people_criteria', 'A empresa usa critérios consistentes para contratar, integrar e avaliar pessoas em funções críticas.', 6),
  ('30000000-0000-4000-8000-000000000215', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'cross_functional_resolution', 'Problemas entre áreas são resolvidos pelos responsáveis, sem depender sempre do dono.', 7),
  ('30000000-0000-4000-8000-000000000216', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'operating_culture', 'Os princípios de cultura aparecem em comportamentos e decisões observáveis no dia a dia.', 8),
  ('30000000-0000-4000-8000-000000000217', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'ideal_customer', 'O cliente prioritário e o problema que a empresa resolve estão definidos e são revisados a partir de clientes reais.', 1),
  ('30000000-0000-4000-8000-000000000218', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'value_proposition', 'A proposta de valor e a oferta comercial são claras, consistentes e usadas pelo time.', 2),
  ('30000000-0000-4000-8000-000000000219', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'demand_measurement', 'Os canais de geração de demanda são medidos por volume, qualidade e custo ou retorno, quando aplicável.', 3),
  ('30000000-0000-4000-8000-000000000220', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'opportunity_management', 'Leads, oportunidades e próximos passos são registrados em uma rotina ou CRM.', 4),
  ('30000000-0000-4000-8000-000000000221', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'funnel_management', 'O funil comercial possui etapas, critérios de avanço e taxas de conversão acompanhadas.', 5),
  ('30000000-0000-4000-8000-000000000222', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'sales_forecast', 'A previsão de vendas é atualizada com oportunidades reais e taxas históricas.', 6),
  ('30000000-0000-4000-8000-000000000223', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'commercial_repeatability', 'O time executa a abordagem e a proposta comercial de forma replicável, sem depender exclusivamente do dono.', 7),
  ('30000000-0000-4000-8000-000000000224', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'customer_learning', 'A empresa mede experiência, retenção, recompra ou indicações e usa esse aprendizado para melhorar a oferta.', 8),
  ('30000000-0000-4000-8000-000000000225', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'critical_process_mapping', 'Processos críticos para entregar ao cliente estão mapeados com começo, fim, responsável e resultado esperado.', 1),
  ('30000000-0000-4000-8000-000000000226', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'standard_work', 'A equipe usa padrões ou procedimentos acessíveis para executar atividades críticas.', 2),
  ('30000000-0000-4000-8000-000000000227', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'handoffs', 'As passagens entre áreas têm responsabilidade e informação mínima definidas.', 3),
  ('30000000-0000-4000-8000-000000000228', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'operations_metrics', 'Indicadores de operação, como prazo, qualidade, retrabalho ou capacidade, são acompanhados em cadência.', 4),
  ('30000000-0000-4000-8000-000000000229', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'root_cause', 'Desvios, falhas e reclamações são registrados e tratados pela causa, não apenas pelo sintoma.', 5),
  ('30000000-0000-4000-8000-000000000230', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'process_change', 'Mudanças de processo são testadas, comunicadas e incorporadas à rotina quando aprovadas.', 6),
  ('30000000-0000-4000-8000-000000000231', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'operational_controls', 'Controles básicos de qualidade, dados e riscos operacionais são praticados de forma consistente.', 7),
  ('30000000-0000-4000-8000-000000000232', '30000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'operational_continuity', 'A operação mantém o padrão de entrega por vários dias sem intervenção diária do dono.', 8);

insert into public.diagnostic_options (id, revision_id, value, label, position) values
  ('30000000-0000-4000-8000-000000000301', '30000000-0000-4000-8000-000000000001', 1, 'Inexistente — não há prática definida ou evidência de uso.', 1),
  ('30000000-0000-4000-8000-000000000302', '30000000-0000-4000-8000-000000000001', 2, 'Reativa — acontece pontualmente, em resposta a urgências e depende de pessoas específicas.', 2),
  ('30000000-0000-4000-8000-000000000303', '30000000-0000-4000-8000-000000000001', 3, 'Definida, mas inconsistente — há processo ou ferramenta, porém a rotina não é confiável nem acompanhada.', 3),
  ('30000000-0000-4000-8000-000000000304', '30000000-0000-4000-8000-000000000001', 4, 'Rotineira e monitorada — é aplicada com cadência, responsável e indicadores ou registros acessíveis.', 4),
  ('30000000-0000-4000-8000-000000000305', '30000000-0000-4000-8000-000000000001', 5, 'Integrada e melhorada — é usada de modo consistente, gera decisões e é revisada para melhorar resultados.', 5);

-- A member may read the retired revision only when it is the revision of an
-- execution in that member's own organization. This keeps legacy results
-- visible without making retired definitions available for new entries.
drop policy if exists "active owners can read published diagnostic revisions" on public.diagnostic_revisions;

create policy "owners can read published or own historical diagnostic revisions"
on public.diagnostic_revisions for select to authenticated
using (
  (status = 'published' and (select private.current_owner_organization_id()) is not null)
  or exists (
    select 1
    from public.diagnostic_executions e
    where e.revision_id = diagnostic_revisions.id
      and (select private.is_active_owner(e.organization_id))
  )
);
