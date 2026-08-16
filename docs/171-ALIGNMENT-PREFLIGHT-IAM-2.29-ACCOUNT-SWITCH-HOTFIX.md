# Alignment & Pre-Flight — IAM-2.29 account-switch hotfix

**Environment:** homologation preview only  
**Production:** unchanged

## Finding

An existing member session visiting `/ops/login` was redirected immediately to
`/ops`. The internal authorization gate correctly denied the member, but the
person had no in-product way to end that session and enter with an authorized
internal identity.

## Narrow authorized change

- Replace the unconditional redirect from `/ops/login` for any existing
  session with an explicit account-switch screen.
- Add one server-side sign-out action with the fixed destination `/ops/login`.
- Preserve the `/ops` authorization check; no member receives internal access.

## Outside scope

No new identity, membership, privilege, database object, RLS rule, SMTP
configuration, provider, production setting or access to member data.

## Validation

Run relevant identity tests, lint, typecheck, production build and diff check.
