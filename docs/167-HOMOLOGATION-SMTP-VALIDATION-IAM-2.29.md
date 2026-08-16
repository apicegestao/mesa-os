# Homologation SMTP Validation — IAM-2.29

**Date:** 2026-08-13  
**Environment:** Supabase homologation only  
**Production:** unchanged  
**Status:** sending accepted; member-side code entry remains to be exercised by the intended recipient

## Scope

Validate the custom SMTP correction required for the approved passwordless
e-mail + six-digit code access flow. No application code, schema, identity,
or production configuration was changed.

## Result

- Supabase Auth accepted one controlled OTP dispatch request with HTTP `200`.
- The preceding SMTP authentication rejection (`535`) is no longer returned.
- The SMTP credential was never read, exported, logged, or committed.

## Remaining controlled check

The intended recipient must enter the received six-digit code in the
homologation login screen. This confirms the complete user-facing cycle
without collecting the code in operational logs or this repository.

## Promotion gate

Production remains blocked until the member-side check is successful and the
production e-mail delivery policy has its own approved operational review.
