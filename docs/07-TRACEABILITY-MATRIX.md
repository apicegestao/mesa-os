# Traceability Matrix

| Backlog | Requisito | Implementação | Verificação |
|---|---|---|---|
| GOV-2.17D | Alignment Check | `docs/70-ALIGNMENT-CHECK-GOV-2.17D.md` | fontes, autoridades e conflitos revisados |
| GOV-2.17D | Definition Pack integrado | `docs/71-DEFINITION-PACK-RT-2.18-DRAFT.md` | escopo, segurança, testes e rollback explícitos |
| GOV-2.16R | Baseline histórica oficial | `docs/64-CHANGE-REQUEST-PRODUCT-SOURCE-BASELINE.md`, `docs/65-APPROVED-PRODUCT-SOURCE-REGISTER.md` | aprovação explícita do owner + identificação estável |
| GOV-2.16R | Inventário de decisões | `docs/63-SOURCE-RECOVERY-MESA-OS-V2.md` | comparação com conversa fonte |
| GOV-2.16R | Matriz de reconciliação | `docs/66-SOURCE-TO-GOVERNANCE-MATRIX.md` | cobertura por domínio e status |
| GOV-2.16R | Autoridade e protocolo | `docs/00-CONSTITUTION.md`, `docs/09-CONSTRUCTION-PROTOCOL.md`, `docs/08-ADR-DECISION-LOG.md` | revisão de hierarquia e Change Request |
| GOV-2.16R | Direção de produto e UX | `docs/01-BLUEPRINT.md`, `docs/02-V2-SCOPE.md`, `docs/05-UX-ARCHITECTURE.md` | centralidade do TutorIA e fontes preservadas |
| GOV-2.16R | Arquitetura canônica TutorIA | `docs/67-TUTORIA-CANONICAL-ARCHITECTURE.md` | cobertura de contexto, memória, knowledge, policies, tools, actions e canais |
| GOV-2.16R | Metodologia 4 × 4 | `docs/68-METHODOLOGY-4X4-RECONCILIATION.md` | correspondências, divergências e decisões abertas explícitas |
| GOV-2.16R | Controle operacional | `docs/03-ROADMAP.md`, `docs/06-BACKLOG-MASTER.md`, `docs/10-CURRENT-SCOPE.md` | documentação-only; nenhum BUILD |
| GOV-2.1R | Bootstrap web | `src/app`, configuração Next/TS | lint, typecheck, build |
| GOV-2.1R | Modular monolith | `src/modules`, `modules/README.md` | revisão estrutural |
| GOV-2.1R | Database foundation | `supabase/config.toml`, `supabase/migrations` | migration review / pgTAP quando DB local disponível |
| GOV-2.1R | Design System foundation | `src/app/styles.css` | teste de componente e build |
| GOV-2.1R | Observabilidade | `src/shared/observability` | teste unitário |
| GOV-2.1R | Secret safety | `.gitignore`, `.env.*.example`, env schema | secret scan manual e build |
| GOV-2.1R | CI | `.github/workflows/ci.yml` | configuração revisada |
| GOV-2.2D | Alignment e escopo | `docs/15-PRE-FLIGHT-2.2D.md`, `docs/16-FEATURE-SPEC-IAM-2.3-DRAFT.md` | revisão documental |
| GOV-2.2D | Governança atualizada | `docs/03-ROADMAP.md`, `docs/06-BACKLOG-MASTER.md`, `docs/10-CURRENT-SCOPE.md` | consistência entre documentos |
| GOV-2.2D | Encerramento | `docs/17-POST-FLIGHT-2.2D.md` | decisões pendentes registradas |
| IAM-2.3 | Schema e isolamento | `supabase/migrations/20260811120405_identity_access_foundation.sql` | revisão SQL + pgTAP preparado |
| IAM-2.3 | Magic link sem cadastro | `src/modules/identity-access` | testes unitários + build |
| IAM-2.3 | Sessão SSR/PKCE | `src/proxy.ts`, `src/shared/infrastructure/supabase`, `src/app/auth/callback` | typecheck + build |
| IAM-2.3 | Shell protegido e logout | `src/app/app`, `src/app/login` | lint + typecheck + build |
| IAM-2.3 | Encerramento | `docs/19-POST-FLIGHT-IAM-2.3.md` | Post-Flight review |
| IAM-2.28 | Matrícula controlada | `supabase/migrations/20260812212826_iam_2_28_controlled_onboarding.sql` | revisão SQL, RLS e grants antes de aplicação |
| IAM-2.28 | Provisionamento por contrato | `src/modules/identity-access/onboarding-service.ts` | testes unitários de autorização, expiração e negação |
| IAM-2.28 | Decisão auditável | `src/modules/identity-access/domain/onboarding.ts` | testes unitários |
| GOV-2.4D | Alignment e Pre-Flight | `docs/20-PRE-FLIGHT-2.4D.md` | revisão documental |
| GOV-2.4D | Proposta Diagnostic Foundation | `docs/21-FEATURE-SPEC-DIA-2.5-DRAFT.md` | decisões pendentes explícitas |
| GOV-2.4D | Governança atualizada | `docs/03-ROADMAP.md`, `docs/06-BACKLOG-MASTER.md`, `docs/10-CURRENT-SCOPE.md` | consistência entre documentos |
| GOV-2.4D | Encerramento | `docs/22-POST-FLIGHT-2.4D.md` | Post-Flight review |
| DIA-2.5 | Fonte metodológica candidata | `docs/23-SOURCE-ANALYSIS-RAIO-X.md` | comparação com Feature Spec e guardrails |
| DIA-2.5 | Definição e execução versionadas | `supabase/migrations/20260811132443_diagnostic_foundation.sql` | seed remoto + teste transacional |
| DIA-2.5 | Índices e correção de cálculo | `supabase/migrations/20260811133405_index_diagnostic_foreign_keys.sql`, `supabase/migrations/20260811133531_fix_diagnostic_score_ambiguity.sql` | advisors + IME 60 controlado |
| DIA-2.5 | Regras de domínio | `src/modules/diagnostic/domain` | Vitest |
| DIA-2.5 | Persistência e ações | `src/modules/diagnostic/data`, `src/modules/diagnostic/actions` | typecheck + teste transacional remoto |
| DIA-2.5 | Experiência Mês 0 | `src/modules/diagnostic/ui`, `src/app/app/page.tsx` | testes de componente + build |
| DIA-2.5 | Encerramento | `docs/25-POST-FLIGHT-DIA-2.5.md` | Post-Flight review |
| GOV-2.6D | Alignment e Pre-Flight | `docs/26-PRE-FLIGHT-2.6D.md` | revisão documental |
| GOV-2.6D | Proposta Priority Foundation | `docs/27-FEATURE-SPEC-PRI-2.7-DRAFT.md` | decisões pendentes explícitas |
| GOV-2.6D | Governança atualizada | `docs/03-ROADMAP.md`, `docs/06-BACKLOG-MASTER.md`, `docs/10-CURRENT-SCOPE.md` | consistência entre documentos |
| GOV-2.6D | Encerramento | `docs/28-POST-FLIGHT-2.6D.md` | Post-Flight review |
| PRI-2.7 | Prioridade e confirmação transacional | `supabase/migrations/20260811135526_priority_foundation.sql` | teste remoto com rollback |
| PRI-2.7 | Regra de candidato e empate | `src/modules/priority/domain` | Vitest |
| PRI-2.7 | Experiência e persistência | `src/modules/priority`, `src/app/app/page.tsx` | typecheck + build |
| PRI-2.7 | Encerramento | `docs/30-POST-FLIGHT-PRI-2.7.md` | Post-Flight review |
| GOV-2.8D | Alignment e Pre-Flight | `docs/31-PRE-FLIGHT-2.8D.md` | revisão documental |
| GOV-2.8D | Proposta Cycle Foundation | `docs/32-FEATURE-SPEC-CYC-2.9-DRAFT.md` | decisões pendentes explícitas |
| GOV-2.8D | Encerramento | `docs/33-POST-FLIGHT-2.8D.md` | Post-Flight review |
| CYC-2.9 | Schema, unicidade e isolamento | `supabase/migrations/20260811141017_cycle_foundation.sql` | pgTAP + advisors |
| CYC-2.9 | Início transacional owner-only | `public.start_cycle(uuid)` | teste remoto com rollback |
| CYC-2.9 | Experiência do ciclo | `src/modules/cycle`, `src/app/app/page.tsx` | lint + typecheck + testes + build |
| CYC-2.9 | Governança e encerramento | `docs/34-PRE-FLIGHT-CYC-2.9.md`, `docs/35-POST-FLIGHT-CYC-2.9.md` | revisão documental |
| GOV-2.10D | Homologação do ciclo | `docs/35-POST-FLIGHT-CYC-2.9.md` | smoke test aceito pelo owner |
| GOV-2.10D | Alignment e Pre-Flight | `docs/36-PRE-FLIGHT-2.10D.md` | revisão documental |
| GOV-2.10D | Proposta Mission Foundation | `docs/37-FEATURE-SPEC-MIS-2.11-DRAFT.md` | decisões pendentes explícitas |
| GOV-2.10D | Encerramento | `docs/38-POST-FLIGHT-2.10D.md` | Post-Flight review |
| MIS-2.11 | Metodologia versionada e instâncias | `supabase/migrations/20260811143052_mission_foundation.sql` | pgTAP + seed review |
| MIS-2.11 | Provisionamento owner-only | `public.provision_cycle_missions(uuid)` | teste transacional / smoke test |
| MIS-2.11 | Próxima Missão sem conteúdo bloqueado | `src/modules/mission`, `src/app/app/page.tsx` | Vitest + typecheck + build |
| MIS-2.11 | Encerramento | `docs/39-PRE-FLIGHT-MIS-2.11.md`, `docs/40-POST-FLIGHT-MIS-2.11.md` | Post-Flight review |
| GOV-2.12D | Homologação de Missão | `docs/40-POST-FLIGHT-MIS-2.11.md` | smoke test aceito pelo owner |
| GOV-2.12D | Alignment e Pre-Flight | `docs/41-PRE-FLIGHT-2.12D.md` | revisão documental |
| GOV-2.12D | Proposta Structured Tool | `docs/42-FEATURE-SPEC-TOL-2.13-DRAFT.md` | decisões pendentes explícitas |
| GOV-2.12D | Encerramento | `docs/43-POST-FLIGHT-2.12D.md` | Post-Flight review |
| TOL-2.13 | Schema e rascunho versionados | `supabase/migrations/20260811144739_structured_tool_foundation.sql` | pgTAP + seed review |
| TOL-2.13 | Validação e persistência owner-only | `public.save_mission_tool_draft(uuid,jsonb)` | payload válido/inválido com rollback |
| TOL-2.13 | Renderização schema-driven | `src/modules/structured-tool`, `src/app/app/page.tsx` | Vitest + typecheck + build |
| TOL-2.13 | Encerramento | `docs/44-PRE-FLIGHT-TOL-2.13.md`, `docs/45-POST-FLIGHT-TOL-2.13.md` | Post-Flight review |
| GOV-2.14F | Protocolo Fast Track | `docs/09-CONSTRUCTION-PROTOCOL.md`, `docs/46-GOVERNANCE-FAST-TRACK-V1.1.md` | revisão de autoridade |
| GOV-2.14F | Deploy documental ignorado | `netlify.toml` | configuração revisada + deploy inicial único |
| GOV-2.14F | Fluxo cloud-first | branch `agent/governance-fast-track`, Pull Request e GitHub Actions | CI do PR |
| RT-2.15 | Alignment Check integrado | `docs/48-ALIGNMENT-CHECK-RT-2.15.md` | revisão de autoridade |
| IMP-2.15A | Definição de Implementação | `docs/49-FEATURE-SPEC-IMP-2.15A.md` | critérios e testes propostos |
| EVD-2.15B | Definição de Evidência | `docs/50-FEATURE-SPEC-EVD-2.15B.md` | critérios e testes propostos |
| MTR-2.15C | Definição de transição | `docs/51-FEATURE-SPEC-MTR-2.15C.md` | invariantes transacionais |
| STA-2.15D | Definição de estado | `docs/52-FEATURE-SPEC-STA-2.15D.md` | matriz de próxima ação |
| RT-2.15 | Definition Pack | `docs/53-DEFINITION-PACK-RT-2.15.md` | aprovação explícita única |
| RT-2.15 | Pre-Flight integrado | `docs/54-PRE-FLIGHT-RT-2.15.md` | GO para BUILD controlado |
| IMP-2.15A | Implementação confirmável e Ferramenta congelada | `20260811160001_implementation_foundation.sql`, `src/modules/core-loop` | Vitest + pgTAP + transação |
| EVD-2.15B | Evidência operacional imutável | `20260811160002_evidence_foundation.sql`, `src/modules/core-loop` | Vitest + pgTAP + RLS |
| MTR-2.15C | Conclusão e desbloqueio atômicos | `20260811160003_mission_transition.sql` | pgTAP + rollback + idempotência |
| STA-2.15D | Próxima ação derivada | `src/modules/core-loop`, `src/app/app/page.tsx` | Vitest + typecheck + build |
| RT-2.15 | Encerramento | `docs/56-POST-FLIGHT-RT-2.15.md` | CI + advisors + deploy + smoke |
