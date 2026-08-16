create unique index finance_payment_external_reference_unique on public.finance_payment_confirmations (external_reference) where external_reference is not null;

create or replace function public.confirm_finance_payment(target_proposal_id uuid, target_due_on date default null, target_method_label text default null, target_external_reference text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); contract_id uuid; invoice_id uuid; entitlement_id uuid; proposal_record record;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then raise exception 'finance access required' using errcode = '42501'; end if;
  if exists (select 1 from public.finance_contracts contract join public.finance_invoices invoice on invoice.contract_id = contract.id join public.finance_payment_confirmations payment on payment.invoice_id = invoice.id where contract.proposal_id = target_proposal_id) then raise exception 'payment already confirmed for proposal' using errcode = '23505'; end if;
  select * into proposal_record from public.finance_proposals where id = target_proposal_id and status in ('draft', 'sent', 'accepted');
  if not found then raise exception 'active proposal required' using errcode = 'P0002'; end if;
  if target_external_reference is not null and exists (select 1 from public.finance_payment_confirmations payment where payment.external_reference = trim(target_external_reference)) then raise exception 'external payment reference already used' using errcode = '23505'; end if;
  update public.finance_proposals set status = 'accepted', updated_at = now() where id = target_proposal_id;
  insert into public.finance_contracts (proposal_id, status, starts_on, created_by) values (target_proposal_id, 'active', current_date, actor_id) on conflict (proposal_id) do update set status = 'active', updated_at = now() returning id into contract_id;
  insert into public.finance_invoices (contract_id, amount, currency_code, due_on, status, external_reference, created_by) values (contract_id, proposal_record.amount, proposal_record.currency_code, target_due_on, 'confirmed', target_external_reference, actor_id) returning id into invoice_id;
  insert into public.finance_payment_confirmations (invoice_id, amount, method_label, external_reference, recorded_by) values (invoice_id, proposal_record.amount, nullif(trim(target_method_label), ''), nullif(trim(target_external_reference), ''), actor_id);
  insert into public.finance_entitlements (contract_id, status, eligible_from, created_by) values (contract_id, 'eligible', now(), actor_id) on conflict (contract_id) do update set status = 'eligible', eligible_from = now(), updated_at = now() returning id into entitlement_id;
  insert into public.finance_audit_events (actor_identity_id, action, resource_type, resource_id, metadata) values (actor_id, 'payment_confirmed_manually', 'finance_payment_confirmation', invoice_id, jsonb_build_object('entitlement_id', entitlement_id));
  return invoice_id;
end;
$$;
revoke all on function public.confirm_finance_payment(uuid, date, text, text) from public;
revoke execute on function public.confirm_finance_payment(uuid, date, text, text) from anon;
grant execute on function public.confirm_finance_payment(uuid, date, text, text) to authenticated;
