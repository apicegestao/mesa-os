# Security Review — IAM-2.29 privileged RPCs

**Status:** accepted for homologation only
**Scope:** `internal_operator` state and controlled access-enrollment RPCs

## Finding and remediation

The initial advisor run identified that PostgreSQL's default function execution
privilege could leave the four `SECURITY DEFINER` RPCs available to the
anonymous database role. Migration `20260813214746` explicitly revokes that
privilege from `anon`.

## Deliberate authenticated surface

The functions remain callable by `authenticated`, which is necessary for the
segregated operational interface. That permission alone grants nothing:

- every mutating RPC verifies `auth.uid()` and an active `internal_operator`
  capability inside the function;
- only the controlled enrollment workflow is exposed;
- the operational tables have RLS enabled, deny-by-default policies, and no
  direct privileges for browser roles;
- no member business data, organization membership list, AI governance, or
  service credential is returned by these RPCs.

This is a reviewed exception to the generic advisor warning, not a blanket
exception for future privileged functions. Any new `SECURITY DEFINER` function
must receive its own review and explicit anonymous revocation.

## Release gate

Before a production promotion: prove anonymous invocation is denied, prove a
non-operator authenticated caller is denied, prove an active operator can only
perform the documented enrollment actions, and repeat the security-advisor
review.
