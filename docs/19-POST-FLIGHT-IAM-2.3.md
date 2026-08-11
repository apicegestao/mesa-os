# Post-Flight — IAM-2.3 Identity & Access Foundation

**Backlog:** IAM-2.3  
**Status:** RELEASE IN PROGRESS
**Data:** 2026-08-11

## Implementado

- Decisões IAM aprovadas e registradas no ADR-027.
- Módulo `identity-access` com limites próprios.
- Solicitação de magic link sem criação automática de usuário e resposta não enumerável.
- Callback PKCE com proteção contra redirecionamento externo.
- Renovação de sessão no Proxy do Next.js com headers contra cache de cookies.
- Rota autenticada dinâmica, vínculo organizacional obrigatório e logout.
- Schema mínimo de identidades, organizações, vínculos e convites.
- Papéis `owner` e `member`, uma organização por identidade e convite com validade padrão de 72 horas.
- Grants explícitos, RLS, índices e funções auxiliares privadas.
- URL pública de produção declarada no contexto do Netlify.
- Baseline e migrations IAM aplicadas ao Supabase de produção.
- Site URL, callback exato e bloqueio de cadastro público configurados.
- Rafael provisionado como `owner` da organização Grupo Ápice e convite enviado.
- Tipos TypeScript regenerados a partir do schema remoto.

## Deliberadamente não implementado

- Cadastro público, senha, login social, MFA e SSO.
- Interface completa de administração de membros.
- Múltiplas organizações por identidade.
- Qualquer feature ou dado metodológico/de negócio.

## Verificação

- ESLint: aprovado, zero warnings.
- TypeScript e geração de rotas tipadas: aprovados.
- Vitest: 3 arquivos, 4 testes aprovados.
- Next.js production build: aprovado.
- Rotas: `/`, `/login`, `/auth/callback` e `/app`; Proxy reconhecido.
- pgTAP estrutural preparado para quatro tabelas e RLS; execução depende de banco local/remoto autorizado.

## Migration

`20260811120405_identity_access_foundation.sql` e `20260811123109_index_invitation_inviter.sql` foram criadas pela Supabase CLI 2.113.0 e aplicadas remotamente após o baseline.

## Limitações operacionais

- Staging requer projeto Supabase dedicado.
- A aceitação do convite depende da ação do destinatário no e-mail recebido.

## Proposals

Nenhuma feature adicional. A interface completa de convites permanece fora do escopo.

## Próximo gate permitido

Release operacional do IAM-2.3: revisar/aplicar migration no Supabase, executar advisors e testes de isolamento, configurar Auth URLs, provisionar o primeiro `owner`, publicar e executar smoke/E2E sem ampliar o escopo.
