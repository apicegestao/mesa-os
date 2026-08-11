# Backlog Master

## GOV-2.1R — Clean Bootstrap

**Status:** COMPLETE

### Entregáveis autorizados

- Bootstrap de repositório.
- Next.js, React e TypeScript.
- Monólito modular foundation.
- PostgreSQL/Supabase via migrations.
- Ambientes separados.
- Lint, typecheck, testes, build e CI.
- Design System foundation.
- Observabilidade/logging básica.
- Segurança de secrets.
- Documentação canônica.

Nenhum item de negócio está autorizado neste sprint.

## GOV-2.2D — Definition & Alignment

**Status:** COMPLETE

### Entregáveis autorizados

- Alignment Check do primeiro incremento pós-bootstrap.
- Pre-Flight documental.
- Feature Spec preliminar para Identity & Access Foundation.
- Registro explícito de decisões pendentes.
- Atualização de roadmap, backlog, rastreabilidade e Current Scope.
- Post-Flight documental.

### Restrições

- Nenhum código, migration ou configuração externa.
- Nenhuma regra de papéis, convite ou cadastro presumida.
- A proposta IAM-2.3 não está autorizada para BUILD até aprovação explícita.

## IAM-2.3 — Identity & Access Foundation

**Status:** COMPLETE

Objetivo: estabelecer autenticação por magic link, sessão segura e vínculo organizacional mínimo como pré-requisito para capacidades posteriores. A autorização limita-se ao escopo aprovado na Feature Spec e no Current Scope.

## GOV-2.4D — Diagnostic Foundation Definition & Alignment

**Status:** COMPLETE

### Entregáveis autorizados

- Alignment Check após o encerramento do IAM-2.3.
- Correção da divergência documental sobre o release do IAM.
- Pre-Flight documental do primeiro domínio do core loop.
- Feature Spec preliminar para DIA-2.5 — Diagnostic Foundation.
- Registro explícito das decisões de produto pendentes.
- Atualização de roadmap, backlog, rastreabilidade e Current Scope.
- Post-Flight documental.

### Restrições

- Nenhum código, migration ou configuração externa.
- Nenhum questionário, dimensão, cálculo, score ou recomendação presumidos.
- DIA-2.5 não está autorizado para BUILD até aprovação explícita.

## DIA-2.5 — Diagnostic Foundation

**Status:** COMPLETE — PRODUCTION RELEASED

Objetivo proposto: permitir que um membro autorizado execute o primeiro passo do core loop por meio de uma definição metodológica versionada, produzindo um resultado rastreável sem antecipar Prioridade ou qualquer etapa posterior.
