# Pre-Flight — IAM-2.28B Operação de onboarding

**Status:** BUILD autorizado; somente homologação.

## Alinhamento

O requisito aprovado é matrícula prévia e entrada sem senha para identidades autorizadas, sem cadastro público e sem uma interface administrativa exposta ao membro. O fluxo deve ser integralmente em nuvem e não deve colocar e-mail, código OTP ou chaves em Git, logs de aplicação ou frontend.

## Autoridades consultadas

- `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md` e `10-CURRENT-SCOPE.md`.
- `151-DEFINITION-PACK-IAM-2.28B-OPERATIONAL-ONBOARDING-DRAFT.md` — aprovado pelo owner em 2026-08-12.
- `154-POST-FLIGHT-IAM-2.28-HOMOLOGATION-BRANCH.md` e `155-GOVERNANCE-CHECKPOINT-ARCH-2.29-PORTABILITY.md`.
- Referência oficial Supabase Admin `createUser`: uso exclusivamente server-side com chave `service_role`.

## Escopo deste incremento

1. Uma Edge Function interna na branch Supabase `homologation-onboarding-iam-228`, acionada apenas por `enrollment_id` e por uma credencial administrativa válida do próprio ambiente.
2. O comando localiza a matrícula já existente, rejeita estado inválido ou vencido, cria ou reaproveita somente a identidade prevista e cria o membership ativo previsto.
3. Atualiza a matrícula e grava auditoria sem expor e-mail, token ou segredo nos logs.
4. Documenta a criação manual e segura da matrícula exclusivamente no SQL Editor e a invocação controlada no Dashboard do Supabase de homologação.

## Fora do escopo

- Produção, cadastro público, painel de backoffice, Google, GitHub OAuth, MFA, SSO e qualquer fluxo membro-administrador.
- Template OTP, rate limit ou envio de e-mail real antes da etapa de configuração/validação própria.
- Armazenar e-mail como input do GitHub Action; o workflow recebe apenas UUID de matrícula.
- Nova migration, alteração de RLS, dados reais ou uma identidade de teste neste passo.

## Arquivos previstos

- `supabase/functions/provision-authorized-enrollment/index.ts`
- `supabase/config.toml`
- `docs/157-RUNBOOK-IAM-2.28B-HOMOLOGATION-ONBOARDING.md`
- `docs/158-GOVERNANCE-CHECKPOINT-IAM-2.28B-SUPABASE-EXECUTION.md`

## Riscos e controles

| Risco | Controle |
| --- | --- |
| Chave administrativa exposta | Somente GitHub Environment secret; nunca variável pública, log ou repositório. |
| Entrada não autorizada | Matrícula pendente, não expirada, com RLS e políticas de negação diretas. |
| Vínculo incorreto | Uma identidade tem apenas um membership; divergência de organização, papel ou estado encerra o comando. |
| Órfão em falha | Identidade recém-criada é excluída quando a criação do membership falha. |
| PII no GitHub | O workflow recebe somente o UUID da matrícula, não o e-mail. |

## Verificação e parada

- Testes, lint, typecheck e build devem passar.
- A função só pode executar com JWT administrativo `service_role` válido da própria branch e UUID de matrícula válido.
- A execução real exige secrets no ambiente `homologation`, matrícula exclusiva de teste e o Post-Flight de smoke.
- Ao primeiro indício de vazamento de segredo, cruzamento de organização ou erro de provisionamento, parar e revogar a identidade de teste.
