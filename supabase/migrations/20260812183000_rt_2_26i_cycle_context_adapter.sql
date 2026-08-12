-- RT-2.26I: derive a minimal TutorIA fact when a canonical active cycle is created.

alter table public.tutoria_member_memories
  add column source_cycle_id uuid references public.cycles(id) on delete restrict;
alter table public.tutoria_member_memory_revisions
  add column source_cycle_id uuid references public.cycles(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_kind_check,
  drop constraint tutoria_member_memories_source_execution_scope_check,
  add constraint tutoria_member_memories_source_kind_check check (source_kind in ('member_confirmed', 'diagnostic_completed', 'cycle_started')),
  add constraint tutoria_member_memories_source_scope_check check (
    (source_kind = 'member_confirmed' and source_execution_id is null and source_cycle_id is null)
    or (source_kind = 'diagnostic_completed' and source_execution_id is not null and source_cycle_id is null)
    or (source_kind = 'cycle_started' and source_execution_id is null and source_cycle_id is not null)
  );
alter table public.tutoria_member_memory_revisions
  add constraint tutoria_member_memory_revisions_source_cycle_scope_check check (source_cycle_id is null or change_kind = 'created');

create unique index tutoria_member_memories_cycle_source_key
  on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_cycle_id)
  where source_kind = 'cycle_started';

create or replace function private.capture_started_cycle_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare memory_id uuid; memory_version integer; summary text;
begin
  if new.status <> 'active' or not private.is_tutoria_auto_context_eligible(new.organization_id, new.created_by) then return new; end if;
  summary := format('Ciclo ativo: %s, de %s até %s (T%s).', new.title, to_char(new.starts_on, 'DD/MM/YYYY'), to_char(new.ends_on, 'DD/MM/YYYY'), new.sequence_number);
  insert into public.tutoria_member_memories (organization_id, subject_identity_id, kind, content, source_kind, source_cycle_id, confidence, state, created_by, updated_by)
  values (new.organization_id, new.created_by, 'organization_fact', summary, 'cycle_started', new.id, 100, 'active', new.created_by, new.created_by)
  on conflict (organization_id, subject_identity_id, source_kind, source_cycle_id) where source_kind = 'cycle_started' do nothing
  returning id, version into memory_id, memory_version;
  if memory_id is not null then
    insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, source_cycle_id, change_kind, changed_by)
    values (memory_id, new.organization_id, new.created_by, memory_version, 'organization_fact', summary, 100, 'active', new.id, 'created', new.created_by);
  end if;
  return new;
end;
$$;

create trigger capture_started_cycle_tutoria_context_after_insert
after insert on public.cycles for each row execute procedure private.capture_started_cycle_tutoria_context();
revoke all on function private.capture_started_cycle_tutoria_context() from public, anon, authenticated;
