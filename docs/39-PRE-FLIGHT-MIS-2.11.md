# Pre-Flight — MIS-2.11 Mission Foundation

**Data:** 2026-08-11
**Modo:** BUILD
**Status:** GO

## Alignment Check

- CYC-2.9 foi publicado e homologado com ciclo ativo real.
- GOV-2.10D foi concluído e suas oito decisões foram aprovadas.
- O owner autorizou a recomendação conservadora para a metodologia inicial.
- Missão é o próximo passo do core loop; Ferramenta e Implementação continuam posteriores.

## Escopo

- Definição versionada com três Missões para `Liderança & Equipe`.
- Instâncias imutáveis ligadas ao ciclo e organização.
- Primeira Missão disponível e duas bloqueadas.
- Provisionamento explícito owner-only e interface da próxima ação.
- RLS, grants mínimos, testes, migration e documentação.

## Fora do escopo

- Concluir, desbloquear, editar, pular, substituir ou reordenar Missões.
- Checklist, tarefa, Ferramenta, Implementação, Evidência ou Evolução.
- TutorIA, IA, notificações, WhatsApp ou colaboração por `member`.
- Conteúdo para outras dimensões.

## Arquivos previstos

- Migration e pgTAP em `supabase/`.
- Tipos Supabase em `src/shared/infrastructure/supabase/`.
- Módulo `src/modules/mission/` e composição em `src/app/app/page.tsx`.
- Feature Spec, Current Scope, ADR, rastreabilidade e Post-Flight.

## Riscos e controles

- Conteúdo virar constante de UI: armazenar como dados versionados.
- Vazamento entre organizações: RLS owner-only e filtro por ciclo.
- Múltiplas próximas ações: índice único parcial por ciclo.
- Provisionamento duplicado: constraints e operação idempotente.
- Avanço falso: nenhum estado de conclusão ou progresso.

## Testes

- Constraints, RLS, função e seed por pgTAP.
- Provisionamento remoto autenticado com rollback.
- Lint, typecheck, Vitest e build.
- Advisors de segurança e desempenho após migration.

## Go / No-Go

**GO** para MIS-2.11 dentro deste recorte. **NO-GO** para qualquer etapa posterior do core loop.
