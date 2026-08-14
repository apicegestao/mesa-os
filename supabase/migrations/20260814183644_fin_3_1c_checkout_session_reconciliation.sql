-- Checkout payments may omit payment.externalReference. In that case, the
-- provider's checkout-session id is the authoritative reconciliation key.
drop function if exists public.reconcile_asaas_payment_event(text, text, text, text, text, numeric);

create function public.reconcile_asaas_payment_event(
  target_provider_event_id text,
  target_event_type text,
  target_external_reference text,
  target_checkout_session_id text,
  target_payment_reference text,
  target_payload_sha256 text,
  target_amount numeric default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_id uuid;
  invoice_record record;
  normalized_external_reference text;
begin
  -- Only service_role receives EXECUTE below; browser roles cannot call this RPC.
  select invoice.id, invoice.contract_id, invoice.amount, invoice.status, invoice.external_reference
    into invoice_record
  from public.finance_invoices invoice
  join public.finance_provider_checkouts checkout on checkout.invoice_id = invoice.id
  where checkout.provider_code = 'asaas'
    and (
      (nullif(trim(target_external_reference), '') is not null and invoice.external_reference = trim(target_external_reference))
      or (nullif(trim(target_checkout_session_id), '') is not null and checkout.provider_checkout_id = trim(target_checkout_session_id))
    )
  for update;

  if not found then
    return 'ignored';
  end if;

  normalized_external_reference := invoice_record.external_reference;
  insert into public.finance_provider_events (provider_code, provider_event_id, event_type, external_reference, provider_payment_id, payload_sha256)
  values ('asaas', trim(target_provider_event_id), trim(target_event_type), normalized_external_reference, nullif(trim(target_payment_reference), ''), lower(trim(target_payload_sha256)))
  on conflict (provider_code, provider_event_id) do nothing
  returning id into event_id;
  if event_id is null then return 'duplicate'; end if;

  if target_amount is not null and target_amount <> invoice_record.amount then
    raise exception 'payment amount mismatch' using errcode = '22023';
  end if;

  if target_event_type in ('PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED') then
    update public.finance_invoices set status = 'confirmed', updated_at = now() where id = invoice_record.id;
    insert into public.finance_payment_confirmations (invoice_id, amount, method_label, external_reference, recorded_by, provider_event_id)
    values (invoice_record.id, invoice_record.amount, 'asaas', nullif(trim(target_payment_reference), ''), null, event_id)
    on conflict (invoice_id) do nothing;
    update public.finance_contracts set status = 'active', starts_on = coalesce(starts_on, current_date), updated_at = now() where id = invoice_record.contract_id;
    insert into public.finance_entitlements (contract_id, status, eligible_from, created_by)
    select invoice_record.contract_id, 'eligible', now(), contract.created_by from public.finance_contracts contract where contract.id = invoice_record.contract_id
    on conflict (contract_id) do update set status = 'eligible', eligible_from = coalesce(finance_entitlements.eligible_from, excluded.eligible_from), updated_at = now();
  elsif target_event_type in ('PAYMENT_REFUNDED', 'PAYMENT_DELETED') then
    update public.finance_invoices set status = 'cancelled', updated_at = now() where id = invoice_record.id and status <> 'confirmed';
    update public.finance_entitlements set status = 'suspended', updated_at = now() where contract_id = invoice_record.contract_id and status = 'eligible';
  end if;

  update public.finance_provider_events set disposition = 'reconciled', reconciled_at = now() where id = event_id;
  return 'reconciled';
end;
$$;

revoke all on function public.reconcile_asaas_payment_event(text, text, text, text, text, text, numeric) from public, anon, authenticated;
grant execute on function public.reconcile_asaas_payment_event(text, text, text, text, text, text, numeric) to service_role;
