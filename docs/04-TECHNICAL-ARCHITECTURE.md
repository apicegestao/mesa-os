# Arquitetura Técnica

## Decisões FROZEN

- Next.js + React + TypeScript strict.
- PostgreSQL via Supabase.
- Monólito modular como arquitetura inicial.
- Migrations versionadas e revisáveis.
- Ambientes development, staging e production separados.
- CI com lint, typecheck, testes e build.

## Limites

- `src/modules/<module>` contém capacidades coesas e expõe uma interface pública.
- Um módulo não importa detalhes internos de outro módulo.
- `src/shared` contém apenas infraestrutura transversal, configuração, Design System e observabilidade.
- Regras de negócio não pertencem a componentes de UI ou a `shared`.
- Integrações externas devem ficar atrás de adapters quando forem autorizadas.

## Banco

Toda alteração de schema nasce em migration versionada. Tabelas em schemas expostos exigem grants explícitos e RLS. Operações destrutivas requerem Change Request e estratégia de migração.
