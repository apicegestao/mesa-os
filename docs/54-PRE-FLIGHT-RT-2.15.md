# Pre-Flight — RT-2.15 Core Loop Completion

**Data:** 2026-08-11  
**Status:** GO FOR BUILD

## Item autorizado

Implementar IMP-2.15A, EVD-2.15B, MTR-2.15C e STA-2.15D conforme o Definition Pack aprovado pelo owner.

## Documentos consultados

- Constitution, Blueprint, V2 Scope e ADR-034.
- Construction Protocol v1.1 e Current Scope.
- Alignment Check e Definition Pack RT-2.15.
- Specs aprovadas de Implementação, Evidência, Transição e Status.
- Migrations vigentes de Missão e Ferramenta.

## Arquivos previstos

- Migrations versionadas em `supabase/migrations/`, uma por fundação de dados/transição.
- Testes de banco em `supabase/tests/`.
- Módulos `src/modules/implementation`, `src/modules/evidence` e `src/modules/core-loop`.
- Composição mínima em `src/app/app/page.tsx` e estilos necessários.
- Tipos Supabase e testes de unidade/componente.
- Traceability Matrix, ADR e Post-Flight.

## Migrations

1. Implementation Foundation: tabela, RLS, grants e funções owner-only.
2. Evidence Foundation: tabela, RLS e grants.
3. Mission Transition: status/metadata e função transacional idempotente.

Todas serão aditivas. Não há `DROP`, `TRUNCATE`, exclusão de dados ou sobrescrita de registros concluídos.

## Riscos e controles

- Avanço falso: pré-condições cumulativas revalidadas no servidor.
- Corrida/duplo envio: locks, uniqueness e idempotência.
- Acesso cruzado: RLS e `private.is_active_owner`.
- Transição parcial: uma transação com rollback integral.
- Exposição de dados: mensagens seguras e logging sem payload sensível.
- Regressão: testes de estados, componentes, banco, lint, typecheck e build.

## Sequência de BUILD

1. Migrations e testes de banco.
2. Tipos e módulos por capacidade.
3. Composição do fluxo e estados de UX.
4. Regressão completa e Pre-Release Review.
5. Aplicação remota ordenada, smoke com rollback, merge e deploy únicos.

## Fora do escopo

Todo item listado como fora do train no Definition Pack, especialmente TutorIA, Evolução, anexos, member, dashboards, Ferramenta da Missão 2 e conclusão do ciclo.

## Gate

**GO** para BUILD na branch `release/rt-2-15`. Interromper diante de conflito de autoridade, ação destrutiva, falha de isolamento ou decisão material ausente do pack.
