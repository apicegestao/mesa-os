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
