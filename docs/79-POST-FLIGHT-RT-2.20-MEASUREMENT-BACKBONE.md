# Post-Flight — RT-2.20 Measurement Backbone

Status: partial build checkpoint — 2026-08-11

## Delivered in the isolated Supabase branch

- The Mesa dos Donos methodology is versioned as a 4 × 4 graph: four stages, four pillars, and sixteen linked development outcomes.
- Cycles carry a sequence and a methodology revision/stage; only one cycle may be active for an organization.
- Diagnostic episodes are longitudinal (`entry`, `pulse`, `quarterly`, and `exit`) without mutating the historical entry diagnostic.
- Metric definitions, observations, targets, provenance, confidence and validation state are modeled separately.
- Evidence is append-only: every correction is a new revision; review history is immutable and supports `TutorIA`, human, or system reviewers.
- The evidence screen reads the current canonical revision, preserving each evidence status instead of assuming it was approved.

## Verification

- Branch: `rt-2-20-measurement-backbone` (`tqpxqevlhfyqnjdrhlhd`).
- Production project and Netlify production site were not changed.
- Schema verification confirmed the evidence revision columns, initialization and immutability triggers, review table, and current-status view.
- `pnpm check` passed: lint, typecheck, 38 tests, and production build.

## Known boundary

This checkpoint creates the governed measurement and evidence-review contract. It does **not** activate autonomous TutorIA review, human-review operations, tool exports, WhatsApp, or production deployment. Those require their own approved implementation increments and policy/runtime controls.

## Security checkpoint

The privileged logic was moved to the non-exposed `private` schema and public RPCs became `SECURITY INVOKER` gateways. The Supabase security advisor now returns zero alerts on the test branch. Promotion still requires the standard merge, CI, pre-release, database-branch promotion and authenticated smoke checks.
