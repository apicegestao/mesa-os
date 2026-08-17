-- Production baseline: no active member should be blocked because a budget
-- policy was omitted during provisioning. The owner can still append a new
-- governed revision later; this only provides the approved initial baseline.
create or replace function private.ensure_member_ai_budget_policy_on_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status <> 'active' or new.role <> 'owner' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.organization_id::text, 2301));

  if not exists (
    select 1
    from public.ai_member_budget_policy_revisions policy
    where policy.organization_id = new.organization_id
      and policy.effective_at <= now()
  ) then
    insert into public.ai_member_budget_policy_revisions (
      organization_id,
      monthly_limit_brl_cents,
      usd_micros_per_brl,
      period_timezone,
      effective_at,
      created_by_identity_id
    ) values (
      new.organization_id,
      10000,
      180000,
      'America/Sao_Paulo',
      now(),
      new.identity_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists ensure_member_ai_budget_policy_on_owner_membership on public.memberships;
create trigger ensure_member_ai_budget_policy_on_owner_membership
after insert or update of status, role on public.memberships
for each row execute function private.ensure_member_ai_budget_policy_on_owner_membership();

-- Backfill all current organizations that already have an active owner.
insert into public.ai_member_budget_policy_revisions (
  organization_id,
  monthly_limit_brl_cents,
  usd_micros_per_brl,
  period_timezone,
  effective_at,
  created_by_identity_id
)
select
  membership.organization_id,
  10000,
  180000,
  'America/Sao_Paulo',
  now(),
  membership.identity_id
from public.memberships membership
where membership.status = 'active'
  and membership.role = 'owner'
  and not exists (
    select 1
    from public.ai_member_budget_policy_revisions policy
    where policy.organization_id = membership.organization_id
      and policy.effective_at <= now()
  );

revoke all on function private.ensure_member_ai_budget_policy_on_owner_membership() from public, anon, authenticated;
