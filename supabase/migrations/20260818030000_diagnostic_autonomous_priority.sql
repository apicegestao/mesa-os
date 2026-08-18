-- DIA-3.8: finishing the entry diagnostic also derives the first priority.
-- The member never selects the focus manually. Ties use the published
-- dimension order, which is deterministic, auditable and methodology-bound.
create or replace function private.submit_diagnostic(target_execution_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_revision_id uuid;
  required_count integer;
  answered_count integer;
  overall_score integer;
  stage text;
  stage_name text;
  snapshot jsonb;
  candidate_dimension_id uuid;
  candidate_code text;
  candidate_label text;
  candidate_score integer;
  tied_count integer;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;

  select e.organization_id, e.revision_id
  into target_organization_id, target_revision_id
  from public.diagnostic_executions e
  where e.id = target_execution_id
    and e.status = 'draft'
    and private.is_active_owner(e.organization_id)
  for update;
  if target_revision_id is null then raise exception 'submittable diagnostic execution not found' using errcode = '42501'; end if;

  select count(*) into required_count from public.diagnostic_questions q where q.revision_id = target_revision_id and q.required;
  select count(*) into answered_count
  from public.diagnostic_responses a join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id and q.revision_id = target_revision_id and q.required;
  if required_count = 0 or answered_count <> required_count then raise exception 'all required questions must be answered' using errcode = '23514'; end if;

  select round((sum(a.value)::numeric / (required_count * 5)) * 100)::integer into overall_score
  from public.diagnostic_responses a join public.diagnostic_questions q on q.id = a.question_id
  where a.execution_id = target_execution_id and q.required;
  if overall_score < 40 then stage := 'empresa_refem'; stage_name := 'Empresa Refém';
  elsif overall_score < 60 then stage := 'em_transicao'; stage_name := 'Em Transição';
  elsif overall_score < 80 then stage := 'em_maturacao'; stage_name := 'Em Maturação';
  else stage := 'autogerenciavel'; stage_name := 'Autogerenciável'; end if;

  select jsonb_build_object(
    'ime', overall_score, 'stageCode', stage, 'stageLabel', stage_name,
    'dimensions', jsonb_agg(jsonb_build_object('code', dimension_scores.code, 'label', dimension_scores.label, 'score', dimension_scores.score) order by dimension_scores.position)
  ) into snapshot
  from (
    select d.code, d.label, d.position, round((sum(a.value)::numeric / (count(*) * 5)) * 100)::integer as score
    from public.diagnostic_dimensions d join public.diagnostic_questions q on q.dimension_id = d.id
    join public.diagnostic_responses a on a.question_id = q.id and a.execution_id = target_execution_id
    where d.revision_id = target_revision_id
    group by d.id, d.code, d.label, d.position
  ) dimension_scores;

  update public.diagnostic_executions set status = 'completed', completed_by = actor_id, ime_score = overall_score,
    stage_code = stage, stage_label = stage_name, result_snapshot = snapshot, completed_at = now(), updated_at = now()
  where id = target_execution_id;

  select d.id, d.code, d.label, (item ->> 'score')::integer
  into candidate_dimension_id, candidate_code, candidate_label, candidate_score
  from jsonb_array_elements(snapshot -> 'dimensions') item
  join public.diagnostic_dimensions d on d.revision_id = target_revision_id and d.code = item ->> 'code'
  order by (item ->> 'score')::integer asc, d.position asc
  limit 1;
  select count(*) into tied_count
  from jsonb_array_elements(snapshot -> 'dimensions') item
  where (item ->> 'score')::integer = candidate_score;
  if candidate_dimension_id is null then raise exception 'priority dimension not found' using errcode = '23503'; end if;

  insert into public.priorities (
    organization_id, diagnostic_execution_id, diagnostic_dimension_id, dimension_code,
    dimension_label, source_score, rationale, confirmed_by
  ) values (
    target_organization_id, target_execution_id, candidate_dimension_id, candidate_code,
    candidate_label, candidate_score,
    case when tied_count > 1
      then 'Direção derivada automaticamente pelo Raio-X: empate na menor pontuação resolvido pela ordem metodológica publicada; ' || candidate_label || ' inicia o ciclo com score ' || candidate_score || '/100.'
      else 'Direção derivada automaticamente pelo Raio-X: ' || candidate_label || ' apresentou a menor maturidade, com score ' || candidate_score || '/100. O TutorIA conduzirá o ciclo inicial a partir deste ponto.'
    end,
    actor_id
  ) on conflict (diagnostic_execution_id) do nothing;

  return snapshot;
end;
$$;

revoke all on function private.submit_diagnostic(uuid) from public, anon;
grant execute on function private.submit_diagnostic(uuid) to authenticated;
