-- RT-2.26P: only member-confirmed memories may be edited by a member.

create or replace function private.save_my_tutoria_memory(target_memory_id uuid, submitted_kind public.tutoria_memory_kind, submitted_content text, submitted_confidence smallint, submitted_valid_until timestamptz)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; saved_id uuid; next_version integer; saved_valid_from timestamptz;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if char_length(trim(coalesce(submitted_content, ''))) not between 3 and 2000 or submitted_confidence not between 1 and 100 then raise exception 'invalid memory payload' using errcode = '22023'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and status = 'active';
  if target_organization_id is null then raise exception 'active membership required' using errcode = '42501'; end if;
  if target_memory_id is null then
    insert into public.tutoria_member_memories (organization_id, subject_identity_id, kind, content, confidence, state, valid_until, created_by, updated_by)
    values (target_organization_id, actor_id, submitted_kind, trim(submitted_content), submitted_confidence, 'active', submitted_valid_until, actor_id, actor_id) returning id, version, valid_from into saved_id, next_version, saved_valid_from;
    insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, valid_until, change_kind, changed_by)
    values (saved_id, target_organization_id, actor_id, next_version, submitted_kind, trim(submitted_content), submitted_confidence, 'active', submitted_valid_until, 'created', actor_id);
    return saved_id;
  end if;
  update public.tutoria_member_memories set kind = submitted_kind, content = trim(submitted_content), confidence = submitted_confidence, state = 'active', valid_until = submitted_valid_until, version = version + 1, updated_by = actor_id, updated_at = now()
  where id = target_memory_id and organization_id = target_organization_id and subject_identity_id = actor_id and source_kind = 'member_confirmed'
  returning id, version, valid_from into saved_id, next_version, saved_valid_from;
  if saved_id is null then raise exception 'only member-confirmed memories can be edited' using errcode = '42501'; end if;
  if submitted_valid_until is not null and submitted_valid_until <= saved_valid_from then raise exception 'invalid memory validity' using errcode = '22023'; end if;
  insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, valid_until, change_kind, changed_by)
  values (saved_id, target_organization_id, actor_id, next_version, submitted_kind, trim(submitted_content), submitted_confidence, 'active', submitted_valid_until, 'updated', actor_id);
  return saved_id;
end;
$$;
revoke all on function private.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz) from public, anon, authenticated;
