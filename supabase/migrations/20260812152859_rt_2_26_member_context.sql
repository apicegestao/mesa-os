-- RT-2.26: explicit, member-confirmed longitudinal context. Raw chat is excluded.
create type public.tutoria_memory_kind as enum ('organization_fact', 'decision', 'commitment', 'learning_gap', 'guidance_preference');
create type public.tutoria_memory_state as enum ('active', 'contested', 'superseded', 'expired');

create table public.tutoria_member_memories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subject_identity_id uuid not null references public.identities(id) on delete cascade,
  kind public.tutoria_memory_kind not null,
  content text not null check (char_length(trim(content)) between 3 and 2000),
  source_kind text not null default 'member_confirmed' check (source_kind = 'member_confirmed'),
  confidence smallint not null default 100 check (confidence between 1 and 100),
  state public.tutoria_memory_state not null default 'active',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  version integer not null default 1 check (version > 0),
  created_by uuid not null references public.identities(id) on delete restrict,
  updated_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from),
  unique (id, organization_id)
);

create table public.tutoria_member_memory_revisions (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.tutoria_member_memories(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subject_identity_id uuid not null references public.identities(id) on delete cascade,
  version integer not null check (version > 0),
  kind public.tutoria_memory_kind not null,
  content text not null check (char_length(trim(content)) between 3 and 2000),
  confidence smallint not null check (confidence between 1 and 100),
  state public.tutoria_memory_state not null,
  valid_until timestamptz,
  change_kind text not null check (change_kind in ('created', 'updated', 'invalidated')),
  changed_by uuid not null references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (memory_id, version)
);

create index tutoria_member_memories_active_scope_idx on public.tutoria_member_memories (organization_id, subject_identity_id, updated_at desc) where state = 'active';
create index tutoria_member_memory_revisions_scope_idx on public.tutoria_member_memory_revisions (organization_id, subject_identity_id, memory_id, version desc);

alter table public.tutoria_member_memories enable row level security;
alter table public.tutoria_member_memory_revisions enable row level security;
revoke all on public.tutoria_member_memories, public.tutoria_member_memory_revisions from anon, authenticated;
grant select on public.tutoria_member_memories, public.tutoria_member_memory_revisions to authenticated;

create policy "members read own TutorIA memories" on public.tutoria_member_memories for select to authenticated
using ((select auth.uid()) = subject_identity_id and (select private.is_active_member(organization_id)));
create policy "members read own TutorIA memory revisions" on public.tutoria_member_memory_revisions for select to authenticated
using ((select auth.uid()) = subject_identity_id and (select private.is_active_member(organization_id)));

create function private.save_my_tutoria_memory(target_memory_id uuid, submitted_kind public.tutoria_memory_kind, submitted_content text, submitted_confidence smallint, submitted_valid_until timestamptz)
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
  where id = target_memory_id and organization_id = target_organization_id and subject_identity_id = actor_id
  returning id, version, valid_from into saved_id, next_version, saved_valid_from;
  if saved_id is null then raise exception 'memory unavailable' using errcode = '42501'; end if;
  if submitted_valid_until is not null and submitted_valid_until <= saved_valid_from then raise exception 'invalid memory validity' using errcode = '22023'; end if;
  insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, valid_until, change_kind, changed_by)
  values (saved_id, target_organization_id, actor_id, next_version, submitted_kind, trim(submitted_content), submitted_confidence, 'active', submitted_valid_until, 'updated', actor_id);
  return saved_id;
end;
$$;

create function private.invalidate_my_tutoria_memory(target_memory_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; saved record;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and status = 'active';
  update public.tutoria_member_memories set state = 'expired', valid_until = now(), version = version + 1, updated_by = actor_id, updated_at = now()
  where id = target_memory_id and organization_id = target_organization_id and subject_identity_id = actor_id returning * into saved;
  if saved.id is null then raise exception 'memory unavailable' using errcode = '42501'; end if;
  insert into public.tutoria_member_memory_revisions (memory_id, organization_id, subject_identity_id, version, kind, content, confidence, state, valid_until, change_kind, changed_by)
  values (saved.id, saved.organization_id, saved.subject_identity_id, saved.version, saved.kind, saved.content, saved.confidence, saved.state, saved.valid_until, 'invalidated', actor_id);
end;
$$;

revoke all on function private.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz), private.invalidate_my_tutoria_memory(uuid) from public, anon, authenticated;
create function public.save_my_tutoria_memory(target_memory_id uuid, submitted_kind public.tutoria_memory_kind, submitted_content text, submitted_confidence smallint, submitted_valid_until timestamptz)
returns uuid language sql security invoker set search_path = '' as $$ select private.save_my_tutoria_memory($1, $2, $3, $4, $5) $$;
create function public.invalidate_my_tutoria_memory(target_memory_id uuid)
returns void language sql security invoker set search_path = '' as $$ select private.invalidate_my_tutoria_memory($1) $$;
revoke all on function public.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz), public.invalidate_my_tutoria_memory(uuid) from public, anon;
grant execute on function public.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz), public.invalidate_my_tutoria_memory(uuid) to authenticated;
