create index diagnostic_executions_revision_id_idx
  on public.diagnostic_executions (revision_id);

create index diagnostic_executions_started_by_idx
  on public.diagnostic_executions (started_by);

create index diagnostic_executions_completed_by_idx
  on public.diagnostic_executions (completed_by)
  where completed_by is not null;

create index diagnostic_questions_dimension_revision_idx
  on public.diagnostic_questions (dimension_id, revision_id);

create index diagnostic_responses_answered_by_idx
  on public.diagnostic_responses (answered_by);
