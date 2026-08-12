-- RT-2.26E: versioned legal-document receipts. Automation remains disabled by default.
create type public.legal_document_status as enum ('draft', 'published', 'retired');
create type public.legal_document_acceptance_event as enum ('accepted', 'withdrawn');

create table public.legal_document_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null check (code ~ '^[a-z][a-z0-9_]{2,63}$'),
  version integer not null check (version > 0),
  status public.legal_document_status not null default 'draft',
  locale text not null default 'pt-BR' check (locale = 'pt-BR'),
  title text not null check (char_length(trim(title)) between 3 and 160),
  body_markdown text not null check (char_length(trim(body_markdown)) between 10 and 100000),
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (code, version),
  check ((status = 'published' and published_at is not null) or (status <> 'published' and published_at is null))
);
create unique index legal_document_versions_one_published_idx on public.legal_document_versions(code) where status = 'published';

create function private.prevent_legal_document_content_mutation()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if old.status <> 'draft' and (new.code, new.version, new.locale, new.title, new.body_markdown, new.content_sha256, new.published_at) is distinct from (old.code, old.version, old.locale, old.title, old.body_markdown, old.content_sha256, old.published_at) then
    raise exception 'published legal document content is immutable' using errcode = '22023';
  end if;
  if old.status = 'retired' and new.status <> 'retired' then raise exception 'retired legal document cannot be republished' using errcode = '22023'; end if;
  return new;
end;
$$;
create trigger prevent_legal_document_content_mutation before update on public.legal_document_versions for each row execute procedure private.prevent_legal_document_content_mutation();

create table public.legal_document_acceptances (
  id uuid primary key default gen_random_uuid(),
  document_version_id uuid not null references public.legal_document_versions(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  identity_id uuid not null references public.identities(id) on delete cascade,
  event public.legal_document_acceptance_event not null,
  document_sha256 text not null check (document_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create index legal_document_acceptances_subject_idx on public.legal_document_acceptances (organization_id, identity_id, document_version_id, created_at desc);

create table public.organization_tutoria_context_policies (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  automation_enabled boolean not null default false,
  legal_document_version_id uuid references public.legal_document_versions(id) on delete restrict,
  enabled_at timestamptz,
  enabled_by uuid references public.identities(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((automation_enabled = false and enabled_at is null and enabled_by is null) or (automation_enabled = true and legal_document_version_id is not null and enabled_at is not null and enabled_by is not null))
);

alter table public.legal_document_versions enable row level security;
alter table public.legal_document_acceptances enable row level security;
alter table public.organization_tutoria_context_policies enable row level security;
revoke all on public.legal_document_versions, public.legal_document_acceptances, public.organization_tutoria_context_policies from anon, authenticated;
grant select on public.legal_document_versions, public.legal_document_acceptances, public.organization_tutoria_context_policies to authenticated;

create policy "members read published legal documents" on public.legal_document_versions for select to authenticated using (status = 'published' and exists (select 1 from public.memberships m where m.identity_id = (select auth.uid()) and m.status = 'active'));
create policy "members read own legal receipts" on public.legal_document_acceptances for select to authenticated using ((select auth.uid()) = identity_id and (select private.is_active_member(organization_id)));
create policy "members read own organization context policy" on public.organization_tutoria_context_policies for select to authenticated using ((select private.is_active_member(organization_id)));

create function private.accept_legal_document_version(target_document_version_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; document_hash text; receipt_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and status = 'active';
  select content_sha256 into document_hash from public.legal_document_versions where id = target_document_version_id and status = 'published';
  if target_organization_id is null or document_hash is null then raise exception 'published document and active membership required' using errcode = '42501'; end if;
  insert into public.legal_document_acceptances (document_version_id, organization_id, identity_id, event, document_sha256)
  values (target_document_version_id, target_organization_id, actor_id, 'accepted', document_hash) returning id into receipt_id;
  return receipt_id;
end;
$$;

create function private.is_tutoria_auto_context_eligible(target_organization_id uuid, target_identity_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_tutoria_context_policies p
    where p.organization_id = target_organization_id and p.automation_enabled = true
      and (select a.event from public.legal_document_acceptances a where a.document_version_id = p.legal_document_version_id and a.organization_id = target_organization_id and a.identity_id = target_identity_id order by a.created_at desc, a.id desc limit 1) = 'accepted'
  )
$$;

revoke all on function private.accept_legal_document_version(uuid), private.is_tutoria_auto_context_eligible(uuid, uuid), private.prevent_legal_document_content_mutation() from public, anon, authenticated;
create function public.accept_legal_document_version(target_document_version_id uuid)
returns uuid language sql security invoker set search_path = '' as $$ select private.accept_legal_document_version($1) $$;
revoke all on function public.accept_legal_document_version(uuid) from public, anon;
grant execute on function public.accept_legal_document_version(uuid) to authenticated;
