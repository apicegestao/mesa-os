# Post-Flight — IAM-2.29 Segregated access

**Status:** homologation complete; production not promoted  
**Production:** unchanged

## Delivered

- Member access exclusively by pre-authorized e-mail and temporary code.
- Separate `/ops/login` and `/ops` surface for active internal operators.
- Controlled account-switch flow prevents a member session from masking the
  internal-login form.
- Internal operation is limited to creating and revoking authorized member
  enrollments; it does not load member business data.

## Homologation evidence

- SMTP dispatch accepted after credential correction.
- Member smoke completed: code receipt, confirmation and member environment.
- Internal smoke completed: session switch, internal code confirmation and
  controlled enrollment screen.
- Member-to-ops denial remained enforced.

## Quality

- full suite at the latest code change: 41 files, 110 tests passed;
- lint, typecheck, production build and diff check passed;
- no migration was added by the OTP or account-switch hotfixes.

## Deliberately not promoted

- No production database, authentication, Netlify environment or deploy was
  changed.
- No public signup, password, magic link, social login, global member-data
  access, backoffice expansion, AI control or impersonation was added.

## Next governed gate

Return to the integrated Release Train 1 pre-release review. Production
remains blocked until its independent backup/restore confirmation, migration
parity, security review and a new explicit promotion decision.
