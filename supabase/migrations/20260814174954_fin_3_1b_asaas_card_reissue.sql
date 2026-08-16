-- FIN-3.1B: a hosted checkout can lock into one payment method. Reissue only
-- after the provider confirms cancellation; preserve a tamper-evident audit
-- fingerprint rather than retaining a stale provider session identifier.
create or replace function public.get_asaas_checkout_for_reissue(target_proposal_id uuid)
returns table (
  checkout_id uuid,
  provider_checkout_id text,
  external_reference text,
  offer_name text,
  amount numeric,
  currency_code text,
  payer_name text,
  payer_email text
)
language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;
  return query
  select checkout.id, checkout.provider_checkout_id, checkout.external_reference,
    offer.name, proposal.amount, proposal.currency_code, contact.full_name, lower(trim(contact.email))
  from public.finance_proposals proposal
  join public.finance_price_versions price on price.id = proposal.price_version_id
  join public.finance_offers offer on offer.id = price.offer_id
  join public.crm_opportunities opportunity on opportunity.id = proposal.crm_opportunity_id
  left join public.crm_contacts contact on contact.id = opportunity.primary_contact_id
  join public.finance_contracts contract on contract.proposal_id = proposal.id
  join public.finance_invoices invoice on invoice.contract_id = contract.id
  join public.finance_provider_checkouts checkout on checkout.invoice_id = invoice.id
  where proposal.id = target_proposal_id
    and checkout.provider_code = 'asaas'
    and checkout.status = 'active'
    and checkout.provider_checkout_id is not null
    and (private.has_internal_capability(actor_id, 'finance_read_all') or opportunity.owner_identity_id = actor_id);
end;
$$;

create or replace function public.release_asaas_checkout_for_reissue(
  target_checkout_id uuid,
  target_provider_checkout_id text
)
returns void
language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;
  update public.finance_provider_checkouts
  set status = 'failed', provider_checkout_id = null, checkout_link = null, expires_at = null, updated_at = now()
  where id = target_checkout_id and provider_code = 'asaas' and status = 'active'
    and provider_checkout_id = trim(target_provider_checkout_id);
  if not found then raise exception 'active checkout unavailable' using errcode = 'P0002'; end if;
  insert into public.finance_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'checkout_cancelled_for_card_reissue', 'finance_provider_checkout', target_checkout_id,
    jsonb_build_object('provider_checkout_sha256', encode(extensions.digest(trim(target_provider_checkout_id), 'sha256'), 'hex')));
end;
$$;

revoke all on function public.get_asaas_checkout_for_reissue(uuid), public.release_asaas_checkout_for_reissue(uuid, text) from public;
revoke execute on function public.get_asaas_checkout_for_reissue(uuid), public.release_asaas_checkout_for_reissue(uuid, text) from anon;
grant execute on function public.get_asaas_checkout_for_reissue(uuid), public.release_asaas_checkout_for_reissue(uuid, text) to authenticated;
