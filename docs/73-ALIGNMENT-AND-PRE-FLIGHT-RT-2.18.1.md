# RT-2.18.1 — Alignment Check & Pre-Flight

**Mode:** BUILD  
**Status:** APPROVED  
**Date:** 2026-08-11

## Alignment Check

Authorities consulted: `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md`, `10-CURRENT-SCOPE.md`, `65-APPROVED-PRODUCT-SOURCE-REGISTER.md` and the approved RT-2.18 Definition Pack.

Sources consulted: the official `Mesa OS V2` conversation baseline, the approved methodology image and `mesa-dos-donos-ultima-versao(1).html`.

The production UI diverges from the approved reference in typography, density, progress visualization and the Lula contextual-content card. The reference uses Arial, compact cards, navy/blue visual hierarchy, colored progress bars and a mentor note. Correcting those divergences is compatible with Governance because it changes presentation, not canonical business state.

## Authorized scope

- Adopt Arial throughout the product and remove serif typography.
- Reduce type scale, card dimensions, padding and excessive vertical length.
- Add colored progress visualization derived only from canonical state.
- Add the contextual “Direção do Lula” card from the approved reference.
- Add authenticated password creation and email/password sign-in; retain magic link as recovery/fallback.
- Reset only the current organization’s methodological execution data after an exact-target audit.
- Preserve identity, organization, membership, invitations, methodology definitions and authorization rules.

## Out of scope

- TutorIA backend, simulated chat, WhatsApp, Concierge or AI actions.
- New methodology rules, progress invented outside persisted state, or fabricated external content URLs.
- Custom SMTP procurement or credentials.
- Changes to RLS, organization permissions or membership lifecycle.

## Files and database impact

- Identity Access actions and UI.
- Member Experience components, page composition, tests and global styles.
- Governance documentation.
- No DDL migration. The reset is a one-time, explicit DML transaction restricted to the organization `Grupo Ápice`, documented by before/after counts.

## Risks and controls

- Authentication enumeration: generic error messages and server-side Supabase Auth calls.
- Weak passwords: minimum 12 characters in UI; Supabase remains the password authority.
- Fake progress: progress numerator is calculated from loaded canonical records.
- External content integrity: no external URL is invented; the button remains unavailable until an approved URL is configured.
- Destructive reset: exact organization checked before deletion; transaction order follows foreign keys; identity and membership counts verified afterwards.

## Verification

- Unit/component tests for password validation, sign-in UI, canonical progress and mentor card.
- Lint, typecheck, full test suite and production build.
- Supabase before/after count query.
- One consolidated preview/deploy and authenticated production smoke.

## Reset execution record

Executed on 2026-08-11 in one transaction, restricted by both organization UUID `29a24c8d-f246-4b29-8ce3-63e65b3d33be` and name `Grupo Ápice`.

| Record set | Before | After |
|---|---:|---:|
| Memberships | 1 | 1 |
| Diagnostic executions | 1 | 0 |
| Priorities | 1 | 0 |
| Cycles | 1 | 0 |
| Missions | 3 | 0 |
| Tool instances | 1 | 0 |
| Implementations | 1 | 0 |
| Evidence | 1 | 0 |

Identity, organization, membership and versioned methodology definitions were preserved.
