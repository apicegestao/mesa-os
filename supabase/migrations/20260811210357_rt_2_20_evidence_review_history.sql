-- RT-2.20 / EVR: evidence history is append-only and reviewable.
alter table public.mission_evidence add column revision_number integer;
alter table public.mission_evidence add column root_evidence_id uuid;
alter table public.mission_evidence add column supersedes_evidence_id uuid references public.mission_evidence(id);

update public.mission_evidence
set revision_number = 1, root_evidence_id = id;

alter table public.mission_evidence alter column revision_number set not null;
alter table public.mission_evidence alter column root_evidence_id set not null;
alter table public.mission_evidence add constraint mission_evidence_revision_number_check check (revision_number > 0);
alter table public.mission_evidence add constraint mission_evidence_root_evidence_id_fkey foreign key (root_evidence_id) references public.mission_evidence(id);

alter table public.mission_evidence drop constraint if exists mission_evidence_mission_id_key;
alter table public.mission_evidence drop constraint if exists mission_evidence_implementation_id_key;
alter table public.mission_evidence add constraint mission_evidence_mission_revision_key unique (mission_id, revision_number);
create index mission_evidence_root_revision_idx on public.mission_evidence(root_evidence_id, revision_number desc);
create index mission_evidence_supersedes_idx on public.mission_evidence(supersedes_evidence_id) where supersedes_evidence_id is not null;
create index mission_evidence_implementation_idx on public.mission_evidence(implementation_id);

create table public.evidence_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  evidence_id uuid not null references public.mission_evidence(id),
  review_sequence integer not null check (review_sequence > 0),
  reviewer_kind text not null check (reviewer_kind in ('tutoria', 'human', 'system')),
  reviewer_identity_id uuid references public.identities(id),
  outcome text not null check (outcome in ('approved', 'changes_requested', 'escalated')),
  confidence numeric(4,3),
  rationale text not null check (char_length(trim(rationale)) between 10 and 2000),
  policy_code text not null,
  escalation_reason text,
  model_reference text,
  created_at timestamptz not null default now(),
  unique (evidence_id, review_sequence),
  constraint evidence_reviews_reviewer_identity_check check (
    (reviewer_kind = 'human' and reviewer_identity_id is not null)
    or (reviewer_kind in ('tutoria', 'system') and reviewer_identity_id is null)
  ),
  constraint evidence_reviews_tutoria_confidence_check check (
    reviewer_kind <> 'tutoria' or confidence is not null
  ),
  constraint evidence_reviews_confidence_check check (confidence is null or confidence between 0 and 1),
  constraint evidence_reviews_escalation_check check (
    (outcome = 'escalated' and char_length(trim(escalation_reason)) >= 10)
    or (outcome <> 'escalated' and escalation_reason is null)
  )
);
create index evidence_reviews_organization_created_idx on public.evidence_reviews(organization_id, created_at desc);
create index evidence_reviews_reviewer_identity_idx on public.evidence_reviews(reviewer_identity_id) where reviewer_identity_id is not null;

alter table public.evidence_reviews enable row level security;
create policy evidence_reviews_owner_read on public.evidence_reviews for select to authenticated using (private.is_active_owner(organization_id));
revoke all on table public.evidence_reviews from anon, authenticated;
grant select on table public.evidence_reviews to authenticated;

create or replace function private.reject_immutable_evidence_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'evidence history is immutable' using errcode = '55000';
end;
$$;

create trigger mission_evidence_immutable before update or delete on public.mission_evidence
for each row execute function private.reject_immutable_evidence_change();
create trigger evidence_reviews_immutable before update or delete on public.evidence_reviews
for each row execute function private.reject_immutable_evidence_change();

create view public.current_evidence_status with (security_invoker = true) as
select
  evidence.id,
  evidence.organization_id,
  evidence.mission_id,
  evidence.implementation_id,
  evidence.root_evidence_id,
  evidence.revision_number,
  evidence.evidence_type,
  evidence.description,
  evidence.occurred_on,
  evidence.submitted_at,
  evidence.submitted_by,
  coalesce(latest_review.outcome, 'submitted') as review_status,
  latest_review.reviewer_kind,
  latest_review.confidence,
  latest_review.rationale as review_rationale,
  latest_review.created_at as reviewed_at
from public.mission_evidence evidence
left join lateral (
  select review.*
  from public.evidence_reviews review
  where review.evidence_id = evidence.id
  order by review.review_sequence desc, review.created_at desc
  limit 1
) latest_review on true
where not exists (
  select 1
  from public.mission_evidence newer
  where newer.root_evidence_id = evidence.root_evidence_id
    and newer.revision_number > evidence.revision_number
);
revoke all on public.current_evidence_status from anon, authenticated;
grant select on public.current_evidence_status to authenticated;

create or replace function public.submit_evidence_revision(
  target_evidence_id uuid,
  submitted_evidence_type text,
  evidence_description text,
  evidence_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  base public.mission_evidence%rowtype;
  latest public.mission_evidence%rowtype;
  implementation_date date;
  latest_outcome text;
  next_evidence_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select * into base
  from public.mission_evidence
  where id = target_evidence_id
    and private.is_active_owner(organization_id)
  for update;
  if base.id is null then
    raise exception 'evidence not found' using errcode = '42501';
  end if;

  select * into latest
  from public.mission_evidence
  where root_evidence_id = base.root_evidence_id
  order by revision_number desc
  limit 1
  for update;
  select outcome into latest_outcome
  from public.evidence_reviews
  where evidence_id = latest.id
  order by review_sequence desc
  limit 1;
  if latest_outcome <> 'changes_requested' then
    raise exception 'latest evidence does not require correction' using errcode = '22023';
  end if;
  if submitted_evidence_type not in ('decision_example', 'operational_record', 'meeting_routine', 'observed_result')
    or char_length(trim(evidence_description)) not between 20 and 1000
    then
    raise exception 'invalid evidence revision' using errcode = '22023';
  end if;
  select implemented_on into implementation_date
  from public.mission_implementations
  where id = latest.implementation_id;
  if evidence_date < implementation_date or evidence_date > current_date then
    raise exception 'invalid evidence date' using errcode = '22023';
  end if;

  insert into public.mission_evidence (
    organization_id, mission_id, implementation_id, evidence_type, description,
    occurred_on, submitted_by, revision_number, root_evidence_id, supersedes_evidence_id
  ) values (
    latest.organization_id, latest.mission_id, latest.implementation_id, submitted_evidence_type,
    trim(evidence_description), evidence_date, actor_id, latest.revision_number + 1,
    latest.root_evidence_id, latest.id
  ) returning id into next_evidence_id;

  return next_evidence_id;
end;
$$;
revoke all on function public.submit_evidence_revision(uuid, text, text, date) from public, anon;
grant execute on function public.submit_evidence_revision(uuid, text, text, date) to authenticated;
