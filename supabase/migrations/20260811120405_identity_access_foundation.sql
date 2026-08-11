create type public.membership_role as enum ('owner', 'member');
create type public.membership_status as enum ('active', 'revoked');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked', 'expired');

create table public.identities (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null check (email = lower(trim(email))),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index identities_email_key on public.identities (lower(email));

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  created_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references public.identities(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role public.membership_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (identity_id),
  unique (organization_id, identity_id)
);

create index memberships_organization_id_idx on public.memberships (organization_id);
create index memberships_active_identity_idx on public.memberships (identity_id) where status = 'active';

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email = lower(trim(email))),
  role public.membership_role not null default 'member',
  status public.invitation_status not null default 'pending',
  invited_by uuid not null references public.identities(id),
  expires_at timestamptz not null default (now() + interval '72 hours'),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  check (expires_at > created_at)
);

create unique index invitations_pending_email_key
  on public.invitations (organization_id, lower(email))
  where status = 'pending';

create or replace function private.is_active_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.identity_id = (select auth.uid())
      and m.status = 'active'
  );
$$;

create or replace function private.is_organization_owner(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.organization_id = target_organization_id
      and m.identity_id = (select auth.uid())
      and m.role = 'owner'
      and m.status = 'active'
  );
$$;

create or replace function private.create_identity_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.identities (id, email)
  values (new.id, lower(trim(new.email)));
  return new;
end;
$$;

create trigger create_identity_after_auth_user
  after insert on auth.users
  for each row execute procedure private.create_identity_for_auth_user();

revoke all on function private.is_active_member(uuid) from public;
revoke all on function private.is_organization_owner(uuid) from public;
revoke all on function private.create_identity_for_auth_user() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_active_member(uuid) to authenticated;
grant execute on function private.is_organization_owner(uuid) to authenticated;

alter table public.identities enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;

create policy "identity can read self"
on public.identities for select to authenticated
using ((select auth.uid()) = id);

create policy "active members can read organization"
on public.organizations for select to authenticated
using ((select private.is_active_member(id)));

create policy "members can read self and owners can read organization memberships"
on public.memberships for select to authenticated
using (
  (select auth.uid()) = identity_id
  or (select private.is_organization_owner(organization_id))
);

create policy "owners can read invitations"
on public.invitations for select to authenticated
using ((select private.is_organization_owner(organization_id)));

create policy "owners can create invitations"
on public.invitations for insert to authenticated
with check (
  (select private.is_organization_owner(organization_id))
  and invited_by = (select auth.uid())
);

create policy "owners can update invitations"
on public.invitations for update to authenticated
using ((select private.is_organization_owner(organization_id)))
with check ((select private.is_organization_owner(organization_id)));

revoke all on public.identities, public.organizations, public.memberships, public.invitations from anon;
revoke all on public.identities, public.organizations, public.memberships, public.invitations from authenticated;
grant select on public.identities, public.organizations, public.memberships to authenticated;
grant select, insert, update on public.invitations to authenticated;
