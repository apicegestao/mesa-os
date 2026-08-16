-- MTH-3.4C corrective migration: preserve the Admin-only editorial gate while
-- allowing the public RPC wrapper to invoke its private guarded implementation.

grant execute on function private.get_my_methodology_editorial_release_workspace() to authenticated;
