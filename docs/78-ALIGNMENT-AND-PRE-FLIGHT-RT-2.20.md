# Alignment Check & Pre-Flight — RT-2.20

**Mode:** BUILD  
**Status:** PASSED — BUILD AUTHORIZED  
**Date:** 2026-08-11

## Authorities consulted

- `00-CONSTITUTION.md`
- `02-V2-SCOPE.md`
- `08-ADR-DECISION-LOG.md`
- `09-CONSTRUCTION-PROTOCOL.md`
- `10-CURRENT-SCOPE.md`
- `63-SOURCE-RECOVERY-MESA-OS-V2.md`
- `65-APPROVED-PRODUCT-SOURCE-REGISTER.md`
- `67-TUTORIA-CANONICAL-ARCHITECTURE.md`
- `68-METHODOLOGY-4X4-RECONCILIATION.md`
- `76-MEASUREMENT-COVERAGE-AUDIT.md`
- canonical conversation `Mesa OS V2`
- owner clarification and approval recorded on 2026-08-11

## Alignment result

The source conversation defines the initial diagnostic as a frozen baseline, the quarterly journey as the organizing method, metrics as traceable observations and TutorIA as the central operational agent. The owner has now resolved that the 4 × 4 Development Map is the mandatory methodological backbone that connects Raio-X, cycles, content, training, missions, tools, evidence, measurement and TutorIA's initial knowledge.

The existing scope explicitly excluded longitudinal evolution and multiple cycles because they required their own increment. RT-2.20 is that explicitly approved increment; `10-CURRENT-SCOPE.md` must therefore be updated before implementation.

## Pre-Flight findings

- Existing production data can be preserved through additive migrations and explicit backfill.
- The current one-cycle, M0-only and evidence-loader constraints cannot support the approved screens longitudinally.
- Current diagnostic taxonomy has five dimensions, while the canonical Development Map has four pillars and Autonomia as T4; old scores must remain attached to their original revision.
- The Development Map currently exists as documentation and a frontend constant, not as versioned domain data.
- No approved detailed content catalog exists for all sixteen outcomes; the schema may support those bindings, but BUILD must not invent them.
- New Supabase public tables require explicit least-privilege grants in addition to RLS under the current Data API exposure model.

## Build controls

- Create migrations through the Supabase CLI workflow; no manual production schema edits.
- Add RLS, explicit grants, organization scoping and supporting indexes for every new exposed table.
- Use append-only observations/review events and immutable methodology revisions.
- Do not overwrite current migrations or completed diagnostic/evidence facts.
- Separate canonical facts from projections and presentation.
- Add multi-cycle, taxonomy-revision, aggregation, concurrency, RLS and backfill tests.
- Run lint, typecheck, unit/integration tests, database tests and production build before release.
- Use one consolidated release and production deploy after preview homologation.

## Stop conditions

- destructive or lossy migration;
- need to infer approval, impact, score, content or tool definitions;
- cross-revision comparison without an approved compatibility map;
- inability to prove tenant isolation or historical preservation;
- material expansion into active TutorIA, WhatsApp, Concierge or methodology administration.

## Decision

Alignment and Pre-Flight pass for RT-2.20 under the controls above. Implementation starts with the methodology graph and its idempotent 4 × 4 seed, followed by temporal cycles and longitudinal measurements.
