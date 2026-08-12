-- RT-2.26M: derive a low-detail TutorIA fact only after canonical evidence approval.

alter table public.tutoria_member_memories
  add column source_evidence_id uuid references public.mission_evidence(id) on delete restrict;
alter table public.tutoria_member_memory_revisions
  add column source_evidence_id uuid references public.mission_evidence(id) on delete restrict;

alter table public.tutoria_member_memories
  drop constraint tutoria_member_memories_source_kind_check,
  drop constraint tutoria_member_memories_source_scope_check,
  add constraint tutoria_member_memories_source_kind_check check (source_kind in ('member_confirmed', 'diagnostic_completed', 'cycle_started', 'evidence_approved')),
  add constraint tutoria_member_memories_source_scope_check check (
    (source_kind = 'member_confirmed' and source_execution_id is null and source_cycle_id is null and source_evidence_id is null)
    or (source_kind = 'diagnostic_completed' and source_execution_id is not null and source_cycle_id is null and source_evidence_id is null)
    or (source_kind = 'cycle_started' and source_execution_id is null and source_cycle_id is not null and source_evidence_id is null)
    or (source_kind = 'evidence_approved' and source_execution_id is null and source_cycle_id is null and source_evidence_id is not null)
  );

alter table public.tutoria_member_memory_revisions
  add constraint tutoria_member_memory_revisions_source_evidence_scope_check
  check (source_evidence_id is null or change_kind in ('created', 'updated', 'invalidated'));

create unique index tutoria_member_memories_evidence_source_key
  on public.tutoria_member_memories (organization_id, subject_identity_id, source_kind, source_evidence_id)
  where source_kind = 'evidence_approved';

create or replace function private.capture_reviewed_evidence_tutoria_context()
returns trigger language plpgsql security definer set search_path = '' as $$
declare source record; memory_id uuid; memory_version integer; summary text; memory_record record;
begin
  select evidence.organization_id, evidence.id as evidence_id, evidence.submitted_by, evidence.occurred_on, mission.title as mission_title
  into source
  from public.mission_evidence evidence
  join public.missions mission on mission.id = evidence.mission_id
  where evidence.id = new.evidence_id;
  if source.evidence_id is null or not private.is_tutoria_auto_context_eligible(source.organization_id, source.submitted_by) then return new; end if;

  if new.outcome = 'approved' then
    summary := format('Evidência aprovada para a Missão "%s", registrada em %s.', source.mission_title, to_char(source.occurred_on, 'DD/MM/YYYY'));
    insert into public.tutoria_member_memories (
      organization_id, subject_identity_id, kind, content, source_kind, source_evidence_id,
      confidence, state, valid_until, created_by, updated_by
    ) values (
      source.organization_id, source.submitted_by, 'organization_fact', summary, 'evidence_approved', source.evidence_id,
      100, 'active', null, source.submitted_by, source.submitted_by
    ) on conflict (organization_id, subject_identity_id, source_kind, source_evidence_id)
      where source_kind = 'evidence_approved'
      do update set content = excluded.content, confidence = excluded.confidence, state = 'active', valid_until = null,
        version = public.tutoria_member_memories.version + 1, updated_by = excluded.updated_by, updated_at = now()
    returning id, version into memory_id, memory_version;

    insert into public.tutoria_member_memory_revisions (
      memory_id, organization_id, subject_identity_id, version, kind, content, confidence,
      state, source_evidence_id, change_kind, changed_by
    ) values (
      memory_id, source.organization_id, source.submitted_by, memory_version, 'organization_fact', summary, 100,
      'active', source.evidence_id, case when memory_version = 1 then 'created' else 'updated' end, source.submitted_by
    );
  elsif new.outcome in ('changes_requested', 'escalated') then
    update public.tutoria_member_memories
    set state = 'expired', valid_until = now(), version = version + 1, updated_by = source.submitted_by, updated_at = now()
    where organization_id = source.organization_id and subject_identity_id = source.submitted_by
      and source_kind = 'evidence_approved' and source_evidence_id = source.evidence_id and state = 'active'
    returning * into memory_record;
    if memory_record.id is not null then
      insert into public.tutoria_member_memory_revisions (
        memory_id, organization_id, subject_identity_id, version, kind, content, confidence,
        state, valid_until, source_evidence_id, change_kind, changed_by
      ) values (
        memory_record.id, memory_record.organization_id, memory_record.subject_identity_id, memory_record.version, memory_record.kind, memory_record.content, memory_record.confidence,
        memory_record.state, memory_record.valid_until, source.evidence_id, 'invalidated', source.submitted_by
      );
    end if;
  end if;
  return new;
end;
$$;

create trigger capture_reviewed_evidence_tutoria_context_after_insert
after insert on public.evidence_reviews for each row execute procedure private.capture_reviewed_evidence_tutoria_context();

revoke all on function private.capture_reviewed_evidence_tutoria_context() from public, anon, authenticated;
