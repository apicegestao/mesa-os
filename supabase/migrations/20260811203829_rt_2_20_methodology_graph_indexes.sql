drop index public.development_outcomes_revision_stage_idx;
drop index public.development_outcomes_revision_pillar_idx;

create index development_outcomes_stage_revision_idx
  on public.development_outcomes(stage_id, revision_id);
create index development_outcomes_pillar_revision_idx
  on public.development_outcomes(pillar_id, revision_id);
