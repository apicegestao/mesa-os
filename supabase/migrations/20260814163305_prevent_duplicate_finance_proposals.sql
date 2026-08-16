-- FIN-3.1B repair: a retry after a completed browser request must reuse the
-- current proposal rather than create a second checkout candidate.
create or replace function public.create_finance_proposal(
  target_crm_opportunity_id uuid,
  target_price_version_id uuid,
  target_expires_on date default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  proposal_id uuid;
  price_record record;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_proposal_create') then
    raise exception 'finance proposal access required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.crm_opportunities opportunity
    where opportunity.id = target_crm_opportunity_id
      and (private.has_internal_capability(actor_id, 'finance_read_all') or opportunity.owner_identity_id = actor_id)
  ) then
    raise exception 'opportunity access required' using errcode = '42501';
  end if;

  -- Serialize proposal creation for one opportunity before checking whether a
  -- current proposal already exists. This protects concurrent retries too.
  perform 1 from public.crm_opportunities
  where id = target_crm_opportunity_id
  for update;

  select id into proposal_id
  from public.finance_proposals
  where crm_opportunity_id = target_crm_opportunity_id
    and price_version_id = target_price_version_id
    and status in ('draft', 'sent', 'accepted')
  order by created_at desc
  limit 1;

  if proposal_id is not null then
    return proposal_id;
  end if;

  select amount, currency_code into price_record
  from public.finance_price_versions
  where id = target_price_version_id and status = 'active';

  if not found then
    raise exception 'active price version required' using errcode = 'P0002';
  end if;

  insert into public.finance_proposals (
    crm_opportunity_id, price_version_id, amount, currency_code, expires_on, created_by
  ) values (
    target_crm_opportunity_id, target_price_version_id, price_record.amount,
    price_record.currency_code, target_expires_on, actor_id
  ) returning id into proposal_id;

  insert into public.finance_audit_events (
    actor_identity_id, action, resource_type, resource_id
  ) values (
    actor_id, 'proposal_created', 'finance_proposal', proposal_id
  );

  return proposal_id;
end;
$$;

revoke all on function public.create_finance_proposal(uuid, uuid, date) from public;
revoke execute on function public.create_finance_proposal(uuid, uuid, date) from anon;
grant execute on function public.create_finance_proposal(uuid, uuid, date) to authenticated;
