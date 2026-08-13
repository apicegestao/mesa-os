# Runbook — IAM-2.28B Onboarding em homologação

## Finalidade

Executar uma única matrícula de teste já autorizada, sem cadastro público e sem expor PII ou segredo no GitHub.

## Pré-requisitos

1. Usar exclusivamente a branch Supabase `homologation-onboarding-iam-228`.
2. No ambiente GitHub `homologation`, cadastrar os secrets `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` dessa branch. Nunca usar valores de produção.
3. Confirmar que o ambiente GitHub exige os revisores/proteções definidos pela equipe antes da execução.
4. Criar a matrícula no SQL Editor da branch, com e-mail de teste exclusivo, organização existente, papel autorizado e validade curta. Registrar também o evento `created` em `access_enrollment_audits`.

## Execução

1. Abrir **Actions → Provision authorized enrollment → Run workflow**.
2. Informar somente o UUID da matrícula. Não colocar e-mail, código OTP ou chave nos inputs.
3. Confirmar saída `status: provisioned` e guardar apenas o UUID de matrícula/identidade no registro interno de homologação.
4. Só então configurar template OTP e habilitar a flag no deploy preview para o smoke autorizado.

## Falha e rollback

- Se a ação falhar após criar identidade, tenta apagar apenas a identidade recém-criada; nenhuma identidade preexistente é apagada.
- Se houver incompatibilidade de membership, o comando para sem alterar vínculo existente.
- Revogar a matrícula de teste, remover a identidade/sessões de teste e destruir a branch temporária quando o smoke terminar.

## Limites

Este runbook não autoriza produção, e-mail real, Google/OAuth, criação pública de contas ou qualquer alteração na política de cadastro.
