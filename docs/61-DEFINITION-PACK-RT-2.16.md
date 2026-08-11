# Definition Pack — RT-2.16 Management Rhythm

**Status:** PROPOSED — AWAITING SINGLE APPROVAL
**Owner:** Rafael Portela Martins
**Data:** 2026-08-11

## Resultado homologável

Na Missão 2, o owner estrutura seus rituais de gestão, confirma a aplicação, registra Evidência e libera transacionalmente a Missão 3.

## Incrementos

| Ordem | Incremento | Entrega |
|---|---|---|
| 1 | SCH-2.16A | Validador verdadeiramente schema-driven |
| 2 | TOL-2.16B | Ferramenta Ritmo de Gestão da Equipe |
| 3 | OPS-2.16C | Reuso do core loop e transição para Missão 3 |

## Decisões para aprovação única

1. Generalizar a função existente; não criar validador específico por Ferramenta.
2. Suportar somente `repeatable_object` e strings `input`/`textarea` neste train.
3. Aprovar a Ferramenta com 1–12 rituais e os seis campos definidos na spec.
4. Manter salvamento explícito, reordenação e congelamento após Implementação.
5. Reutilizar sem alteração semântica Implementação, Evidência e transição.
6. Liberar a Missão 3, sem antecipar sua Ferramenta ou conclusão do ciclo.
7. Um branch, migrations aditivas, CI, um merge e um deploy.

## Segurança

Owner-only, RLS, grants mínimos, schema publicado, validação server-side, payload máximo, imutabilidade, idempotência, advisors e secret scan.

## Fora do train

TutorIA, Evolução, calendário, notificações, tarefas, anexos, member, Ferramenta da Missão 3, conclusão do ciclo e novo diagnóstico.

## Gate

A aprovação explícita única autoriza somente SCH-2.16A, TOL-2.16B e OPS-2.16C. Mudança material interrompe o train.
