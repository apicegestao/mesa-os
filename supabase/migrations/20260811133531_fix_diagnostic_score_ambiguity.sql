create or replace function public.submit_diagnostic(target_execution_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_revision_id uuid;
  required_count integer;
  answered_count integer;
  overall_score integer;
  stage text;
  stage_name text;
  snapshot jsonb;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select e.revision_id into target_revision_id
  from public.diagnostic_executions e
  where e.id = target_execution_id
    and e.status = 'draft'
    and private.is_active_owner(e.organization_id)
  for update;

  if target_revision_id is null then
    raise exception 'submittable diagnostic execution not found' using errcode = '42501';
  end if;

  select count(*) into required_count
  from public.diagnostic_questions q
  where q.revision_id = target_revision_id and q.required;

  select count(*) into answered_count
  from public.diagnostic_responses a
  join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id
    and q.revision_id = target_revision_id
    and q.required;

  if required_count = 0 or answered_count <> required_count then
    raise exception 'all required questions must be answered' using errcode = '23514';
  end if;

  select round((sum(a.value)::numeric / (required_count * 5)) * 100)::integer
  into overall_score
  from public.diagnostic_responses a
  join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id and q.required;

  if overall_score < 40 then stage := 'empresa_refem'; stage_name := 'Empresa Refém';
  elsif overall_score < 60 then stage := 'em_transicao'; stage_name := 'Em Transição';
  elsif overall_score < 80 then stage := 'em_maturacao'; stage_name := 'Em Maturação';
  else stage := 'autogerenciavel'; stage_name := 'Autogerenciável';
  end if;

  select jsonb_build_object(
    'ime', overall_score,
    'stageCode', stage,
    'stageLabel', stage_name,
    'dimensions', jsonb_agg(
      jsonb_build_object(
        'code', dimension_scores.code,
        'label', dimension_scores.label,
        'score', dimension_scores.score
      ) order by dimension_scores.position
    )
  ) into snapshot
  from (
    select d.code, d.label, d.position,
      round((sum(a.value)::numeric / (count(*) * 5)) * 100)::integer as score
    from public.diagnostic_dimensions d
    join public.diagnostic_questions q on q.dimension_id = d.id
    join public.diagnostic_responses a
      on a.question_id = q.id and a.execution_id = target_execution_id
    where d.revision_id = target_revision_id
    group by d.id, d.code, d.label, d.position
  ) as dimension_scores;

  update public.diagnostic_executions
  set status = 'completed',
      completed_by = actor_id,
      ime_score = overall_score,
      stage_code = stage,
      stage_label = stage_name,
      result_snapshot = snapshot,
      completed_at = now(),
      updated_at = now()
  where id = target_execution_id;

  return snapshot;
end;
$$;

revoke all on function public.submit_diagnostic(uuid) from public, anon;
grant execute on function public.submit_diagnostic(uuid) to authenticated;
