-- JRN-3.13: completed Raio-X executions created before DIA-3.8 displayed a
-- deterministic direction but did not persist the priority that unlocks the
-- cycle. Backfill it from the immutable result snapshot using the same
-- methodology-bound rule used by private.submit_diagnostic.
with raw_dimension_scores as (
  select
    e.id as execution_id,
    e.organization_id,
    e.revision_id,
    e.completed_by,
    d.id as diagnostic_dimension_id,
    d.code as dimension_code,
    d.label as dimension_label,
    (item ->> 'score')::integer as source_score,
    d.position
  from public.diagnostic_executions e
  cross join lateral jsonb_array_elements(e.result_snapshot -> 'dimensions') item
  join public.diagnostic_dimensions d
    on d.revision_id = e.revision_id
   and d.code = item ->> 'code'
  where e.status = 'completed'
    and e.completed_by is not null
    and e.result_snapshot ? 'dimensions'
), scored_dimension_scores as (
  select raw.*, min(source_score) over (partition by execution_id) as lowest_score
  from raw_dimension_scores raw
), dimension_scores as (
  select
    raw.*,
    row_number() over (
      partition by execution_id
      order by source_score asc, position asc
    ) as priority_rank,
    count(*) filter (
      where source_score = lowest_score
    ) over (partition by execution_id) as tied_count
  from scored_dimension_scores raw
), missing_priorities as (
  select *
  from dimension_scores ds
  where ds.priority_rank = 1
    and not exists (
      select 1 from public.priorities p where p.diagnostic_execution_id = ds.execution_id
    )
)
insert into public.priorities (
  organization_id,
  diagnostic_execution_id,
  diagnostic_dimension_id,
  dimension_code,
  dimension_label,
  source_score,
  rationale,
  confirmed_by
)
select
  organization_id,
  execution_id,
  diagnostic_dimension_id,
  dimension_code,
  dimension_label,
  source_score,
  case when tied_count > 1
    then 'Direção derivada automaticamente pelo Raio-X: empate na menor pontuação resolvido pela ordem metodológica publicada; ' || dimension_label || ' inicia o ciclo com score ' || source_score || '/100.'
    else 'Direção derivada automaticamente pelo Raio-X: ' || dimension_label || ' apresentou a menor maturidade, com score ' || source_score || '/100. O TutorIA conduzirá o ciclo inicial a partir deste ponto.'
  end,
  completed_by
from missing_priorities
on conflict (diagnostic_execution_id) do nothing;
