-- RT-2.25: explicit, audited read scope for a member's own structured workbench.
-- This adds no write capability and exposes no cross-organization data.
alter type public.tutoria_tool_name add value if not exists 'read_workbench_tool';
