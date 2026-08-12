-- RT-2.26L: preserve members' Terms receipt history across future document versions.

create or replace function private.list_my_mesa_os_terms_receipts()
returns table (
  receipt_id uuid,
  event public.legal_document_acceptance_event,
  occurred_at timestamptz,
  document_sha256 text,
  document_title text,
  document_version integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    acceptance.id,
    acceptance.event,
    acceptance.created_at,
    acceptance.document_sha256,
    document.title,
    document.version
  from public.legal_document_acceptances acceptance
  join public.legal_document_versions document on document.id = acceptance.document_version_id
  where acceptance.identity_id = (select auth.uid())
    and exists (
      select 1
      from public.memberships membership
      where membership.organization_id = acceptance.organization_id
        and membership.identity_id = (select auth.uid())
        and membership.status = 'active'
    )
  order by acceptance.created_at desc, acceptance.id desc
$$;

create or replace function private.get_my_mesa_os_terms_receipt(target_receipt_id uuid)
returns table (
  receipt_id uuid,
  event public.legal_document_acceptance_event,
  occurred_at timestamptz,
  document_sha256 text,
  document_title text,
  document_version integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select *
  from private.list_my_mesa_os_terms_receipts()
  where receipt_id = target_receipt_id
$$;

revoke all on function private.list_my_mesa_os_terms_receipts(), private.get_my_mesa_os_terms_receipt(uuid) from public, anon, authenticated;

create or replace function public.list_my_mesa_os_terms_receipts()
returns table (
  receipt_id uuid,
  event public.legal_document_acceptance_event,
  occurred_at timestamptz,
  document_sha256 text,
  document_title text,
  document_version integer
)
language sql
security invoker
set search_path = ''
as $$ select * from private.list_my_mesa_os_terms_receipts() $$;

create or replace function public.get_my_mesa_os_terms_receipt(target_receipt_id uuid)
returns table (
  receipt_id uuid,
  event public.legal_document_acceptance_event,
  occurred_at timestamptz,
  document_sha256 text,
  document_title text,
  document_version integer
)
language sql
security invoker
set search_path = ''
as $$ select * from private.get_my_mesa_os_terms_receipt($1) $$;

revoke all on function public.list_my_mesa_os_terms_receipts(), public.get_my_mesa_os_terms_receipt(uuid) from public, anon;
grant execute on function public.list_my_mesa_os_terms_receipts(), public.get_my_mesa_os_terms_receipt(uuid) to authenticated;
