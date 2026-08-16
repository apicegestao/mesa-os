create or replace function public.prepare_asaas_checkout(target_proposal_id uuid)
returns table (checkout_id uuid, external_reference text, offer_name text, amount numeric, currency_code text, payer_name text, payer_email text)
language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); proposal_record record; target_contract_id uuid; target_invoice_id uuid; checkout_external_reference text; existing_checkout public.finance_provider_checkouts%rowtype;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then raise exception 'finance access required' using errcode = '42501'; end if;
  select proposal.id, proposal.amount, proposal.currency_code, proposal.status, offer.name as offer_name, contact.full_name as payer_name, lower(trim(contact.email)) as payer_email into proposal_record
  from public.finance_proposals proposal join public.finance_price_versions price on price.id = proposal.price_version_id join public.finance_offers offer on offer.id = price.offer_id join public.crm_opportunities opportunity on opportunity.id = proposal.crm_opportunity_id left join public.crm_contacts contact on contact.id = opportunity.primary_contact_id
  where proposal.id = target_proposal_id and proposal.status in ('draft', 'sent', 'accepted') and (private.has_internal_capability(actor_id, 'finance_read_all') or opportunity.owner_identity_id = actor_id);
  if not found then raise exception 'proposal access required' using errcode = '42501'; end if;
  if proposal_record.payer_email is null or proposal_record.payer_name is null then raise exception 'primary contact with email required for automatic access' using errcode = '22023'; end if;
  insert into public.finance_contracts (proposal_id, status, created_by) values (target_proposal_id, 'draft', actor_id) on conflict (proposal_id) do update set updated_at = now() returning id into target_contract_id;
  select checkout.* into existing_checkout from public.finance_provider_checkouts checkout join public.finance_invoices invoice on invoice.id = checkout.invoice_id where invoice.contract_id = target_contract_id and checkout.provider_code = 'asaas' for update;
  if found then return query select existing_checkout.id, existing_checkout.external_reference, proposal_record.offer_name, proposal_record.amount, proposal_record.currency_code, proposal_record.payer_name, proposal_record.payer_email; return; end if;
  insert into public.finance_invoices (contract_id, amount, currency_code, status, created_by) values (target_contract_id, proposal_record.amount, proposal_record.currency_code, 'pending', actor_id) returning id into target_invoice_id;
  update public.finance_invoices set external_reference = 'mesa-fin-' || target_invoice_id::text, updated_at = now() where id = target_invoice_id;
  insert into public.finance_entitlements (contract_id, status, created_by) values (target_contract_id, 'pending', actor_id) on conflict (contract_id) do nothing;
  insert into public.finance_provider_checkouts (invoice_id, provider_code, external_reference, payer_email) select target_invoice_id, 'asaas', invoice.external_reference, proposal_record.payer_email from public.finance_invoices invoice where invoice.id = target_invoice_id returning id, external_reference into checkout_id, checkout_external_reference;
  update public.finance_proposals set status = 'sent', updated_at = now() where id = target_proposal_id and status = 'draft';
  insert into public.finance_audit_events (actor_identity_id, action, resource_type, resource_id, metadata) values (actor_id, 'checkout_prepared', 'finance_provider_checkout', checkout_id, jsonb_build_object('provider', 'asaas'));
  return query select checkout_id, checkout_external_reference, proposal_record.offer_name, proposal_record.amount, proposal_record.currency_code, proposal_record.payer_name, proposal_record.payer_email;
end;
$$;
