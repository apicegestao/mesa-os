# Decisão de UX — CRM Kanban por Cliente

**Status:** incorporada ao build de homologação OPS-3.0A em 2026-08-14

## Decisão

A visão principal do CRM Comercial será um **Kanban por empresa/cliente**. Cada empresa terá somente um cartão visível por coluna. O cartão representa o relacionamento comercial da conta, não uma atividade, contato ou tarefa isolada.

Uma mesma conta pode manter histórico de negociações. Quando houver mais de uma oportunidade ativa, o cartão mostra a oportunidade prioritária e um indicador de negociações adicionais; nunca duplica a empresa no quadro.

## Colunas iniciais

1. Entrada
2. Qualificação
3. Proposta
4. Negociação
5. Ganho

Perdidos permanecem fora do fluxo diário, em filtro/arquivo consultável. Isto evita que o quadro operacional fique poluído sem apagar histórico.

## Cartão compacto

Cada cartão deve mostrar apenas o essencial para decidir a próxima ação:

- empresa;
- pessoa de contato principal;
- oportunidade prioritária e valor estimado, quando houver;
- responsável;
- próxima ação e prazo, com sinalização de atraso;
- número de pendências/atividades abertas;
- indicador de outras oportunidades abertas na mesma conta.

O cartão não mostra dados de ciclo, diagnóstico, conversa TutorIA, evidência ou informação de membro.

## Painel de detalhes

Ao selecionar um cartão, abre-se um painel lateral (sem retirar a pessoa do Kanban) com:

- dados estruturados da empresa e de seus contatos;
- resumo da oportunidade prioritária e das demais oportunidades da conta;
- próximas ações e tarefas;
- linha do tempo de atividades comerciais, incluindo alterações de etapa e handoff;
- responsável e origem;
- ações permitidas pelo papel: editar negócio, registrar atividade, alterar etapa ou encaminhar para Concierge após ganho.

Atualizações no painel mantêm a pessoa no contexto do quadro. A movimentação de coluna só altera etapa após validação no servidor e gera evento auditável; não haverá arrastar-e-soltar otimista sem confirmação.

## Limites de segurança e dados

- A agregação por conta respeita a carteira do Comercial; Admin mantém apenas a capacidade já autorizada de leitura comercial ampla.
- Concierge só vê o cartão a partir do handoff atribuído e não recebe o quadro comercial completo.
- Abertura do painel consulta apenas os dados comerciais autorizados para a conta/opportunidade solicitada.
- Atividades e tarefas permanecem fatos separados: o cartão é uma projeção de leitura, não uma nova fonte de verdade.
- A implementação reutiliza as tabelas canônicas `crm_accounts`, `crm_contacts`, `crm_opportunities`, `crm_activities` e `crm_tasks`; não cria ligação com organização Mesa OS ou dados de membros.

## Critérios de aceite desta evolução de interface

1. A mesma empresa não aparece duas vezes na mesma visão de Kanban.
2. Um cartão permite abrir detalhes sem navegar para outra página.
3. Próxima ação, atraso e pendências são legíveis sem abrir o cartão.
4. Alterações de etapa e handoff preservam as mesmas validações, escopo e auditoria da fundação OPS-3.0A.
5. Comercial não vê contas fora da própria carteira; Concierge não vê o Kanban comercial.
6. O quadro funciona com dados reais vazios, uma conta, múltiplas oportunidades e múltiplos contatos.

## Fora desta evolução

- automações, IA de vendas, previsão, e-mail, WhatsApp, Instagram, checkout, faturamento ou integrações externas;
- CRM de membros ativos, metodologia, jornada, TutorIA ou dados sensíveis;
- exclusão física de dados ou importação em massa.
