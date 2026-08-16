# Homologation Member Smoke — IAM-2.29

**Date:** 2026-08-13  
**Environment:** deploy preview and isolated Supabase homologation  
**Production:** unchanged

## Result

The owner completed the member smoke using a pre-authorized member identity:

1. request a temporary code by e-mail;
2. receive the code through the configured SMTP sender;
3. confirm the code in the current deploy preview;
4. reach the member environment.

No OTP, credential, e-mail address, membership identifier or session value is
recorded here.

## Remaining IAM-2.29 gate

The segregated internal smoke remains pending: an active internal identity
must reach `/ops`, while the member identity must remain unable to use that
internal route. This is a homologation-only test and does not authorize
production promotion.
