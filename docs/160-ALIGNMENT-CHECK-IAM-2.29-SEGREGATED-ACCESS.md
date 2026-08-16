# Alignment Check — IAM-2.29 Acesso segregado

## Requisito recuperado

O owner solicitou um mecanismo fácil e seguro: membro entra com e-mail + código, enquanto a equipe Mesa possui login e área interna próprios. O objetivo é eliminar operação manual repetitiva sem introduzir cadastro público ou uma conta administrativa com acesso amplo.

## Autoridades consultadas

- `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md` (ADR-027 e ADR-033), `09-CONSTRUCTION-PROTOCOL.md` e `10-CURRENT-SCOPE.md`.
- `148-DEFINITION-PACK-IAM-2.28-CONTROLLED-ONBOARDING-DRAFT.md` e `151-DEFINITION-PACK-IAM-2.28B-OPERATIONAL-ONBOARDING-DRAFT.md`.
- `159-DEFINITION-PACK-IAM-2.29-SEGREGATED-ACCESS-DRAFT.md`, aprovado pelo owner em 2026-08-13.

## Decisões de alinhamento

1. `internal_operator` será uma capability interna isolada, não um novo papel de negócio de membro.
2. A rota interna não recebe acesso global a organizações, TutorIA, evidências, documentos ou conversas.
3. O bootstrap de e-mails internos permanece uma operação temporária de homologação; os endereços não serão inventados nem gravados antes de o owner fornecê-los.
4. A operação de membro conserva matrícula prévia, expiração, revogação, auditoria, resposta neutra e uma organização por identidade.
5. O acesso por código exige configuração operacional de e-mail e rate limit antes do smoke; nenhuma flag será ligada em produção neste incremento.

## Condição de parada

Parar antes de cadastrar qualquer e-mail real, aplicar migration fora da branch isolada, liberar dados globais ou configurar provedor externo não aprovado.
