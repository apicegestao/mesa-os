-- Explicitly remove the default RPC execution surface for anonymous callers.
-- Authenticated execution remains intentional and every privileged operation
-- re-checks the active internal_operator capability inside the function.

revoke execute on function public.get_my_internal_operator_state() from anon;
revoke execute on function public.create_internal_access_enrollment(uuid, text, public.membership_role, integer) from anon;
revoke execute on function public.revoke_internal_access_enrollment(uuid) from anon;
revoke execute on function public.list_my_internal_access_enrollments() from anon;
