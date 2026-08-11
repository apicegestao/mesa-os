create index ai_budget_reservations_actor_idx on public.ai_budget_reservations (actor_identity_id);
create index ai_budget_reservations_policy_idx on public.ai_budget_reservations (policy_revision_id);
create index ai_member_budget_policy_created_by_idx on public.ai_member_budget_policy_revisions (created_by_identity_id);
create index ai_internal_budget_policy_created_by_idx on public.ai_internal_budget_policy_revisions (created_by_identity_id);

create policy "member AI budget reservations are internal only"
on public.ai_budget_reservations as restrictive for all to authenticated
using (false)
with check (false);

create policy "internal AI budget policy revisions are internal only"
on public.ai_internal_budget_policy_revisions as restrictive for all to authenticated
using (false)
with check (false);

create or replace function private.reserve_tutoria_member_budget(
  requested_capability_code text,
  maximum_cost_usd_micros bigint
)
returns table (reservation_id uuid, allowed boolean, denial_code text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_actor_id uuid := auth.uid();
  current_organization_id uuid;
  current_policy public.ai_member_budget_policy_revisions%rowtype;
  current_period_start timestamptz;
  maximum_period_cost_usd_micros bigint;
  committed_cost_usd_micros bigint;
  created_reservation_id uuid;
begin
  if current_actor_id is null or maximum_cost_usd_micros <= 0 or requested_capability_code !~ '^[a-z0-9_]{1,80}$' then
    return query select null::uuid, false, 'invalid_request';
    return;
  end if;
  select m.organization_id into current_organization_id from public.memberships m where m.identity_id = current_actor_id and m.status = 'active';
  if current_organization_id is null then return query select null::uuid, false, 'active_membership_required'; return; end if;
  perform pg_advisory_xact_lock(hashtextextended(current_organization_id::text || ':' || current_actor_id::text, 0));
  select p.* into current_policy from public.ai_member_budget_policy_revisions p where p.organization_id = current_organization_id and p.effective_at <= now() order by p.effective_at desc limit 1;
  if current_policy.id is null then return query select null::uuid, false, 'budget_policy_missing'; return; end if;
  current_period_start := date_trunc('month', now() at time zone current_policy.period_timezone) at time zone current_policy.period_timezone;
  maximum_period_cost_usd_micros := (current_policy.monthly_limit_brl_cents::bigint * current_policy.usd_micros_per_brl::bigint) / 100;
  select coalesce(sum(case when r.status = 'reserved' then r.reserved_cost_usd_micros else r.charged_cost_usd_micros end), 0) into committed_cost_usd_micros
  from public.ai_budget_reservations r where r.organization_id = current_organization_id and r.actor_identity_id = current_actor_id and r.period_start = current_period_start and r.status in ('reserved', 'settled');
  if committed_cost_usd_micros + maximum_cost_usd_micros > maximum_period_cost_usd_micros then return query select null::uuid, false, 'member_budget_exhausted'; return; end if;
  insert into public.ai_budget_reservations (organization_id, actor_identity_id, policy_revision_id, capability_code, period_start, reserved_cost_usd_micros)
  values (current_organization_id, current_actor_id, current_policy.id, requested_capability_code, current_period_start, maximum_cost_usd_micros) returning id into created_reservation_id;
  return query select created_reservation_id, true, null::text;
end;
$$;

create or replace function private.settle_tutoria_member_budget(target_reservation_id uuid, observed_cost_usd_micros bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_actor_id uuid := auth.uid();
  reservation_row public.ai_budget_reservations%rowtype;
begin
  if current_actor_id is null or observed_cost_usd_micros < 0 then return false; end if;
  select r.* into reservation_row from public.ai_budget_reservations r where r.id = target_reservation_id and r.actor_identity_id = current_actor_id for update;
  if reservation_row.id is null or reservation_row.status <> 'reserved' or observed_cost_usd_micros > reservation_row.reserved_cost_usd_micros then return false; end if;
  update public.ai_budget_reservations set status = case when observed_cost_usd_micros = 0 then 'released'::public.ai_budget_reservation_status else 'settled'::public.ai_budget_reservation_status end, charged_cost_usd_micros = observed_cost_usd_micros, settled_at = now() where id = reservation_row.id;
  return true;
end;
$$;

create or replace function public.reserve_tutoria_member_budget(requested_capability_code text, maximum_cost_usd_micros bigint)
returns table (reservation_id uuid, allowed boolean, denial_code text)
language sql
security invoker
set search_path = ''
as $$ select * from private.reserve_tutoria_member_budget($1, $2); $$;

create or replace function public.settle_tutoria_member_budget(target_reservation_id uuid, observed_cost_usd_micros bigint)
returns boolean
language sql
security invoker
set search_path = ''
as $$ select private.settle_tutoria_member_budget($1, $2); $$;

revoke all on function private.reserve_tutoria_member_budget(text, bigint) from public, anon;
revoke all on function private.settle_tutoria_member_budget(uuid, bigint) from public, anon;
grant execute on function private.reserve_tutoria_member_budget(text, bigint) to authenticated;
grant execute on function private.settle_tutoria_member_budget(uuid, bigint) to authenticated;
