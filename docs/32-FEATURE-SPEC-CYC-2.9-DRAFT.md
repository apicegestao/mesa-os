# CYC-2.9 — Cycle Foundation

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11.

## Objetivo

Criar um período operacional limitado, ligado à prioridade ativa, que estabeleça o contexto temporal para futuras Missões sem antecipá-las.

## Problema resolvido

A prioridade define onde concentrar atenção, mas ainda não existe um intervalo de execução com início, fim e estado claros.

## Usuários

- Owner com prioridade ativa.
- Member permanece fora do primeiro incremento, salvo decisão explícita.

## Escopo preliminar

- Um ciclo vinculado à prioridade ativa e à organização.
- Duração padrão candidata de 90 dias.
- Título derivado da prioridade: `Ciclo — [Dimensão]`.
- Estados `planned`, `active` e `completed`.
- Início explícito pelo owner; data final calculada.
- Exibição de contexto, período e estado como próxima ação.
- Auditoria e isolamento organizacional.

## Fora do escopo

- Missões, tarefas, metas, ferramentas, evidências ou score de execução.
- TutorIA, recomendações, notificações ou calendário externo.
- Múltiplos ciclos simultâneos.
- Replanejamento, extensão ou cancelamento sem regra aprovada.
- Encerramento automático apenas pela passagem do tempo.

## Fluxo preliminar

1. Owner possui prioridade confirmada e nenhum ciclo ativo.
2. Sistema apresenta proposta de ciclo ligada à prioridade.
3. Owner revisa datas e confirma início.
4. Ciclo passa a `active` e apresenta contexto temporal.
5. Sem Missões autorizadas, o sistema informa que a estrutura está pronta para o próximo incremento.

## Regras preliminares

- Ciclo depende de prioridade ativa da própria organização.
- Uma organização possui no máximo um ciclo ativo.
- Prioridade de origem é imutável durante o ciclo.
- Passagem da data final não conclui o ciclo automaticamente.
- Conclusão exige regra futura ligada à execução; não entra neste BUILD sem aprovação.

## UX

- Explicar que Ciclo organiza o período de foco e ainda não contém Missões.
- Mostrar prioridade, início, fim, duração e estado.
- Uma ação principal, linguagem não técnica, mobile e acessibilidade.

## Auditoria

- Organização, prioridade, autor, início, fim, estado e timestamps.

## Critérios de aceite preliminares

- Sem prioridade, ciclo não pode ser criado.
- Segundo ciclo ativo é rejeitado.
- Datas respeitam duração aprovada.
- Ciclo preserva prioridade de origem.
- Nenhuma Missão ou meta é criada.
- RLS, testes, lint, typecheck e build aprovados.

## Decisões obrigatórias antes do BUILD

Decisões aprovadas: 90 dias corridos; início imediato; criação direta como `active`; sem conclusão manual; somente owner visualiza; título derivado; metas, Missões e progresso fora do escopo.

1. Aprovar duração fixa de 90 dias ou permitir escolha controlada?
2. O início é a data da confirmação ou pode ser agendado?
3. A data final usa 90 dias corridos ou três meses-calendário?
4. Criar diretamente como `active` ou passar por `planned`?
5. Owner poderá concluir o ciclo manualmente antes das Missões existirem?
6. Member poderá visualizar o ciclo ativo?
7. O título derivado `Ciclo — [Dimensão]` é suficiente?
8. Confirmar que metas, Missões e progresso permanecem fora do CYC-2.9.

## Testes necessários

- Unidade: datas, estados e cardinalidade.
- Banco: prioridade obrigatória, owner, RLS e ciclo único.
- Integração/E2E: proposta, confirmação, duplicidade, sessão expirada e mobile.

## Dependências

- Aprovação das oito decisões.
- Feature Spec aprovada, novo Current Scope em BUILD e novo Pre-Flight.
- Staging dedicado antes de homologação persistente.
