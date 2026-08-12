-- RT-2.25: audit only the metadata of an AI-assisted workbench explanation.
-- Prompts, responses and structured financial values are deliberately excluded.
create type public.tutoria_workbench_analysis_outcome as enum ('served', 'unavailable', 'escalated');

create table public.tutoria_workbench_analysis_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  tool_code text not null check (tool_code ~ '^[a-z][a-z0-9_]{2,63}$'),
  provider_code text not null check (provider_code in ('netlify_ai_gateway', 'none')),
  model_code text,
  outcome public.tutoria_workbench_analysis_outcome not null,
  response_schema_valid boolean not null default false,
  duration_ms integer not null default 0 check (duration_ms between 0 and 600000),
  failure_code text check (failure_code is null or failure_code ~ '^[a-z0-9_]{1,80}$'),
  created_at timestamptz not null default now()
);

create index tutoria_workbench_analysis_scope_idx on public.tutoria_workbench_analysis_audits (organization_id, actor_identity_id, created_at desc);
alter table public.tutoria_workbench_analysis_audits enable row level security;
revoke all on public.tutoria_workbench_analysis_audits from anon;
grant select, insert on public.tutoria_workbench_analysis_audits to authenticated;

create policy "tutoria workbench analysis audit read own active scope"
on public.tutoria_workbench_analysis_audits for select to authenticated
using ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));

create policy "tutoria workbench analysis audit insert own active scope"
on public.tutoria_workbench_analysis_audits for insert to authenticated
with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
