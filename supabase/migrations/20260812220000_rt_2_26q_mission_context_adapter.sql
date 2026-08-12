-- RT-2.26Q: derive the current available Mission as a minimal TutorIA fact.

alter table public.tutoria_member_memories add column source_mission_id uuid references public.missions(id) on delete restrict;
alter table public.tutoria_member_memory_revisions add column source_mission_id uuid references public.missions(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_scope_check,
  add constraint tutoria_member_memories_source_scope_check check (
    (source_kind = 'member_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null and source_mission_id is null)
    or (source_kind = 'diagnostic_completed' and source_execution_id is not null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null and source_mission_id is null)
    or (source_kind = 'priority_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is not null and source_mission_id is null)
    or (source_kind = 'cycle_started' and source_execution_id is null and source_cycle_id is not null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null and source_mission_id is null)
    or (source_kind = 'mission_available' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null and source_priority_id is null and source_mission_id is not null)
    or (source_kind = 'implementation_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is not null and source_priority_id is null and source_mission_id is null)
    or (source_kind = 'evidence_approved' and source_execution_id is null and source_cycle_id is null and source_evidence_id is not null and source_implementation_id is null and source_priority_id is null and source_mission_id is null)
  ),
  drop constraint tutoria_member_memories_source_kind_check,
  add constraint tutoria_member_memories_source_kind_check check (source_kind in ('member_confirmed', 'diagnostic_completed', 'priority_confirmed', 'cycle_started', 'mission_available', 'implementation_confirmed', 'evidence_approved'));

alter table public.tutoria_member_memory_revisions add constraint tutoria_member_memory_revisions_source_mission_scope_check check (source_mission_id is null or change_kind in ('created', 'invalidated'));
create unique index tutoria_member_memories_mission_source_key on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_mission_id) where source_kind = 'mission_available';

create or replace function private.capture_available_mission_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare subject_id uuid; memory_id uuid; memory_version integer; summary text; memory_record record;
begin
  select created_by into subject_id from public.cycles where id = new.cycle_id;
  if subject_id is null or not private.is_tutoria_auto_context_eligible(new.organization_id, subject_id) then return new; end if;
  if new.status = 'available' and (tg_op = 'INSERT' or old.status <> 'available') then
    summary := format('Missão atual disponível: %s.', new.title);
    insert into public.tutoria_member_memories (organization_id, subject_identity_id, kind, content, source_kind, source_mission_id, confidence, state, created_by, updated_by)
    values (new.organization_id, subject_id, 'organization_fact', summary, 'mission_available', new.id, 100, 'active', subject_id, subject_id)
    on conflict (organization_id, subject_identity_id, source_kind, source_mission_id) where source_kind = 'mission_available' do nothing
    returning id, version into memory_id, memory_version;
    if memory_id is not null then
      insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, source_mission_id, change_kind, changed_by)
      values (memory_id, new.organization_id, subject_id, memory_version, 'organization_fact', summary, 100, 'active', new.id, 'created', subject_id);
    end if;
  elsif tg_op = 'UPDATE' and old.status = 'available' and new.status <> 'available' then
    update public.tutoria_member_memories set state = 'expired', valid_until = now(), version = version + 1, updated_by = subject_id, updated_at = now()
    where organization_id = new.organization_id and subject_identity_id = subject_id and source_kind = 'mission_available' and source_mission_id = new.id and state = 'active'
    returning * into memory_record;
    if memory_record.id is not null then
      insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, valid_until, source_mission_id, change_kind, changed_by)
      values (memory_record.id, memory_record.organization_id, memory_record.subject_identity_id, memory_record.version, memory_record.kind, memory_record.content, memory_record.confidence, memory_record.state, memory_record.valid_until, new.id, 'invalidated', subject_id);
    end if;
  end if;
  return new;
end;
$$;

create trigger capture_available_mission_tutoria_context_after_write
after insert or update of status on public.missions for each row execute procedure private.capture_available_mission_tutoria_context();
revoke all on function private.capture_available_mission_tutoria_context() from public, anon, authenticated;
