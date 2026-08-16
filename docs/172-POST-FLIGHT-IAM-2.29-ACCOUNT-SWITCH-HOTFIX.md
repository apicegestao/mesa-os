# Post-Flight — IAM-2.29 account-switch hotfix

**Status:** BUILD complete; homologation retest pending  
**Production:** unchanged  
**Migration:** none

## Delivered

- `/ops/login` no longer redirects every authenticated identity to `/ops`.
- A current member session sees an explicit account-switch screen instead.
- The screen ends the current session server-side and returns only to the
  fixed internal login path.
- `/ops` remains the authority for internal capability verification; this
  change does not grant internal access to any member.

## Verification

- identity unit tests: passed
- full suite: 41 files, 110 tests passed
- lint: passed
- typecheck: passed
- production build: passed
- `git diff --check`: passed

## Remaining gate

In the new deploy preview, an existing member session must be ended through
the account-switch screen; then an active internal identity must authenticate
at `/ops/login` and reach `/ops`.
