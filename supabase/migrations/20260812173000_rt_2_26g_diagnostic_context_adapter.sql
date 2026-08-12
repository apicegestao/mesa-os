-- RT-2.26G: derive a minimal TutorIA fact from a completed canonical diagnostic.

alter table public.tutoria_member_memories
  add column source_execution_id uuid references public.diagnostic_executions(id) on delete restrict;
alter table public.tutoria_member_memory_revisions
  add column source_execution_id uuid references public.diagnostic_executions(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_kind_check,
  add constraint tutoria_member_memories_source_kind_check
    check (source_kind in ('member_confirmed', 'diagnostic_completed')),
  add constraint tutoria_member_memories_source_execution_scope_check
    check ((source_kind = 'member_confirmed' and source_execution_id is null) or (source_kind = 'diagnostic_completed' and source_execution_id is not null));
alter table public.tutoria_member_memory_revisions
  add constraint tutoria_member_memory_revisions_source_execution_scope_check
    check (source_execution_id is null or change_kind = 'created');

create unique index tutoria_member_memories_diagnostic_source_key
  on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_execution_id)
  where source_kind = 'diagnostic_completed';

create or replace function private.capture_completed_diagnostic_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare memory_id uuid; memory_version integer; summary text;
begin
  if old.status <> 'draft' or new.status <> 'completed' then return new; end if;
  if not private.is_tutoria_auto_context_eligible(new.organization_id, new.completed_by) then return new; end if;

  summary := format(
    'Diagnóstico %s concluído: IME %s/100; estágio %s.',
    case new.episode_type when 'entry' then 'de entrada' else new.episode_type end,
    new.ime_score,
    coalesce(new.stage_label, 'não classificado')
  );

  insert into public.tutoria_member_memories (
    organization_id, subject_identity_id, kind, content, source_kind, source_execution_id,
    confidence, state, created_by, updated_by
  ) values (
    new.organization_id, new.completed_by, 'organization_fact', summary, 'diagnostic_completed', new.id,
    100, 'active', new.completed_by, new.completed_by
  ) on conflict (organization_id, subject_identity_id, source_kind, source_execution_id)
    where source_kind = 'diagnostic_completed'
    do nothing
  returning id, version into memory_id, memory_version;

  if memory_id is not null then
    insert into public.tutoria_member_memory_revisions (
      memory_id, organization_id, subject_identity_id, version, kind, content, confidence,
      state, source_execution_id, change_kind, changed_by
    ) values (
      memory_id, new.organization_id, new.completed_by, memory_version, 'organization_fact', summary, 100,
      'active', new.id, 'created', new.completed_by
    );
  end if;
  return new;
end;
$$;

create trigger capture_completed_diagnostic_tutoria_context_after_update
after update of status on public.diagnostic_executions
for each row execute procedure private.capture_completed_diagnostic_tutoria_context();

revoke all on function private.capture_completed_diagnostic_tutoria_context() from public, anon, authenticated;
