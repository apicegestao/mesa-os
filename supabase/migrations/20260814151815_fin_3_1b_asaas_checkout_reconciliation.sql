-- FIN-3.1B: provider-neutral checkout intent and Asaas Sandbox reconciliation.
-- No card, PIX key, banking data or webhook payload is persisted.

create type public.finance_provider_checkout_status as enum ('prepared', 'creating', 'active', 'failed', 'cancelled', 'expired');

create table public.finance_provider_checkouts (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null unique references public.finance_invoices(id) on delete restrict,
  provider_code text not null check (provider_code in ('asaas')),
  external_reference text not null unique check (char_length(external_reference) between 8 and 200),
  provider_checkout_id text unique check (provider_checkout_id is null or char_length(provider_checkout_id) between 2 and 160),
  checkout_link text check (checkout_link is null or char_length(checkout_link) <= 2048),
  payer_email text not null check (payer_email = lower(trim(payer_email)) and payer_email ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'),
  status public.finance_provider_checkout_status not null default 'prepared',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status in ('active', 'cancelled', 'expired')) = (provider_checkout_id is not null)),
  check ((status <> 'active') or checkout_link is not null)
);

create table public.finance_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider_code text not null check (provider_code in ('asaas')),
  provider_event_id text not null check (char_length(provider_event_id) between 2 and 200),
  event_type text not null check (event_type in ('PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PAYMENT_OVERDUE', 'PAYMENT_REFUNDED', 'PAYMENT_DELETED')),
  external_reference text not null check (char_length(external_reference) between 8 and 200),
  provider_payment_id text check (provider_payment_id is null or char_length(provider_payment_id) between 2 and 160),
  payload_sha256 text not null check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  received_at timestamptz not null default now(),
  reconciled_at timestamptz,
  disposition text not null default 'received' check (disposition in ('received', 'reconciled', 'ignored')),
  unique (provider_code, provider_event_id)
);

alter table public.finance_payment_confirmations alter column recorded_by drop not null;
alter table public.finance_payment_confirmations add column provider_event_id uuid unique references public.finance_provider_events(id) on delete restrict;
alter table public.finance_payment_confirmations add constraint finance_payment_confirmations_actor_or_provider check (recorded_by is not null or provider_event_id is not null);

create index finance_provider_events_reference_idx on public.finance_provider_events (external_reference, received_at desc);
create index finance_provider_checkouts_provider_status_idx on public.finance_provider_checkouts (provider_code, status, created_at desc);

alter table public.finance_provider_checkouts enable row level security;
alter table public.finance_provider_events enable row level security;
revoke all on public.finance_provider_checkouts, public.finance_provider_events from anon, authenticated;
create policy "finance provider checkouts deny direct access" on public.finance_provider_checkouts for all to anon, authenticated using (false) with check (false);
create policy "finance provider events deny direct access" on public.finance_provider_events for all to anon, authenticated using (false) with check (false);

create or replace function public.prepare_asaas_checkout(target_proposal_id uuid)
returns table (
  checkout_id uuid,
  external_reference text,
  offer_name text,
  amount numeric,
  currency_code text,
  payer_name text,
  payer_email text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  proposal_record record;
  contract_id uuid;
  invoice_id uuid;
  checkout_external_reference text;
  existing_checkout public.finance_provider_checkouts%rowtype;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;

  select proposal.id, proposal.amount, proposal.currency_code, proposal.status, offer.name as offer_name,
    contact.full_name as payer_name, lower(trim(contact.email)) as payer_email
  into proposal_record
  from public.finance_proposals proposal
  join public.finance_price_versions price on price.id = proposal.price_version_id
  join public.finance_offers offer on offer.id = price.offer_id
  join public.crm_opportunities opportunity on opportunity.id = proposal.crm_opportunity_id
  left join public.crm_contacts contact on contact.id = opportunity.primary_contact_id
  where proposal.id = target_proposal_id
    and proposal.status in ('draft', 'sent', 'accepted')
    and (private.has_internal_capability(actor_id, 'finance_read_all') or opportunity.owner_identity_id = actor_id);

  if not found then raise exception 'proposal access required' using errcode = '42501'; end if;
  if proposal_record.payer_email is null or proposal_record.payer_name is null then
    raise exception 'primary contact with email required for automatic access' using errcode = '22023';
  end if;

  insert into public.finance_contracts (proposal_id, status, created_by)
  values (target_proposal_id, 'draft', actor_id)
  on conflict (proposal_id) do update set updated_at = now()
  returning id into contract_id;

  select checkout.* into existing_checkout
  from public.finance_provider_checkouts checkout
  join public.finance_invoices invoice on invoice.id = checkout.invoice_id
  where invoice.contract_id = contract_id and checkout.provider_code = 'asaas'
  for update;

  if found then
    return query
      select existing_checkout.id, existing_checkout.external_reference, proposal_record.offer_name,
        proposal_record.amount, proposal_record.currency_code, proposal_record.payer_name, proposal_record.payer_email;
    return;
  end if;

  insert into public.finance_invoices (contract_id, amount, currency_code, status, created_by)
  values (contract_id, proposal_record.amount, proposal_record.currency_code, 'pending', actor_id)
  returning id into invoice_id;

  update public.finance_invoices
  set external_reference = 'mesa-fin-' || invoice_id::text, updated_at = now()
  where id = invoice_id;

  insert into public.finance_entitlements (contract_id, status, created_by)
  values (contract_id, 'pending', actor_id)
  on conflict (contract_id) do nothing;

  insert into public.finance_provider_checkouts (invoice_id, provider_code, external_reference, payer_email)
  select invoice_id, 'asaas', invoice.external_reference, proposal_record.payer_email
  from public.finance_invoices invoice where invoice.id = invoice_id
  returning id, external_reference into checkout_id, checkout_external_reference;

  update public.finance_proposals set status = 'sent', updated_at = now() where id = target_proposal_id and status = 'draft';
  insert into public.finance_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'checkout_prepared', 'finance_provider_checkout', checkout_id, jsonb_build_object('provider', 'asaas'));

  return query select checkout_id, checkout_external_reference, proposal_record.offer_name, proposal_record.amount,
    proposal_record.currency_code, proposal_record.payer_name, proposal_record.payer_email;
