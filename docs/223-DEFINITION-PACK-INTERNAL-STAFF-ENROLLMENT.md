# Definition Pack — matrícula controlada da equipe interna

**Status:** IMPLEMENTED IN HOMOLOGATION — não promovido para produção.  
**Objetivo:** permitir que um Admin libere, de forma simples e auditada, o acesso de equipe por e-mail + código, começando por `mesadosdonos@gmail.com` como Admin Master.

## Escopo

- convite interno vinculado a uma matrícula autorizada em organização de demonstração;
- provisionamento idempotente de identidade, matrícula e acesso interno após confirmação OTP;
- papel interno inicial explicitamente escolhido por Admin; para o Admin Master, `admin`;
- auditoria de criação, provisionamento e atribuição;
- UI interna mínima na área Acessos.

## Regras

- somente Admin cria convite de equipe;
- não existe criação pública, senha, link mágico ou papel implícito;
- convite expira junto da matrícula autorizada;
- o gatilho só atribui papel depois de a identidade ser provisionada pelo fluxo existente;
- o convite de demonstração não dá acesso a organizações reais de membros;
- funções públicas são `SECURITY INVOKER`; lógica privilegiada e trigger ficam em `private`.

## Fora do escopo

- produção, SSO, MFA, WhatsApp, convite em massa, troca automática de papel, personificação de membro real e leitura de dados fora das capabilities existentes.
