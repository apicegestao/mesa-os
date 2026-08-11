# Post-Flight — Sprint 2.1R Clean Bootstrap

**Backlog:** GOV-2.1R  
**Status:** COMPLETE  
**Data:** 2026-08-11

## Implementado

- Aplicação greenfield Next.js/React + TypeScript strict.
- Limite inicial de monólito modular e interface pública do módulo foundation.
- Design System foundation com tokens CSS e shell neutro.
- Supabase SSR clients, configuração local e migration baseline versionada.
- Configuração de development, staging e production sem secrets reais.
- Logging JSON básico com nível configurável.
- Headers de segurança em Next.js e Netlify.
- Lint, typecheck, testes, build e CI.
- Governance Pack e documentação operacional em `/docs`.
- Lockfile com versões fixadas.
- Repositório Git inicializado na branch `main`.

## Deliberadamente não implementado

Journey, TutorIA, Tools, Concierge, WhatsApp, dashboards de negócio, AI Tool Factory, white label, autenticação completa, RBAC, entidades e regras de negócio.

## Verificação

- ESLint: aprovado, zero warnings.
- TypeScript: aprovado.
- Vitest: 2 arquivos, 2 testes aprovados.
- Next.js production build: aprovado; rota `/` estática.
- Peer dependencies: nenhum conflito após pin de versões compatíveis.

## Migrations

`20260811000000_bootstrap_foundation.sql` cria apenas o schema privado de infraestrutura e revoga acesso público. Não foi aplicada ao Supabase de produção; aplicação remota depende do fluxo de release/migration autorizado.

## Dívida técnica / limitações operacionais

- O commit inicial aguarda uma identidade Git (`user.name` e `user.email`) configurada; nenhuma identidade foi inventada pelo agente.
- Teste pgTAP está preparado, mas não executado porque a Supabase CLI/Docker local não estão disponíveis no runtime.
- Staging requer um projeto Supabase dedicado antes de armazenar dados persistentes.
- O artefato original do Governance Pack não foi sincronizado em `sources/`; os documentos foram materializados a partir das decisões e regras recuperadas da conversa de origem e do escopo explícito deste sprint.

## Proposals

Nenhuma. O sprint não revelou necessidade de alteração de produto.

## Traceability

GOV-2.1R → documentação + configuração + código foundation + migration → lint/typecheck/test/build.
