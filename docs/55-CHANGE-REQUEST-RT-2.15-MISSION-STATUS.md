# Change Request — RT-2.15 Mission Status Constraint

**Status:** APPROVED  
**Owner:** Rafael Portela Martins  
**Data:** 2026-08-11

## Mudança

Substituir exclusivamente a constraint `missions_status_check` para aceitar `completed`, além de `locked` e `available`.

## Justificativa

O estado `completed` foi aprovado no Definition Pack, mas a constraint vigente o rejeita. PostgreSQL exige remover a constraint anterior antes de instalar e validar a nova.

## Limites

- Nenhuma tabela, coluna ou linha será removida.
- A substituição ocorre na mesma migration e transação.
- A nova constraint será validada antes da conclusão.
- Nenhuma outra operação `DROP` é autorizada.

## Aprovação

O owner respondeu “aprovo” ao Change Request explícito em 2026-08-11.
