-- RT-2.27A: every completed diagnostic projects a validated IME observation once.

create or replace function private.project_completed_diagnostic_ime_metric()
returns trigger language plpgsql security definer set search_path = '' as $$
declare metric_definition_id uuid;
begin
  if old.status <> 'draft' or new.status <> 'completed' or new.ime_score is null then return new; end if;
  select id into metric_definition_id from public.metric_definitions where code = 'ime' and status = 'published';
  if metric_definition_id is null then return new; end if;
  insert into public.metric_observations (
    organization_id, cycle_id, definition_id, numeric_value, effective_on, source_type,
    diagnostic_execution_id, provenance, confidence, validation_status, recorded_by, idempotency_key
  ) values (
    new.organization_id, new.cycle_id, metric_definition_id, new.ime_score, new.effective_on, 'diagnostic',
    new.id, 'validated', 1, 'validated', new.completed_by, 'diagnostic-ime:' || new.id::text
  ) on conflict (organization_id, idempotency_key) do nothing;
  return new;
end;
$$;

create trigger project_completed_diagnostic_ime_metric_after_update
after update of status on public.diagnostic_executions
for each row execute procedure private.project_completed_diagnostic_ime_metric();
revoke all on function private.project_completed_diagnostic_ime_metric() from public, anon, authenticated;
