# Pre-Flight — IAM-2.28 Onboarding controlado

**Status:** BUILD  
**Aprovação do owner:** 2026-08-12 ("Siga")

## Item e autoridade

Implementar somente a fundação de matrícula e provisionamento controlado definida em `148-DEFINITION-PACK-IAM-2.28-CONTROLLED-ONBOARDING-DRAFT.md`, aprovada pelo checkpoint 147.

Foram consultados Constitution, V2 Scope, ADR-027, ADR-033, Construction Protocol, Current Scope, Source Recovery e Definition Pack 145. A decisão fonte recuperada é a preferência do owner por acesso simples por e-mail/código e provedores sociais, sem burocracia, reconciliada com a proibição de cadastro público e vínculo automático.

## Escopo deste BUILD

- criar schema privado-operacional para matrícula e trilha de auditoria;
- criar contratos tipados e validados para matrícula/provisionamento, sem segredo em cliente;
- criar um adaptador server-side não exposto para executar provisionamento apenas quando uma operação interna futura fornecer credenciais gerenciadas;
- manter a interface atual honesta: magic link não será rebatizado como código enquanto o template do Supabase não for configurado;
- documentar variáveis e gates operacionais, sem configurá-los.

## Fora do escopo

- criar usuário, convite ou membership real;
- chamar Supabase Admin, enviar e-mail, mudar template OTP, habilitar cadastro, Google ou GitHub;
- adicionar API pública, backoffice, RBAC, MFA, SSO, IA ou mudanças de Terms;
- migrar, aplicar banco remoto ou promover produção.

## Arquivos previstos

- migration `20260812212826_iam_2_28_controlled_onboarding.sql`;
- `src/modules/identity-access/domain/onboarding.*`;
- `src/modules/identity-access/onboarding-service.ts`;
- `src/modules/identity-access/onboarding-service.test.ts`;
- `.env.*.example`, Scope, Pre/Post-Flight e matriz de rastreabilidade.

## Dados, segurança e riscos

- Dados mínimos: organização, e-mail normalizado, papel permitido, estado, expiração e metadados de auditoria sem conteúdo sensível.
- As tabelas não são expostas a `anon`/`authenticated`; RLS fica ativo e grants são explicitamente revogados.
- O adaptador recebe uma porta administrativa injetada. Ele não lê `service_role`, não cria rota pública e não pode ser chamado pelo TutorIA.
- Risco residual: os passos operacionais de e-mail OTP/provedor exigirão segredo e mudança de ambiente; estão separados deste BUILD e exigem novo gate.

## Verificação planejada

- testes unitários para normalização, expiração, idempotência e recusa de matrícula inválida;
- revisão de SQL/RLS/grants e Security Advisor antes de aplicar remotamente;
- lint, typecheck, testes e build no commit;
- nenhuma alteração externa até Pre-Release Review próprio.
