# Release Train 1 — Pre-Release Update after IAM-2.29

**Date:** 2026-08-13  
**Mode:** read-only review  
**Production:** unchanged

## Evidence refreshed

- Member and internal IAM-2.29 smoke tests completed in isolated
  homologation.
- Production migration history ends at the RT-2.27A/Terms hotfixes.
- Homologation has four additional IAM migrations: controlled onboarding,
  onboarding hardening, segregated access and RPC-privilege hardening.
- Production Security Advisor currently reports no lints.

## Homologation security review

Homologation reports five warnings:

1. Four `authenticated_security_definer_function_executable` warnings refer
   exactly to the IAM-2.29 internal-operation RPCs. Their `authenticated`
   reachability is deliberate; each performs an active internal-operator
   capability check and has anonymous execution revoked. This remains a
   reviewed exception documented in `162-SECURITY-REVIEW-IAM-2.29-PRIVILEGED-RPCS.md`.
2. `auth_leaked_password_protection` remains disabled. It is not used by the
   OTP-only member flow, but enabling it in production is already a release
   pack requirement and must be performed as an explicit operational change.

## Promotion remains blocked

No production migration, Auth setting or deploy may begin until all of the
following are explicitly satisfied:

- owner confirms a usable production backup/restore point for the release
  window;
- the four IAM migrations are separately reviewed in their exact production
  order, including the accepted authenticated-RPC exception;
- production Auth leaked-password protection is enabled as required by the
  approved promotion pack;
- the integrated PR is reviewed and the owner gives a fresh promotion
  authorization after this update.

## Next allowed work

Continue read-only PR and migration-order review. BUILD remains permitted in
the branch only for defects found in homologation; production stays isolated.
