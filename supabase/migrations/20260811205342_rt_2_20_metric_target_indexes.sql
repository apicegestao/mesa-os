create index metric_targets_cycle_id_idx on public.metric_targets(cycle_id) where cycle_id is not null;
create index metric_targets_definition_id_idx on public.metric_targets(definition_id);
