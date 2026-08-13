# Definition Pack IAM-2.28B — Operação segura de onboarding

**Status:** APPROVED FOR BUILD — owner aprovou em 2026-08-12**

## Objetivo

Conectar a fundação IAM-2.28 a uma operação interna segura, sem exigir que o membro ajuste Supabase, espere magic link ou conheça a estrutura da Mesa dos Donos.

## Escopo proposto

1. Criar uma única operação administrativa restrita, sem interface de membro, para registrar matrícula e executar provisionamento auditado.
2. Configurar, por ambiente, o envio de código temporário por e-mail para identidade já provisionada; a aplicação usa resposta neutra e rate limit.
3. Criar smoke controlado com uma identidade de teste, em homologação dedicada, sem reutilizar identidade, sessão ou dados de produção.
4. Documentar a rotação de segredo, a revogação de matrícula e o rollback operacional.

## Fora do escopo

- cadastro público, autoatendimento de criação de organização, vínculo por conta Google/GitHub sem matrícula;
- painel interno de backoffice, RBAC adicional, MFA, SSO, WhatsApp e integrações de checkout;
- aplicação em produção antes de smoke, Advisor e autorização de promoção;
- exibir, registrar ou enviar segredos pelo chat, Git ou frontend.

## Controles obrigatórios

- credenciais administrativas são secrets de runtime por ambiente, com rotação documentada;
- a operação interna é autenticada fora da superfície do membro e limitada a allow-list de ação;
- provisionamento é idempotente, registra evento e desfaz identidade órfã quando possível;
- o código é de uso único, expira e recebe rate limit; a resposta não enumera e-mails;
- Google continua opcional e só entra por novo gate depois de credenciais, callback e smoke por ambiente.

## Critérios de aceite

1. Uma matrícula autorizada cria apenas a identidade e membership previstos.
2. Matrícula expirada, revogada ou usada não cria nem altera acesso.
3. A entrada por e-mail não cria usuários e não revela se o e-mail existe.
4. Logs de auditoria não contêm código, token, secret ou conteúdo sensível.
5. Homologação recebe smoke com identidade exclusiva; produção não é alterada.
6. Security Advisor, testes, lint, typecheck e build passam antes de promoção.

## Decisão necessária do owner

Aprovar este pack autoriza código operacional, configuração de segredo em homologação e criação de uma identidade de teste exclusiva. Não autoriza produção, Google ou cadastro público.
