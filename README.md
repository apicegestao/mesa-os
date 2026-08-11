# Mesa OS

Aplicação greenfield do Mesa OS V2, iniciada no Sprint 2.1R — Clean Bootstrap sob o Governance Pack v1.0.

## Requisitos

- Node.js 22+
- pnpm 11.16.0

## Uso local

1. Copie `.env.example` para `.env.local`.
2. Substitua a publishable key do Supabase.
3. Execute `pnpm install` e `pnpm dev`.

## Quality gate

`pnpm check` executa lint, typecheck, testes e build.

## Autoridade

Leia primeiro `docs/00-CONSTITUTION.md`, `docs/02-V2-SCOPE.md`, `docs/08-ADR-DECISION-LOG.md`, `docs/09-CONSTRUCTION-PROTOCOL.md` e `docs/10-CURRENT-SCOPE.md`. Nenhuma feature de negócio está autorizada neste sprint.
