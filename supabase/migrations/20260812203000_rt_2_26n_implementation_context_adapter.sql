-- RT-2.26N: derive a low-detail TutorIA fact when a canonical implementation is confirmed.

alter table public.tutoria_member_memories
  add column source_implementation_id uuid references public.mission_implementations(id) on delete restrict;
alter table public.tutoria_member_memory_revisions
  add column source_implementation_id uuid references public.mission_implementations(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_scope_check,
  add constraint tutoria_member_memories_source_scope_check check (
    (source_kind = 'member_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null)
    or (source_kind = 'diagnostic_completed' and source_execution_id is not null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is null)
    or (source_kind = 'cycle_started' and source_execution_id is null and source_cycle_id is not null and source_evidence_id is null and source_implementation_id is null)
    or (source_kind = 'evidence_approved' and source_execution_id is null and source_cycle_id is null and source_evidence_id is not null and source_implementation_id is null)
    or (source_kind = 'implementation_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null and source_implementation_id is not null)
  ),
  drop constraint tutoria_member_memories_source_kind_check,
  add constraint tutoria_member_memories_source_kind_check check (source_kind in ('member_confirmed', 'diagnostic_completed', 'cycle_started', 'evidence_approved', 'implementation_confirmed'));

alter table public.tutoria_member_memory_revisions
  add constraint tutoria_member_memory_revisions_source_implementation_scope_check
  check (source_implementation_id is null or change_kind = 'created');

create unique index tutoria_member_memories_implementation_source_key
  on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_implementation_id)
  where source_kind = 'implementation_confirmed';

create or replace function private.capture_confirmed_implementation_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare memory_id uuid; memory_version integer; summary text; mission_title text;
begin
  if new.status <> 'implemented' or (tg_op = 'UPDATE' and old.status = 'implemented') then return new; end if;
  if not private.is_tutoria_auto_context_eligible(new.organization_id, new.created_by) then return new; end if;
  select title into mission_title from public.missions where id = new.mission_id;
  summary := format('Implementação confirmada para a Missão "%s", em %s.', coalesce(mission_title, 'da jornada'), to_char(new.implemented_on, 'DD/MM/YYYY'));

  insert into public.tutoria_member_memories (
    organization_id, subject_identity_id, kind, content, source_kind, source_implementation_id,
    confidence, state, created_by, updated_by
  ) values (
    new.organization_id, new.created_by, 'organization_fact', summary, 'implementation_confirmed', new.id,
    100, 'active', new.created_by, new.created_by
  ) on conflict (organization_id, subject_identity_id, source_kind, source_implementation_id)
    where source_kind = 'implementation_confirmed' do nothing
  returning id, version into memory_id, memory_version;

  if memory_id is not null then
    insert into public.tutoria_member_memory_revisions (
      memory_id, organization_id, subject_identity_id, version, kind, content, confidence,
      state, source_implementation_id, change_kind, changed_by
    ) values (
      memory_id, new.organization_id, new.created_by, memory_version, 'organization_fact', summary, 100,
      'active', new.id, 'created', new.created_by
    );
  end if;
  return new;
end;
$$;

create trigger capture_confirmed_implementation_tutoria_context_after_write
after insert or update of status on public.mission_implementations
for each row execute procedure private.capture_confirmed_implementation_tutoria_context();

revoke all on function private.capture_confirmed_implementation_tutoria_context() from public, anon, authenticated;
