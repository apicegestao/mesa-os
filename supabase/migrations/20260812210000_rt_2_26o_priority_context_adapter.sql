-- RT-2.26O: derive a minimal TutorIA fact from a confirmed strategic priority.

alter table public.tutoria_member_memories add column source_priority_id uuid references public.priorities(id) on delete restrict;
alter table public.tutoria_member_memory_revisions add column source_priority_id uuid references public.priorities(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_scope_check,
  add constraint tutoria_member_memories_source_scope_check check (
    (source_kind = 'member_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null)
    or (source_kind = 'diagnostic_completed' and source_execution_id is not null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null)
    or (source_kind = 'cycle_started' and source_execution_id is null and source_cycle_id is not null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null)
    or (source_kind = 'evidence_approved' and source_execution_id is null and source_cycle_id is null and source_evidence_id is not null and source_implementation_id is null and source_priority_id is null)
    or (source_kind = 'implementation_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is not null and source_priority_id is null)
    or (source_kind = 'priority_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is not null)
  ),
  drop constraint tutoria_member_memories_source_kind_check,
  add constraint tutoria_member_memories_source_kind_check check (source_kind in ('member_confirmed', 'diagnostic_completed', 'cycle_started', 'evidence_approved', 'implementation_confirmed', 'priority_confirmed'));

alter table public.tutoria_member_memory_revisions add constraint tutoria_member_memory_revisions_source_priority_scope_check check (source_priority_id is null or change_kind = 'created');
create unique index tutoria_member_memories_priority_source_key on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_priority_id) where source_kind = 'priority_confirmed';

create or replace function private.capture_confirmed_priority_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare memory_id uuid; memory_version integer; summary text;
begin
  if not private.is_tutoria_auto_context_eligible(new.organization_id, new.confirmed_by) then return new; end if;
  summary := format('Prioridade estratégica confirmada: %s.', new.dimension_label);
  insert into public.tutoria_member_memories (organization_id, subject_identity_id, kind, content, source_kind, source_priority_id, confidence, state, created_by, updated_by)
  values (new.organization_id, new.confirmed_by, 'organization_fact', summary, 'priority_confirmed', new.id, 100, 'active', new.confirmed_by, new.confirmed_by)
  on conflict (organization_id, subject_identity_id, source_kind, source_priority_id) where source_kind = 'priority_confirmed' do nothing
  returning id, version into memory_id, memory_version;
  if memory_id is not null then
    insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, source_priority_id, change_kind, changed_by)
    values (memory_id, new.organization_id, new.confirmed_by, memory_version, 'organization_fact', summary, 100, 'active', new.id, 'created', new.confirmed_by);
  end if;
  return new;
end;
$$;
create trigger capture_confirmed_priority_tutoria_context_after_insert after insert on public.priorities for each row execute procedure private.capture_confirmed_priority_tutoria_context();
revoke all on function private.capture_confirmed_priority_tutoria_context() from public, anon, authenticated;
