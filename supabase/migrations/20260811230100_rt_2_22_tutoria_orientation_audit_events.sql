alter table public.tutoria_orientation_audits
  add column event_kind text not null default 'invocation_finished'
  check (event_kind in ('invocation_started', 'invocation_finished'));
