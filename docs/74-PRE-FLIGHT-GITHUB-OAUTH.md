# RT-2.18.2 — GitHub OAuth Access

**Mode:** BUILD  
**Status:** APPROVED  
**Date:** 2026-08-11

## Decision

Add GitHub OAuth as the primary fast-access method. The authenticated GitHub account `apicegestao` has repository admin permission and the same verified email as the existing Mesa OS owner identity (`rafaelportela@outlook.com`). Supabase automatic identity linking therefore preserves the existing user and organizational membership.

## Security controls

- Official GitHub OAuth App owned by `apicegestao`.
- Homepage restricted to `https://mesa-os.netlify.app`.
- Authorization callback restricted to `https://vlkkokjbtmdeoxewsbiy.supabase.co/auth/v1/callback`.
- Device Flow disabled.
- Users without an email are not allowed.
- Client secret exists only in Supabase Auth configuration and is never committed or exposed to the frontend.
- The initially visible secret was revoked before provider activation; only its rotated replacement remains active.
- OAuth identity must present the same verified email for automatic linking; application authorization continues to depend on the existing active membership and RLS.

## Code scope

- Add `Entrar com GitHub` to the login page using Supabase PKCE OAuth.
- Reuse the existing allowlisted `/auth/callback?next=/app` route.
- Keep password and magic link as fallbacks.
- No database migration, membership mutation or authorization bypass.

## Verification

- Lint, typecheck, tests and production build.
- Provider enabled in Supabase.
- End-to-end GitHub authorization, callback, existing-user link and authenticated `/app` smoke.
