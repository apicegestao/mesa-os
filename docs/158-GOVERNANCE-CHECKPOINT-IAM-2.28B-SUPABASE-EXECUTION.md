# Governance Checkpoint — IAM-2.28B Execução direta em homologação

**Status:** BUILD autorizado pelo owner em continuidade ao IAM-2.28B; produção bloqueada.

## Decisão

Substituir o `workflow_dispatch` do GitHub por uma Edge Function exclusiva da branch Supabase isolada. O GitHub não expõe execução manual de workflow que ainda não pertence ao branch padrão; promovê-lo só para executar o smoke violaria o gate de homologação antes de produção.

## Controles

- `verify_jwt = true` no gateway Supabase.
- A própria função exige `role = service_role` após a validação de JWT do gateway; JWT de membro não basta.
- Somente `enrollment_id` entra no payload. E-mail, código OTP e segredos não entram em logs de função, Git ou frontend.
- A função usa a credencial administrativa provida pelo runtime da branch para criar Auth user, identidade, membership, matrícula e auditoria de forma idempotente por matrícula.
- Em falha posterior à criação da identidade, tenta remover apenas a identidade recém-criada.

## Fora do escopo

- Produção, cadastro público, painel interno, Google/OAuth, template OTP, e-mail real e dados não sintéticos.
- A Edge Function não é chamada pelo aplicativo do membro e não é publicada como funcionalidade de produto.

## Rastreabilidade

- Requisito: `151-DEFINITION-PACK-IAM-2.28B-OPERATIONAL-ONBOARDING-DRAFT.md`.
- Pre-Flight: `156-PRE-FLIGHT-IAM-2.28B-OPERATIONAL-ONBOARDING.md`.
- Operação: `157-RUNBOOK-IAM-2.28B-HOMOLOGATION-ONBOARDING.md`.
- Portabilidade: o código-fonte da função permanece no repositório; uma eventual mudança de provedor receberá adaptador e plano próprios.
