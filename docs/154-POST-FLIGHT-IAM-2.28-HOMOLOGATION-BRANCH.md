# Post-Flight — IAM-2.28 Branch de homologação

**Ambiente:** branch temporária `homologation-onboarding-iam-228` (`pjkfifjcaezspwessaem`)  
**Dados de produção:** não copiados  
**Custo confirmado:** US$ 0,01344/hora enquanto a branch existir.

## Executado

- Criada branch Supabase temporária e isolada a partir de `Mesa OS`.
- Aplicada a migration de matrícula de acesso IAM-2.28 somente na branch.
- O primeiro Advisor identificou duas tabelas internas com RLS sem política e índices faltantes para FKs de auditoria.
- Foi adicionada migration de hardening com políticas explícitas de negação e índices para FKs da nova superfície.
- Security Advisor da branch ficou sem alertas após o hardening.
- Confirmação direta: `access_enrollments = 0` e `access_enrollment_audits = 0`.

## Não executado

- Nenhum usuário, identidade, matrícula, convite, membership ou e-mail real criado.
- Nenhuma configuração de template OTP, rate limit, GitHub/Google, secret ou produção alterada.
- Nenhuma mudança nos dados ou no schema do projeto principal.

## Pendências para smoke

1. Apontar o deploy preview para a branch isolada via variáveis públicas do Netlify.
2. Configurar o template de e-mail para `{{ .Token }}` e limites no projeto isolado.
3. Habilitar `NEXT_PUBLIC_EMAIL_CODE_LOGIN_ENABLED` somente no deploy preview correspondente.
4. Criar uma única identidade de teste autorizada, executar login por OTP, validar Terms e logout, e revogar ao fim.
5. Destruir a branch temporária após o Post-Flight final para interromper custo.
