# Alignment & Pre-Flight — IAM-2.29 OTP verification hotfix

**Mode:** BUILD — homologation only  
**Production:** unchanged

## Finding

Authentication logs show OTP dispatches but no verification request. The login
form imposed a client-side fixed-length rule even though Supabase Auth is the
canonical verifier and may own the configured token format.

## Authorized narrow change

Remove the client-side fixed length gate. Preserve numeric-only input and send
the token to Supabase `verifyOtp`, which remains the sole authority for token
validity, expiry, rate limits, session creation and access control.

## Safety checks

- No public signup, password, magic link or social login is added.
- No server secret or SMTP credential is exposed.
- No database, RLS, identity or production configuration is changed.
- Unit tests, lint, typecheck and production build must pass before preview.
