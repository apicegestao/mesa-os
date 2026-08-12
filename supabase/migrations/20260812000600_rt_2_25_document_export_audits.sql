-- RT-2.25C: metadata-only audit for direct, non-persistent document exports.
create table public.tutoria_workbench_document_export_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_identity_id uuid not null references public.identities(id) on delete cascade,
  tool_code text not null check (tool_code ~ '^[a-z][a-z0-9_]{2,63}$'),
  format text not null check (format in ('pdf', 'xlsx')),
  outcome text not null check (outcome in ('served', 'rejected', 'failed')),
  byte_size integer check (byte_size is null or byte_size between 1 and 10485760),
  failure_code text check (failure_code is null or failure_code ~ '^[a-z0-9_]{1,80}$'),
  created_at timestamptz not null default now()
);

create index tutoria_workbench_document_export_audit_scope_idx
  on public.tutoria_workbench_document_export_audits (organization_id, actor_identity_id, created_at desc);

alter table public.tutoria_workbench_document_export_audits enable row level security;
revoke all on public.tutoria_workbench_document_export_audits from anon;
grant select, insert on public.tutoria_workbench_document_export_audits to authenticated;

create policy "document export audit read own active scope"
on public.tutoria_workbench_document_export_audits for select to authenticated
using ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));

create policy "document export audit insert own active scope"
on public.tutoria_workbench_document_export_audits for insert to authenticated
with check ((select auth.uid()) = actor_identity_id and (select private.is_active_member(organization_id)));
