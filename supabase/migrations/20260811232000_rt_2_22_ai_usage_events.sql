create type public.ai_usage_resolution as enum ('served', 'unavailable', 'escalated');

create table public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  capability_code text not null check (capability_code ~ '^[a-z0-9_]{1,80}$'),
  model_route_code text not null check (model_route_code in ('gemini_flash', 'gpt5_mini', 'claude_haiku')),
  resolution public.ai_usage_resolution not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  estimated_cost_usd_micros bigint not null default 0 check (estimated_cost_usd_micros >= 0),
  created_at timestamptz not null default now()
);

create index ai_usage_events_internal_metrics_idx on public.ai_usage_events (organization_id, capability_code, resolution, created_at desc);
create index ai_usage_events_actor_idx on public.ai_usage_events (actor_identity_id, created_at desc);
alter table public.ai_usage_events enable row level security;
revoke all on public.ai_usage_events from anon, authenticated;
grant insert on public.ai_usage_events to authenticated;
create policy "ai usage events insert own active scope"
on public.ai_usage_events for insert to authenticated
with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
