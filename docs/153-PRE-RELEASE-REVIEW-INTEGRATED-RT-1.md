# Pre-Release Review — Release Train integrado

**Status:** HOLD — promoção não autorizada ainda

## Revisão realizada

- Produção `vlkkokjbtmdeoxewsbiy`: 53 migrations aplicadas, incluindo RT-2.20 até RT-2.27A e os hotfixes de recibos.
- Security Advisor de produção: nenhum alerta.
- Pull request #13: aberto, draft e mergeable; o preview atualizado está disponível, mas não é gate suficiente para promoção.
- Branch contém cinco commits além de `main`: refinamento de experiência do membro e IAM-2.28/IAM-2.28B.

## Achado de bloqueio resolvido em código

O código de acesso só pode funcionar quando o template de e-mail Supabase utiliza `{{ .Token }}`. Antes da configuração operacional, exibir o campo de código seria uma promessa enganosa, pois o ambiente poderia continuar enviando link.

Foi aplicado um gate explícito:

- `NEXT_PUBLIC_EMAIL_CODE_LOGIN_ENABLED` inicia `false` em todos os ambientes;
- o campo de código só aparece após template OTP, rate limits e smoke aprovados no mesmo ambiente;
- produção continua com a experiência já configurada até promoção deliberada.

## Bloqueios de promoção

1. A migration local `20260812212826_iam_2_28_controlled_onboarding.sql` ainda não foi aplicada nem revisada por Advisor em homologação isolada.
2. A homologação acessível neste fluxo não está conectada ao controle de banco do repositório; não será usada como substituto de ambiente de teste persistente.
3. Template OTP, rate limits, matrícula de teste e smoke autenticado ainda não foram realizados.
4. O PR ainda é draft e não recebeu a revisão integrada de diff/migrations para merge.

## Condições para a próxima promoção consolidada

1. Criar ou reconectar uma homologação persistente controlada.
2. Aplicar a migration IAM-2.28 nela, executar Security Advisor e validar RLS/grants.
3. Configurar template com `{{ .Token }}`, manter signups desabilitados e habilitar a flag apenas nesse ambiente.
4. Criar uma única identidade de teste pré-autorizada, executar smoke, revogar o acesso de teste e registrar a auditoria.
5. Revisar PR/CI e solicitar autorização explícita de merge e deploy único.

## Conclusão

A produção está segura e a branch está tecnicamente verde, mas não será promovida enquanto o onboarding controlado não tiver uma prova operacional completa. O HOLD protege contra cadastro público, login enganoso e migração sem verificação.
