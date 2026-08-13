# Runbook — IAM-2.28B Onboarding em homologação

## Finalidade

Executar uma única matrícula de teste já autorizada, sem cadastro público e sem expor PII ou segredo no GitHub.

## Pré-requisitos

1. Usar exclusivamente a branch Supabase `homologation-onboarding-iam-228`.
2. A função `provision-authorized-enrollment` deve estar implantada somente nessa branch e configurada com `verify_jwt = true`.
3. Criar a matrícula no SQL Editor da branch, com e-mail de teste exclusivo, organização existente, papel autorizado e validade curta. Registrar também o evento `created` em `access_enrollment_audits`.

## Execução

1. Abrir **Edge Functions → provision-authorized-enrollment → Invoke** no Dashboard da branch.
2. Enviar apenas `{ "enrollment_id": "UUID" }` e autenticar a requisição com a chave `service_role` legada dessa mesma branch. Não colocar e-mail, código OTP ou chave no payload.
3. Confirmar saída `status: provisioned` e guardar apenas o UUID de matrícula/identidade no registro interno de homologação.
4. Só então configurar template OTP e habilitar a flag no deploy preview para o smoke autorizado.

## Falha e rollback

- Se a função falhar após criar identidade, tenta apagar apenas a identidade recém-criada; nenhuma identidade preexistente é apagada.
- Se houver incompatibilidade de membership, o comando para sem alterar vínculo existente.
- Revogar a matrícula de teste, remover a identidade/sessões de teste e destruir a branch temporária quando o smoke terminar.

## Limites

Este runbook não autoriza produção, e-mail real, Google/OAuth, criação pública de contas ou qualquer alteração na política de cadastro.

## Descontinuação do caminho anterior

O secret `SUPABASE_SERVICE_ROLE_KEY` registrado no ambiente GitHub `homologation` não é necessário para esta operação direta. Após o smoke aprovado e antes de qualquer promoção, ele deve ser removido do GitHub para reduzir a superfície de segredo.
