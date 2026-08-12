# Definition Pack — RT-2.20 Measurement Backbone

**Status:** APPROVED FOR BUILD  
**Owner:** Rafael Portela Martins  
**Date:** 2026-08-11

**Explicit approval:** “Pode seguir”, registered by the owner on 2026-08-11, with the Development Map as the mandatory methodological backbone.

## Homologable outcome

Every member screen is driven by canonical, secure and longitudinal data. The member can move from T1 to T2 and later cycles without loss, overwrite or omission of diagnostic, delivery, evidence, indicator and evolution history.

The 4 × 4 Development Map shown in Jornada is persisted as versioned methodology and becomes the organizing spine from Raio-X through training, cycles, content, missions, tools, evidence, measurements and TutorIA context.

## Source alignment

This pack reconciles the approved product source with the current repository:

- the initial diagnostic is the frozen baseline;
- pulse checks and quarterly diagnostics generate dated observations/snapshots;
- IME is versioned, explainable, longitudinal and auditable;
- every metric has definition, unit, source, date, desired direction, validation and confidence;
- evidence is not synonymous with approval, transformation or impact;
- formula changes do not rewrite historical results;
- the Journey Engine derives the current state and next best action from canonical facts.

## Release increments

| Order | Increment | Delivery |
|---|---|---|
| 1 | MTH-2.20A | Versioned 4 × 4 methodology graph and resource bindings |
| 2 | CYC-2.20B | Temporal priority and multi-cycle lifecycle |
| 3 | DIA-2.20C | Entry, pulse, quarterly and exit diagnostic episodes |
| 4 | MET-2.20D | Versioned metric definitions and append-only observations |
| 5 | EVR-2.20E | Evidence review/version history without rewriting submissions |
| 6 | PRJ-2.20F | Secure card projections for Hoje, Jornada, Diagnósticos, Evidências and Evolução |
| 7 | MIG-2.20G | Non-destructive backfill, reconciliation and verification |

## Proposed domain contracts

### Methodology graph

- Persist methodology versions, four pillars, four ordered stages and the sixteen canonical development outcomes.
- The canonical stages are T1 Fundamentos, T2 Controle, T3 Previsibilidade and T4 Autonomia.
- Bind diagnostic dimensions/questions, content, basic training, missions, tools, evidence requirements and metric definitions to outcomes through versioned relations.
- Treat the map as the source of journey composition, not a UI constant.
- Allow TutorIA to receive a read-only, versioned methodology context package; this train does not activate AI reasoning or actions.
- Keep priority, active outcome and supporting outcomes distinct so the map does not become an inflexible content grid.
- Do not publish a resource binding when its methodological content has not been approved.

### Taxonomy reconciliation

- The new canonical journey uses the four Development Map pillars.
- Existing diagnostic executions retain their original five-dimension revision and scores unchanged.
- `Autonomia do Dono` is not silently converted into a fifth journey pillar; future methodology may model it as a transversal metric/outcome association after an explicit mapping is published.
- Cross-revision comparison requires a declared compatibility map; absent that map, the interface labels the revision boundary and does not calculate a false delta.

### Cycles and priorities

- Replace forever-unique organization constraints with history-preserving records.
- Persist an increasing cycle sequence and derive `T1`, `T2`, etc.
- Support planned, active and completed lifecycle states.
- Enforce at most one active cycle per organization with a partial unique constraint.
- Preserve priority and methodology snapshots used by each cycle.

### Diagnostic episodes

- Generalize the current M0-only period to entry, pulse, quarterly reanalysis and exit.
- Link every execution to the applicable journey/cycle and methodology revision.
- Preserve both completion time and effective measurement period.
- Only compare scores when their definitions are compatible; otherwise expose the revision boundary.

### Metric definitions and observations

- Definitions are versioned and typed, with unit, direction, validation rules and aggregation policy.
- Observations are append-only and retain source, provenance, confidence and effective time.
- Targets and observations are distinct records.
- Derived metrics declare their formula revision and inputs.
- Card totals and percentages are reproducible projections, never manually maintained duplicates.

### Evidence lifecycle

- Preserve existing evidence as immutable submission facts.
- Add append-only review events and correction/revision links.
- Distinguish submitted, in review, approved and changes requested.
- Never infer approval from submission or mission completion.
- Associate impact only through an explicit, validated relationship.

### Card projections

- Each card declares grain, time scope, source facts, formula and empty state.
- Queries accept a selected cycle or explicit all-time scope.
- Evidence and delivery aggregations query every mission in scope, not only the available mission.
- Projections use server-side authorization, RLS-safe access and explicit database grants.
- Large histories remain complete through pagination or bounded timeline navigation.

## Backfill rules

1. Preserve organization, identities, memberships and all existing methodological records.
2. Map the current cycle to sequence `1` / `T1`.
3. Map the completed M0 execution to the entry baseline.
4. Keep existing mission evidence as registered/submitted evidence.
5. Do not fabricate approvals, corrections, impact, targets, pulse values or current IME.
6. Use additive, versioned migrations with verification queries and a tested rollback path.
7. Seed the approved 4 × 4 map idempotently; do not seed unapproved content, tool or training details.

## Acceptance criteria

- A fixture with T1, T2 and T3 returns the correct records and totals for each selected cycle and for all-time scope.
- The Jornada map is read from the published methodology revision and contains exactly four ordered stages, four pillars and sixteen outcomes.
- Every published content, mission, tool, training and diagnostic binding traces to a methodology outcome and revision.
- Completing a mission never removes its evidence from Evidence or Evolution totals.
- Every displayed number traces to source records and a documented formula.
- Baseline, target, projected and achieved values cannot be confused.
- A methodology revision preserves old results and prevents invalid silent comparisons.
- Evidence corrections preserve the original submission and complete audit trail.
- Concurrent cycle transitions cannot create two active cycles.
- Cross-organization reads and writes fail under RLS and server-side authorization.
- Empty and partial datasets render honest states without placeholder statistics.
- Existing T1 data survives migration byte-for-byte where no transformation is required.
- Lint, typecheck, unit, integration, database, RLS and production build checks pass.

## Explicitly outside this train

- autonomous TutorIA reasoning or recommendations;
- WhatsApp delivery;
- integrations that automatically collect financial/operational metrics;
- arbitrary dashboard builder;
- methodology administration UI;
- invented historical values or simulated evolution;
- unrelated visual redesign;
- white label, Concierge and AI Tool Factory.

## Security and current Supabase compatibility

- RLS remains mandatory on exposed tables.
- New tables receive explicit least-privilege grants; exposure is never assumed.
- Privileged transitions revalidate identity, organization, role and state server-side.
- No service-role secret reaches the browser.
- Audit and source provenance are retained for every consequential transition.

## Release strategy

The train is implemented in one branch and one consolidated production release after all migrations, backfill checks, security tests, pre-release review and preview homologation. Documentation-only commits must not consume a Netlify production deploy.

## Approval gate

Owner approval is registered. BUILD is authorized only for the seven increments above; any destructive migration, inferred data, invented methodological resource or material scope expansion stops the train.
