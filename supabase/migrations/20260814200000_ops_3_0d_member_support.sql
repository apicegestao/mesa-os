-- OPS-3.0D: governed, in-product member support. Tables are RPC-only.
create type public.member_support_category as enum ('tool', 'product_use', 'management_decision', 'other');
create type public.member_support_status as enum ('open', 'triage', 'in_progress', 'waiting_member', 'resolved', 'closed');

create table public.member_support_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  opened_by_identity_id uuid not null references public.identities(id) on delete restrict,
  category public.member_support_category not null,
  subject text not null check (char_length(trim(subject)) between 8 and 180),
  status public.member_support_status not null default 'open',
  assigned_to_identity_id uuid references public.identities(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  check ((status in ('resolved', 'closed')) = (resolved_at is not null))
);
create index member_support_requests_member_idx on public.member_support_requests (opened_by_identity_id, updated_at desc);
create index member_support_requests_organization_idx on public.member_support_requests (organization_id, status, updated_at desc);
create index member_support_requests_assignee_idx on public.member_support_requests (assigned_to_identity_id, status, updated_at desc) where assigned_to_identity_id is not null;

create table public.member_support_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.member_support_requests(id) on delete restrict,
  author_identity_id uuid not null references public.identities(id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index member_support_messages_request_idx on public.member_support_messages (request_id, created_at);

create table public.member_support_audit_events (
  id uuid primary key default gen_random_uuid(), request_id uuid not null references public.member_support_requests(id) on delete restrict,
  actor_identity_id uuid references public.identities(id) on delete set null,
  action text not null check (action in ('opened','read_member','read_staff','assigned','status_changed','replied')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 1024),
  occurred_at timestamptz not null default now()
);
create index member_support_audit_events_request_idx on public.member_support_audit_events (request_id, occurred_at desc);

alter table public.member_support_requests enable row level security;
alter table public.member_support_messages enable row level security;
alter table public.member_support_audit_events enable row level security;
revoke all on public.member_support_requests, public.member_support_messages, public.member_support_audit_events from anon, authenticated;
create policy "support requests deny direct access" on public.member_support_requests for all to anon, authenticated using (false) with check (false);
create policy "support messages deny direct access" on public.member_support_messages for all to anon, authenticated using (false) with check (false);
create policy "support audits deny direct access" on public.member_support_audit_events for all to anon, authenticated using (false) with check (false);

create or replace function private.has_internal_capability(target_identity_id uuid, target_capability text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case target_capability
    when 'manage_roles' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_all' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_write_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_handoff_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'handoff_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'handoff_accept_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'manage_enrollments' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'finance_catalog_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_read_all' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_proposal_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance') or private.has_internal_role(target_identity_id, 'commercial')
    when 'finance_contract_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'portfolio_manage' then private.has_internal_role(target_identity_id, 'admin')
    when 'portfolio_read_assigned' then private.has_internal_role(target_identity_id, 'concierge') or private.has_internal_role(target_identity_id, 'mentor')
    when 'support_manage_all' then private.has_internal_role(target_identity_id, 'admin')
    when 'support_answer' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge') or private.has_internal_role(target_identity_id, 'mentor')
    else false end;
$$;

create or replace function private.can_staff_access_support(target_actor_id uuid, target_request_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.has_internal_capability(target_actor_id, 'support_manage_all')
    or (private.has_internal_role(target_actor_id, 'mentor') and exists (select 1 from public.member_support_requests where id = target_request_id))
    or (private.has_internal_role(target_actor_id, 'concierge') and exists (
      select 1 from public.member_support_requests request join public.internal_portfolio_assignments assignment on assignment.organization_id = request.organization_id
      where request.id = target_request_id and assignment.assignee_identity_id = target_actor_id and assignment.kind = 'concierge' and assignment.status = 'active'
    ));
$$;

create or replace function public.open_member_support_request(target_category public.member_support_category, target_subject text, target_message text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); org_id uuid; request_id uuid;
begin
  select organization_id into org_id from public.memberships where identity_id = actor_id and status = 'active' limit 1;
  if actor_id is null or org_id is null then raise exception 'active member access required' using errcode = '42501'; end if;
  insert into public.member_support_requests (organization_id, opened_by_identity_id, category, subject) values (org_id, actor_id, target_category, trim(target_subject)) returning id into request_id;
  insert into public.member_support_messages (request_id, author_identity_id, body) values (request_id, actor_id, trim(target_message));
  insert into public.member_support_audit_events (request_id, actor_identity_id, action, metadata) values (request_id, actor_id, 'opened', jsonb_build_object('category', target_category));
  return request_id;
end; $$;

create or replace function public.get_my_member_support_workspace()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  insert into public.member_support_audit_events (request_id, actor_identity_id, action)
  select id, actor_id, 'read_member' from public.member_support_requests where opened_by_identity_id = actor_id;
  return coalesce((select jsonb_agg(jsonb_build_object('id', request.id, 'category', request.category, 'subject', request.subject, 'status', request.status, 'created_at', request.created_at, 'updated_at', request.updated_at, 'messages', coalesce((select jsonb_agg(jsonb_build_object('id', message.id, 'author_is_member', message.author_identity_id = actor_id, 'body', message.body, 'created_at', message.created_at) order by message.created_at) from public.member_support_messages message where message.request_id = request.id), '[]'::jsonb)) order by request.updated_at desc) from public.member_support_requests request where request.opened_by_identity_id = actor_id), '[]'::jsonb);
end; $$;

create or replace function public.get_my_internal_support_queue()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'support_answer') then raise exception 'internal support access required' using errcode = '42501'; end if;
  insert into public.member_support_audit_events (request_id, actor_identity_id, action)
  select request.id, actor_id, 'read_staff' from public.member_support_requests request where private.can_staff_access_support(actor_id, request.id);
  return coalesce((select jsonb_agg(jsonb_build_object('id', request.id, 'organization_id', request.organization_id, 'organization_name', organization.name, 'category', request.category, 'subject', request.subject, 'status', request.status, 'assigned_to_identity_id', request.assigned_to_identity_id, 'updated_at', request.updated_at, 'messages', coalesce((select jsonb_agg(jsonb_build_object('id', message.id, 'author_identity_id', message.author_identity_id, 'body', message.body, 'created_at', message.created_at) order by message.created_at) from public.member_support_messages message where message.request_id = request.id), '[]'::jsonb)) order by request.updated_at desc) from public.member_support_requests request join public.organizations organization on organization.id = request.organization_id where private.can_staff_access_support(actor_id, request.id)), '[]'::jsonb);
end; $$;

create or replace function public.reply_member_support_request(target_request_id uuid, target_body text, target_status public.member_support_status default null)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); request_record public.member_support_requests%rowtype;
begin
  select * into request_record from public.member_support_requests where id = target_request_id for update;
  if not found then raise exception 'support request not found' using errcode = 'P0002'; end if;
  if actor_id = request_record.opened_by_identity_id then
    if request_record.status in ('resolved', 'closed') then raise exception 'support request is closed' using errcode = '22023'; end if;
  elsif not private.can_staff_access_support(actor_id, target_request_id) then raise exception 'support access required' using errcode = '42501'; end if;
  insert into public.member_support_messages (request_id, author_identity_id, body) values (target_request_id, actor_id, trim(target_body));
  update public.member_support_requests set status = coalesce(target_status, case when actor_id = request_record.opened_by_identity_id then 'triage'::public.member_support_status else 'waiting_member'::public.member_support_status end), updated_at = now(), resolved_at = case when coalesce(target_status, request_record.status) in ('resolved', 'closed') then now() else null end where id = target_request_id;
  insert into public.member_support_audit_events (request_id, actor_identity_id, action) values (target_request_id, actor_id, 'replied');
end; $$;

revoke all on function public.open_member_support_request(public.member_support_category, text, text), public.get_my_member_support_workspace(), public.get_my_internal_support_queue(), public.reply_member_support_request(uuid, text, public.member_support_status) from public;
revoke execute on function public.open_member_support_request(public.member_support_category, text, text), public.get_my_member_support_workspace(), public.get_my_internal_support_queue(), public.reply_member_support_request(uuid, text, public.member_support_status) from anon;
grant execute on function public.open_member_support_request(public.member_support_category, text, text), public.get_my_member_support_workspace(), public.get_my_internal_support_queue(), public.reply_member_support_request(uuid, text, public.member_support_status) to authenticated;
