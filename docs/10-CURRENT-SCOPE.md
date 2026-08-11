# Current Construction Scope

**Release:** V2.0  
**Sprint:** IAM-2.3 — Identity & Access Foundation
**Mode:** BUILD

## Authorized

- Magic link somente para identidades previamente convidadas.
- Sessão SSR/PKCE com Supabase Auth.
- Identidade interna, organização, vínculo e convite mínimos.
- Papéis `owner` e `member`, limitados à administração de acesso.
- Uma organização por identidade no primeiro release.
- Shell autenticado neutro, bloqueio por ausência de vínculo e logout.
- Migrations versionadas, RLS, grants explícitos e testes de isolamento.
- Observabilidade técnica sem tokens, secrets ou dados sensíveis.
- Documentação e Post-Flight do IAM-2.3.

## Not Authorized

- Journey ou jornada do membro.
- TutorIA.
- Tools ou ferramentas metodológicas.
- Concierge.
- WhatsApp.
- Dashboards de negócio.
- AI Tool Factory.
- White label.
- Cadastro público e criação automática de vínculo.
- Login por senha, login social, MFA e SSO empresarial.
- RBAC ou administração além de `owner` e `member` para acesso.
- Múltiplas organizações por identidade.
- Perfil empresarial e qualquer regra ou entidade metodológica.
- Journey, TutorIA, Tools, Concierge, WhatsApp, dashboards de negócio, AI Tool Factory e white label.
- Aplicação de migration remota ou alteração do Supabase/Netlify sem gate operacional específico.

## Exit criteria

Feature Spec aprovada; Pre-Flight registrado; schema e RLS versionados; magic link somente para convidados; sessão SSR e shell protegido; logout; testes de isolamento e fluxos relevantes; lint, typecheck, testes e build aprovados; Post-Flight entregue.
