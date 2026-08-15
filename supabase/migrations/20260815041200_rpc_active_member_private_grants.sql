-- Correct active security-invoker wrappers. Each private implementation keeps
-- its own authenticated identity, membership, organization and provenance checks.

grant execute on function private.save_workbench_tool_draft(uuid, jsonb) to authenticated;
grant execute on function private.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz) to authenticated;
grant execute on function private.invalidate_my_tutoria_memory(uuid) to authenticated;