end;
$$;

create or replace function public.claim_asaas_checkout(target_checkout_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;
  update public.finance_provider_checkouts
  set status = 'creating', updated_at = now()
  where id = target_checkout_id and provider_code = 'asaas' and status in ('prepared', 'failed');
  return found;
end;
$$;

create or replace function public.record_asaas_checkout(
  target_checkout_id uuid,
  target_provider_checkout_id text,
  target_checkout_link text,
  target_expires_at timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;
  update public.finance_provider_checkouts
  set provider_checkout_id = trim(target_provider_checkout_id), checkout_link = trim(target_checkout_link),
    status = 'active', expires_at = target_expires_at, updated_at = now()
  where id = target_checkout_id and provider_code = 'asaas' and status = 'creating';
  if not found then raise exception 'checkout claim unavailable' using errcode = 'P0002'; end if;
end;
$$;

create or replace function public.fail_asaas_checkout(target_checkout_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'finance_contract_write') then
    raise exception 'finance access required' using errcode = '42501';
  end if;
  update public.finance_provider_checkouts set status = 'failed', updated_at = now()
  where id = target_checkout_id and provider_code = 'asaas' and status = 'creating';
end;
$$;

create or replace function public.reconcile_asaas_payment_event(
  target_provider_event_id text,
  target_event_type text,
  target_external_reference text,
  target_payment_reference text,
  target_payload_sha256 text,
  target_amount numeric default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare event_id uuid; invoice_record record; entitlement_id uuid;
begin
  -- Execution is granted only to service_role below. Browser roles cannot reach this RPC.
  insert into public.finance_provider_events (provider_code, provider_event_id, event_type, external_reference, provider_payment_id, payload_sha256)
  values ('asaas', trim(target_provider_event_id), trim(target_event_type), trim(target_external_reference), nullif(trim(target_payment_reference), ''), lower(trim(target_payload_sha256)))
  on conflict (provider_code, provider_event_id) do nothing
  returning id into event_id;
  if event_id is null then return 'duplicate'; end if;

  select invoice.id, invoice.contract_id, invoice.amount, invoice.status into invoice_record
  from public.finance_invoices invoice
  join public.finance_provider_checkouts checkout on checkout.invoice_id = invoice.id
  where invoice.external_reference = trim(target_external_reference) and checkout.provider_code = 'asaas'
  for update;
  if not found then
    update public.finance_provider_events set disposition = 'ignored', reconciled_at = now() where id = event_id;
    return 'ignored';
  end if;
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
    on conflict (contract_id) do update set status = 'eligible', eligible_from = coalesce(finance_entitlements.eligible_from, excluded.eligible_from), updated_at = now()
    returning id into entitlement_id;
  elsif target_event_type in ('PAYMENT_REFUNDED', 'PAYMENT_DELETED') then
    update public.finance_invoices set status = 'cancelled', updated_at = now() where id = invoice_record.id and status <> 'confirmed';
    update public.finance_entitlements set status = 'suspended', updated_at = now() where contract_id = invoice_record.contract_id and status = 'eligible';
  end if;

  update public.finance_provider_events set disposition = 'reconciled', reconciled_at = now() where id = event_id;
  return 'reconciled';
end;
$$;

revoke all on function public.prepare_asaas_checkout(uuid), public.claim_asaas_checkout(uuid), public.record_asaas_checkout(uuid, text, text, timestamptz), public.fail_asaas_checkout(uuid), public.reconcile_asaas_payment_event(text, text, text, text, text, numeric) from public;
revoke execute on function public.prepare_asaas_checkout(uuid), public.claim_asaas_checkout(uuid), public.record_asaas_checkout(uuid, text, text, timestamptz), public.fail_asaas_checkout(uuid), public.reconcile_asaas_payment_event(text, text, text, text, text, numeric) from anon;
grant execute on function public.prepare_asaas_checkout(uuid), public.claim_asaas_checkout(uuid), public.record_asaas_checkout(uuid, text, text, timestamptz), public.fail_asaas_checkout(uuid) to authenticated;
grant execute on function public.reconcile_asaas_payment_event(text, text, text, text, text, numeric) to service_role;
