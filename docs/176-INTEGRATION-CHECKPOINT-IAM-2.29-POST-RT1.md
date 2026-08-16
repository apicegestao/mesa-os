# Integration Checkpoint — IAM-2.29 after RT1 promotion

**Date:** 2026-08-13  
**Status:** branch integrated; production unchanged by this checkpoint

## Finding

`main` was promoted with Release Train 1 while the IAM-2.28/IAM-2.29
homologation branch remained based on the preceding ancestor. Promotion from
the stale branch would have been unsafe.

## Action

The homologation branch was rebased onto the current `main` tip. All 27
branch commits replayed without conflict. The remote branch was updated with
`--force-with-lease`, preserving protection against an unexpected concurrent
remote update.

## Validation

- current `main` is an ancestor of the branch;
- full suite: 41 files, 110 tests passed;
- lint, typecheck, production build and diff check passed;
- no production database, Auth, Netlify configuration or deploy was changed.

## Implication

The next preview is based on the production Release Train 1 baseline plus the
separately homologated IAM work. A future promotion still requires the
production gates recorded in `175-RELEASE-TRAIN-1-PRE-RELEASE-UPDATE-IAM-2.29.md`.
