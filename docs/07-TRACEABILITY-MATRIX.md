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
