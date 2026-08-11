create table public.mission_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  mission_id uuid not null unique references public.missions(id),
  implementation_id uuid not null unique references public.mission_implementations(id),
  evidence_type text not null check (evidence_type in ('decision_example', 'operational_record', 'meeting_routine', 'observed_result')),
  description text not null check (char_length(trim(description)) between 20 and 1000),
  occurred_on date not null,
  submitted_by uuid not null references public.identities(id),
  submitted_at timestamptz not null default now()
);

create index mission_evidence_organization_id_idx on public.mission_evidence(organization_id);
create index mission_evidence_submitted_by_idx on public.mission_evidence(submitted_by);

alter table public.mission_evidence enable row level security;
create policy "owners can read organization evidence"
on public.mission_evidence for select to authenticated
using ((select private.is_active_owner(organization_id)));
revoke all on public.mission_evidence from anon, authenticated;
grant select on public.mission_evidence to authenticated;
