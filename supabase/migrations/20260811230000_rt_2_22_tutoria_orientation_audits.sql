create type public.tutoria_orientation_objective as enum ('understand_next_step', 'understand_methodology');
create type public.tutoria_orientation_outcome as enum ('served', 'unavailable', 'escalated');

create table public.tutoria_orientation_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  objective public.tutoria_orientation_objective not null,
  policy_decision_id uuid references public.tutoria_policy_decisions(id) on delete restrict,
  provider_code text not null check (provider_code in ('netlify_ai_gateway', 'none')),
  model_code text,
  outcome public.tutoria_orientation_outcome not null,
  response_schema_valid boolean not null default false,
  duration_ms integer not null default 0 check (duration_ms between 0 and 600000),
  input_token_estimate integer check (input_token_estimate is null or input_token_estimate >= 0),
  output_token_estimate integer check (output_token_estimate is null or output_token_estimate >= 0),
  failure_code text check (failure_code is null or failure_code ~ '^[a-z0-9_]{1,80}$'),
  created_at timestamptz not null default now()
);

create index tutoria_orientation_audits_scope_idx
  on public.tutoria_orientation_audits (organization_id, actor_identity_id, created_at desc);
create index tutoria_orientation_audits_policy_decision_idx
  on public.tutoria_orientation_audits (policy_decision_id);
create index tutoria_orientation_audits_actor_identity_idx
  on public.tutoria_orientation_audits (actor_identity_id);

alter table public.tutoria_orientation_audits enable row level security;
revoke all on public.tutoria_orientation_audits from anon;
grant select, insert on public.tutoria_orientation_audits to authenticated;

create policy "tutoria orientation audits select own active scope"
on public.tutoria_orientation_audits for select to authenticated
using (
  (select auth.uid()) = actor_identity_id
  and (select private.is_active_member(organization_id))
);

create policy "tutoria orientation audits insert own active scope"
on public.tutoria_orientation_audits for insert to authenticated
with check (
  (select auth.uid()) = actor_identity_id
  and (select private.is_active_member(organization_id))
);
