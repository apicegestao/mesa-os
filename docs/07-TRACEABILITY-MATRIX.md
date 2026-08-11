# Traceability Matrix

| Backlog | Requisito | Implementação | Verificação |
|---|---|---|---|
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
