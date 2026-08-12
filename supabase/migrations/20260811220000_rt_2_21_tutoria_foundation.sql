create type public.tutoria_context_purpose as enum ('screen_presence', 'read_member_state', 'read_methodology');
create type public.tutoria_policy_outcome as enum ('allow', 'deny', 'escalate');
create type public.tutoria_tool_name as enum ('read_member_state', 'read_methodology_map');
create type public.tutoria_tool_outcome as enum ('success', 'denied', 'failed');

create table public.tutoria_context_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  purpose public.tutoria_context_purpose not null,
  source_codes text[] not null default '{}',
  absent_fields text[] not null default '{}',
  created_at timestamptz not null default now(),
  check (cardinality(source_codes) <= 16),
  check (cardinality(absent_fields) <= 32)
);

create table public.tutoria_policy_decisions (
  id uuid primary key default gen_random_uuid(),
  context_audit_id uuid not null references public.tutoria_context_audits(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  requested_tool public.tutoria_tool_name not null,
  outcome public.tutoria_policy_outcome not null,
  reason_code text not null check (reason_code ~ '^[a-z0-9_]{3,80}$'),
  created_at timestamptz not null default now()
);

create table public.tutoria_tool_audits (
  id uuid primary key default gen_random_uuid(),
  policy_decision_id uuid not null references public.tutoria_policy_decisions(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  tool_name public.tutoria_tool_name not null,
  outcome public.tutoria_tool_outcome not null,
  result_codes text[] not null default '{}',
  duration_ms integer not null check (duration_ms >= 0 and duration_ms <= 600000),
  created_at timestamptz not null default now(),
  check (cardinality(result_codes) <= 16)
);

create index tutoria_context_audits_scope_idx on public.tutoria_context_audits (organization_id, actor_identity_id, created_at desc);
create index tutoria_policy_decisions_scope_idx on public.tutoria_policy_decisions (organization_id, actor_identity_id, created_at desc);
create index tutoria_tool_audits_scope_idx on public.tutoria_tool_audits (organization_id, actor_identity_id, created_at desc);

alter table public.tutoria_context_audits enable row level security;
alter table public.tutoria_policy_decisions enable row level security;
alter table public.tutoria_tool_audits enable row level security;

create policy "actors can read their own TutorIA context audits" on public.tutoria_context_audits for select to authenticated using ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
create policy "actors can insert their own TutorIA context audits" on public.tutoria_context_audits for insert to authenticated with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
create policy "actors can read their own TutorIA policy decisions" on public.tutoria_policy_decisions for select to authenticated using ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
create policy "actors can insert their own TutorIA policy decisions" on public.tutoria_policy_decisions for insert to authenticated with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
create policy "actors can read their own TutorIA tool audits" on public.tutoria_tool_audits for select to authenticated using ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
create policy "actors can insert their own TutorIA tool audits" on public.tutoria_tool_audits for insert to authenticated with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));

revoke all on public.tutoria_context_audits, public.tutoria_policy_decisions, public.tutoria_tool_audits from anon;
revoke all on public.tutoria_context_audits, public.tutoria_policy_decisions, public.tutoria_tool_audits from authenticated;
grant select, insert on public.tutoria_context_audits, public.tutoria_policy_decisions, public.tutoria_tool_audits to authenticated;
