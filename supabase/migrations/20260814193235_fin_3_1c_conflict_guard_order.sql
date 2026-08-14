-- Replace the service-only function so conflict detection precedes organization creation.
create or replace function public.prepare_finance_access_provisioning(target_checkout_session_id text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare account_record record; target_organization_id uuid; target_enrollment_id uuid;
begin
  if (select auth.role()) <> 'service_role' then raise exception 'service role required' using errcode = '42501'; end if;
  select account.id account_id, account.name, account.organization_id, checkout.payer_email, contract.created_by into account_record from public.finance_provider_checkouts checkout join public.finance_invoices invoice on invoice.id=checkout.invoice_id and invoice.status='confirmed' join public.finance_contracts contract on contract.id=invoice.contract_id and contract.status='active' join public.finance_proposals proposal on proposal.id=contract.proposal_id join public.crm_opportunities opportunity on opportunity.id=proposal.crm_opportunity_id join public.crm_accounts account on account.id=opportunity.account_id where checkout.provider_code='asaas' and checkout.provider_checkout_id=trim(target_checkout_session_id) for update of account;
  if not found then return null; end if;
  target_organization_id := account_record.organization_id;
  if exists(select 1 from public.memberships m join public.identities i on i.id=m.identity_id where i.email=account_record.payer_email and (target_organization_id is null or m.organization_id<>target_organization_id)) then insert into public.finance_audit_events(actor_identity_id,action,resource_type,resource_id,metadata) values(account_record.created_by,'access_provisioning_conflict','crm_account',account_record.account_id,jsonb_build_object('reason','identity_organization_conflict')); return null; end if;
  if target_organization_id is null then insert into public.organizations(name) values(account_record.name) returning id into target_organization_id; update public.crm_accounts set organization_id=target_organization_id, updated_at=now() where id=account_record.account_id and organization_id is null; end if;
  select id into target_enrollment_id from public.access_enrollments where organization_id=target_organization_id and email=account_record.payer_email and status in ('pending','provisioned') order by created_at desc limit 1;
  if target_enrollment_id is not null then return target_enrollment_id; end if;
  insert into public.access_enrollments(organization_id,email,role,status,expires_at,created_by) values(target_organization_id,account_record.payer_email,'owner','pending',now()+interval '72 hours',account_record.created_by) returning id into target_enrollment_id;
  insert into public.access_enrollment_audits(enrollment_id,event,actor_identity_id,metadata) values(target_enrollment_id,'created',account_record.created_by,jsonb_build_object('source','finance'));
  return target_enrollment_id;
end; $$;
