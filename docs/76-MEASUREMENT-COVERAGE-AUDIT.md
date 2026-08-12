# Measurement Coverage Audit — Member Experience

**Status:** COMPLETE — GAPS IDENTIFIED  
**Date:** 2026-08-11  
**Scope:** Hoje, Jornada, Diagnósticos, Evidências e Evolução  
**Sources:** Governance Pack v1.0; ADR-028, ADR-030, ADR-034, ADR-035; conversa canônica `Mesa OS V2`; protótipo visual aprovado.

## Executive conclusion

The approved interface is a valid product projection, but the current production baseline does not yet provide a longitudinal measurement backbone capable of supporting every displayed card across T1, T2 and subsequent cycles.

No UI value may be presented as real unless it is backed by a canonical fact, a reproducible derivation or an explicitly labeled empty/projected state. The current release must not invent approvals, impact, current maturity or historical cycles.

## Coverage by screen

| Screen / card | Current source | Coverage | Required completion |
|---|---|---:|---|
| Hoje — current cycle | `cycles`, `priorities` | Partial | cycle sequence, lifecycle and historical cycles |
| Hoje — cycle result | priority and mission snapshots | Partial | explicit outcome, baseline, target and observed indicators |
| Hoje — priority actions | derived core-loop state | Partial | query all cycle missions and a stable action projection |
| Hoje — pulse | initial diagnostic/core-loop facts | Partial | versioned pulse observations and cycle indicators |
| Hoje — Lula direction | none canonical | Missing | contextual recommendation record with source, validity and content link |
| Jornada — quarterly path | current cycle only | Missing longitudinally | multiple ordered cycles without overwriting history |
| Jornada — deliveries | missions, implementations, evidence | Partial | aggregate every mission in the selected cycle, including completed missions |
| Diagnósticos — entry | versioned M0 execution | Covered | preserve as frozen baseline |
| Diagnósticos — reanalysis timeline | M0 only | Missing | entry, quarterly and exit diagnostic episodes |
| Evidências — submitted | `mission_evidence` | Partial | aggregate all evidence in cycle/history; current loader is mission-scoped |
| Evidências — approved/review/correction | no review lifecycle | Missing | append-only review and revision history |
| Evolução — entry IME | completed M0 result | Covered | preserve formula revision and provenance |
| Evolução — current IME and delta | no reanalysis | Missing | comparable diagnostic snapshot under versioned calculation |
| Evolução — maturity by pillar | M0 only | Partial | comparable baseline/current observations per methodology revision |
| Evolução — owner hours / decision concentration | no metric observations | Missing | typed indicators with unit, source, confidence and effective date |
| Evolução — proven milestones | evidence is not approval or impact | Missing | approved evidence plus explicit impact association |
| Evolução — annual history | one active cycle constraint | Missing | immutable multi-cycle snapshots and all-time projection |

## Current structural blockers

1. `priorities` permits only one priority per organization.
2. `cycles` permits only one cycle per organization and only the `active` state.
3. Diagnostic revisions and executions accept only `m0`.
4. Evidence is one immutable submission per mission, without review, correction or approval history.
5. The current member workspace loads evidence through the currently available mission; completed-mission evidence can therefore be omitted from screen totals.
6. There is no canonical definition/observation model for business and impact indicators.

## Measurement invariants

Every measured fact must retain:

- organization and member journey scope;
- methodology and calculation revision;
- cycle identifier and ordinal (`T1`, `T2`, ...), when applicable;
- metric definition, unit and desired direction;
- value and effective observation time;
- source type and source record;
- provenance level: declared, evidenced, validated or integrated;
- confidence/validation status when applicable;
- actor/system origin and immutable audit time.

Historical facts are append-only. A methodology or formula change creates a new revision and never rewrites an earlier result. Cards must explicitly query either a selected cycle or all-time history; no card may silently assume “current cycle only”.

## Adaptability contract

- Cycle labels are derived from persisted sequence, never hard-coded to T1.
- Lists accept zero to many records and expose pagination/continuation when volume grows.
- Totals are derived from canonical records, not stored as duplicated counters.
- Baseline/current comparisons require compatible definitions; incompatible revisions are labeled and never silently compared.
- Empty, pending, projected and measured states are visually distinct.
- A future date or target is not presented as an achieved measurement.
- Evidence, approval, transformation and impact remain different domain facts.
- Every projection is covered by organization isolation, server-side authorization and regression tests.

## Safe migration principle

Existing data will be preserved. The current cycle becomes sequence 1/T1; M0 becomes the entry baseline; existing evidence remains registered evidence and is never promoted to approved evidence automatically. No impact, approval, current score or target will be inferred during backfill.

## Governance result

This audit does not authorize database or business-rule changes. Those changes require the Definition Pack in `77-DEFINITION-PACK-RT-2.20-MEASUREMENT-BACKBONE-DRAFT.md` and explicit owner approval.
