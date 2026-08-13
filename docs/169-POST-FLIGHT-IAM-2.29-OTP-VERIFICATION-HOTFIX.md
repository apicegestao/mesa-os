# Post-Flight — IAM-2.29 OTP verification hotfix

**Status:** BUILD complete; ready for homologation retest  
**Production:** unchanged  
**Migration:** none

## Delivered

- The numeric OTP entry is no longer rejected by a client-side fixed length.
- Supabase Auth `verifyOtp` remains the sole authority for the code format,
  validity, expiry, rate limits and session issuance.
- The screen still accepts only numeric input and shows a clear message when
  no numeric code is supplied.

## Verification

- focused identity test: 5 passed
- full suite: 108 passed
- lint: passed
- typecheck: passed
- production build: passed
- `git diff --check`: passed

## Retest

Use one newly received OTP in the homologation login page. The expected
result is immediate navigation to `/app`; no code is to be shared with the
team or recorded in the repository.
