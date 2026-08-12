-- RT-2.26J: permit an audited, minimal read of authorized automatic context.

alter type public.tutoria_tool_name add value if not exists 'read_longitudinal_context';
