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

## GOV-2.6D — Priority Foundation Definition & Alignment

**Status:** COMPLETE

### Entregáveis autorizados

- Alignment Check após a homologação do DIA-2.5.
- Pre-Flight documental do segundo passo do core loop.
- Feature Spec preliminar para PRI-2.7 — Priority Foundation.
- Registro das regras e decisões pendentes.
- Atualização de roadmap, backlog, rastreabilidade e Current Scope.
- Post-Flight documental.

### Restrições

- Nenhum código, migration, configuração externa ou deploy funcional.
- Nenhuma prioridade criada automaticamente.
- Nenhum Ciclo, Missão, Ferramenta ou recomendação de execução.
- PRI-2.7 não está autorizado para BUILD até aprovação explícita.

## PRI-2.7 — Priority Foundation

**Status:** COMPLETE — PRODUCTION RELEASED

Objetivo proposto: transformar um diagnóstico concluído em uma única prioridade organizacional confirmada pelo owner, rastreável à dimensão e à execução de origem, sem antecipar Ciclo ou Missão.

## GOV-2.8D — Cycle Foundation Definition & Alignment

**Status:** COMPLETE

### Entregáveis autorizados

- Homologação documental do PRI-2.7.
- Alignment Check e Pre-Flight de Cycle Foundation.
- Feature Spec preliminar CYC-2.9.
- Decisões pendentes sobre duração, estados, permissões e encerramento.
- Atualização de governança e Post-Flight.

### Restrições

- Nenhum código, migration ou configuração externa.
- Nenhuma Missão, meta operacional, ferramenta ou evidência.
- CYC-2.9 não autorizado para BUILD até aprovação explícita.

## CYC-2.9 — Cycle Foundation

**Status:** COMPLETE — PRODUCTION RELEASED

Objetivo: criar um período operacional de 90 dias, único e rastreável para a prioridade ativa, sem antecipar Missões, metas, tarefas ou progresso.

## GOV-2.10D — Mission Foundation Definition & Alignment

**Status:** COMPLETE

### Entregáveis autorizados

- Homologação documental do CYC-2.9.
- Alignment Check e Pre-Flight da Mission Foundation.
- Feature Spec preliminar MIS-2.11.
- Decisões pendentes sobre origem, quantidade, estrutura, estados, ordem, permissões e conclusão.
- Atualização de governança e Post-Flight documental.

### Restrições

- Nenhum código, migration, configuração externa ou deploy funcional.
- Nenhuma Missão real, Ferramenta, Implementação, Evidência ou Evolução.
- Nenhum TutorIA ou geração por IA.
- MIS-2.11 não autorizado para BUILD até aprovação explícita.

## MIS-2.11 — Mission Foundation

**Status:** BUILD IN PROGRESS

Objetivo proposto: representar o trabalho orientado do ciclo por meio de Missões estruturadas e rastreáveis, sem antecipar a ferramenta metodológica ou a comprovação da implementação.
