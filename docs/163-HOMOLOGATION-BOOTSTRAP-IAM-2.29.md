# Homologation Bootstrap — IAM-2.29

**Date:** 2026-08-13
**Environment:** Supabase branch `homologation-onboarding-iam-228` only

## Completed

- Two explicitly authorized internal identities were created and assigned the
  active `internal_operator` capability.
- The grant audit contains one initial `granted` event for each identity.
- One explicitly authorized member identity was created with an active `owner`
  membership in an isolated, non-production test organization.
- The Netlify public email-code feature flag was enabled only for
  `deploy-preview`; production was not changed.

## Boundaries preserved

- No production Supabase project, production deploy, or production environment
  variable was changed.
- No staff identity received a member membership or automatic read access to
  member data.
- No credentials, passwords, e-mail addresses, organization identifiers, OTPs,
  or service keys are recorded in this repository.

## Next verification

After the next deploy-preview build, perform the two smoke tests: an internal
identity reaches `/ops` and the test member reaches only `/app`.
