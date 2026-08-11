# Pre-Flight — PRI-2.7 Priority Foundation

**Data:** 2026-08-11  
**Mode:** BUILD

## Alignment Check

- Diagnóstico concluído fornece resultado dimensional imutável.
- Priority Foundation é o segundo passo do core loop.
- Aprovação limita confirmação à única menor dimensão e bloqueia empates para futuro TutorIA.
- TutorIA, Ciclo e etapas posteriores permanecem fora do BUILD.

## Escopo

- Entidade de prioridade imutável vinculada ao diagnóstico e dimensão.
- Função transacional que recalcula a menor dimensão, rejeita empate e valida owner.
- Justificativa curta obrigatória, RLS, grants e testes.
- Estado de UI para confirmação, prioridade ativa e empate pendente.

## Fora do escopo

- TutorIA, provedor/modelo de IA, desempate, Ciclo, Missão, prazo, meta ou plano.
- Alterar ou excluir prioridade.

## Arquivos previstos

- Migration e pgTAP; módulo `priority`; integração na rota `/app`; tipos; governança e Post-Flight.

## Riscos e controles

- Score adulterado: função recalcula a partir do snapshot concluído.
- Dupla prioridade: unique constraint por organização.
- Empate indevido: função rejeita quando há mais de uma menor dimensão.
- Vazamento da justificativa: owner-only RLS e ausência em logs.

## Testes

- Candidato único, empate, confirmação, duplicidade, owner, RLS, lint, typecheck, Vitest e build.

## Migration

Uma migration aditiva, criada pela Supabase CLI, sem operação destrutiva.

## Conflitos

Nenhum após ADR-029.
