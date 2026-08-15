# MTH-3.4C — Correção de acesso ao workspace editorial

**Data:** 2026-08-14  
**Ambiente:** homologação  
**Status:** aplicado e verificado

## Ocorrência

O workspace Editorial da operação interna exibia estado vazio mesmo para uma identidade com papel `admin` ativo. As unidades T1 em rascunho permaneciam íntegras no banco.

## Causa e correção

A ponte pública `SECURITY INVOKER` não possuía a permissão necessária para invocar a implementação privada protegida. A migration `20260815041000_mth_3_4c_editorial_workspace_rpc_grant.sql` concede somente essa execução à identidade autenticada.

A implementação privada continua fora do schema exposto e valida `auth.uid()` com `private.has_internal_role(..., 'admin')` antes de devolver conteúdo ou permitir publicação.

## Verificação

- identidade Admin de homologação: 8 revisões visíveis (4 `retired`, 4 `draft`);
- nenhuma unidade ou ferramenta foi publicada por esta correção;
- Security Advisor: nenhum alerta novo ligado à migration.

## Limite preservado

A publicação das unidades T1 continua deliberada, auditada e limitada à homologação por ação explícita de Admin no módulo Editorial.
