# Pre-Flight — IAM-2.3 Identity & Access Foundation

**Backlog:** IAM-2.3  
**Mode:** BUILD  
**Data:** 2026-08-11

## Alignment Check

- GOV-2.1R e GOV-2.2D estão concluídos.
- A Feature Spec IAM-2.3 foi aprovada com decisões explícitas.
- O incremento respeita o monólito modular, Supabase/PostgreSQL e os guardrails de UX e segurança.
- Nenhuma capacidade metodológica ou de negócio será antecipada.

## Autoridades consultadas

`00-CONSTITUTION.md`, `01-BLUEPRINT.md`, `02-V2-SCOPE.md`, `04-TECHNICAL-ARCHITECTURE.md`, `05-UX-ARCHITECTURE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md`, `10-CURRENT-SCOPE.md`, `13-SECURITY.md` e `16-FEATURE-SPEC-IAM-2.3-DRAFT.md`.

## Escopo

- Módulo coeso de identidade e acesso.
- Magic link somente para convite válido.
- Callback e renovação de sessão SSR/PKCE.
- Organização, identidade interna, vínculo e convite mínimos.
- RLS e isolamento organizacional.
- Shell protegido neutro e logout.
- Testes e documentação.

## Fora do escopo

- Capacidades de negócio, perfis empresariais e metodologia.
- Cadastro público, senha, social login, MFA e SSO.
- Múltiplas organizações por identidade.
- Gestão completa de membros.
- Aplicação remota de migrations neste gate.

## Arquivos previstos

- `src/modules/identity-access/**`
- rotas públicas e protegidas em `src/app/**`
- atualização da infraestrutura Supabase SSR
- middleware/proxy de renovação de sessão
- migration e testes em `supabase/**`
- documentação canônica e operacional

## Migrations

Uma migration aditiva, criada pela Supabase CLI, para tipos, tabelas, índices, constraints, grants, RLS e funções auxiliares estritamente necessárias.

## Riscos

- Enumeração de e-mails.
- Criação indevida de conta sem convite.
- BOLA/IDOR entre organizações.
- Cookies de sessão não renovados no SSR.
- Vazamento de tokens ou detalhes de autenticação em logs.
- Configuração remota de URLs/templates incompatível com SSR.

## Testes

- Unidade para validação e respostas não enumeráveis.
- Componentes e server actions com adapters controlados.
- Banco/RLS para isolamento e restrições.
- Rotas de callback, proteção e logout.
- Lint, typecheck, Vitest e build.

## Conflitos

Nenhum conflito identificado. A migration remota e a configuração do Auth exigirão Post-Flight verde e autorização operacional posterior.
