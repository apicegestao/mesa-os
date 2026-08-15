# MTH-3.4C — Liberação editorial T1 em homologação

**Data:** 2026-08-14  
**Ambiente:** homologação  
**Ação:** publicação deliberada por Admin via workspace Editorial

## Resultado

Foram publicadas as quatro revisões completas `v2` do T1:

1. DRE gerencial e painel mínimo;
2. Papéis, decisões e organograma essencial;
3. Funil comercial e proposta de valor;
4. Mapa de processo crítico.

As ferramentas vinculadas estão `published`: `dre_management_v1`, `raci_roles_decisions_v1`, `sales_funnel_value_v1` e `critical_process_map_v1`.

## Preservação e limites

- as quatro revisões `v1` permanecem `retired`, sem sobrescrita;
- a publicação ocorreu somente na homologação;
- produção não foi promovida;
- a publicação registrou a auditoria interna prevista no gate MTH-3.4C.

## Correção vinculada

A liberação exigiu a correção de privilégios versionada nas migrations `20260815041000` e `20260815041100`. Ambas preservam a verificação de Admin dentro das funções privadas e não expõem as tabelas editoriais.
