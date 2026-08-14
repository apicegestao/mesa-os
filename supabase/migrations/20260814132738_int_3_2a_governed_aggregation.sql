-- INT-3.2A: deterministic, coarsened aggregate intelligence. No model or member-level data.
create type public.intelligence_proposal_status as enum ('draft', 'reviewed', 'accepted', 'rejected');

create table public.intelligence_aggregate_snapshots (
  id uuid primary key default gen_random_uuid(),
  cohort_size integer not null check (cohort_size >= 0),
  minimum_cohort_size integer not null default 3 check (minimum_cohort_size = 3),
  eligible boolean not null,
  metrics jsonb not null check (jsonb_typeof(metrics) = 'object' and octet_length(metrics::text) <= 4096),
  generated_by uuid not null references public.identities(id) on delete restrict,
  generated_at timestamptz not null default now(),
  check ((eligible and cohort_size >= minimum_cohort_size) or (not eligible and metrics = '{}'::jsonb))
);

create table public.intelligence_proposals (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references public.intelligence_aggregate_snapshots(id) on delete set null,
  proposal_type text not null check (proposal_type in ('methodology', 'tool', 'content', 'cycle', 'training', 'product')),
  status public.intelligence_proposal_status not null default 'draft',
  title text not null check (char_length(trim(title)) between 8 and 180),
  summary text not null check (char_length(trim(summary)) between 30 and 3000),
  rationale text not null check (char_length(trim(rationale)) between 30 and 3000),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  limitations text not null check (char_length(trim(limitations)) between 10 and 2000),
  created_by uuid not null references public.identities(id) on delete restrict,
  reviewed_by uuid references public.identities(id) on delete set null,
  reviewed_at timestamptz,
  review_note text check (review_note is null or char_length(trim(review_note)) between 3 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status in ('accepted', 'rejected')) = (reviewed_at is not null))
);
create index intelligence_proposals_status_created_idx on public.intelligence_proposals (status, created_at desc);

create table public.intelligence_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_identity_id uuid references public.identities(id) on delete set null,
  action text not null check (action in ('snapshot_generated', 'proposal_created', 'proposal_reviewed', 'workspace_read')),
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 2048),
  occurred_at timestamptz not null default now()
);

alter table public.intelligence_aggregate_snapshots enable row level security;
alter table public.intelligence_proposals enable row level security;
alter table public.intelligence_audit_events enable row level security;
revoke all on public.intelligence_aggregate_snapshots, public.intelligence_proposals, public.intelligence_audit_events from anon, authenticated;
create policy "intelligence snapshots deny direct access" on public.intelligence_aggregate_snapshots for all to anon, authenticated using (false) with check (false);
create policy "intelligence proposals deny direct access" on public.intelligence_proposals for all to anon, authenticated using (false) with check (false);
create policy "intelligence audits deny direct access" on public.intelligence_audit_events for all to anon, authenticated using (false) with check (false);

create or replace function private.has_internal_capability(target_identity_id uuid, target_capability text)
returns boolean language sql stable security definer set search_path = '' as $$
  select case target_capability
    when 'manage_roles' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_all' then private.has_internal_role(target_identity_id, 'admin')
    when 'crm_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_write_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'crm_handoff_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'commercial')
    when 'handoff_read_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'handoff_accept_assigned' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'manage_enrollments' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'concierge')
    when 'finance_catalog_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_read_all' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'finance_proposal_create' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance') or private.has_internal_role(target_identity_id, 'commercial')
    when 'finance_contract_write' then private.has_internal_role(target_identity_id, 'admin') or private.has_internal_role(target_identity_id, 'finance')
    when 'portfolio_manage' then private.has_internal_role(target_identity_id, 'admin')
    when 'portfolio_read_assigned' then private.has_internal_role(target_identity_id, 'concierge') or private.has_internal_role(target_identity_id, 'mentor')
    when 'intelligence_manage' then private.has_internal_role(target_identity_id, 'admin')
    else false
  end;
$$;

create or replace function public.generate_intelligence_aggregate_snapshot()
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); snapshot_id uuid; cohort integer; metric_payload jsonb;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'intelligence_manage') then raise exception 'admin intelligence access required' using errcode = '42501'; end if;
  select count(*)::integer into cohort from public.organizations;
  if cohort >= 3 then
    select jsonb_build_object(
      'active_cycles', (select count(*) from public.cycles where status = 'active'),
      'available_missions', (select count(*) from public.missions where status = 'available'),
      'approved_evidence', (select count(*) from public.mission_evidence evidence join lateral (select review.outcome from public.evidence_reviews review where review.evidence_id = evidence.id order by review.review_sequence desc, review.created_at desc limit 1) latest on true where latest.outcome = 'approved'),
      'generated_on', current_date
    ) into metric_payload;
  else metric_payload := '{}'::jsonb;
  end if;
  insert into public.intelligence_aggregate_snapshots (cohort_size, eligible, metrics, generated_by) values (cohort, cohort >= 3, metric_payload, actor_id) returning id into snapshot_id;
  insert into public.intelligence_audit_events (actor_identity_id, action, resource_id, metadata) values (actor_id, 'snapshot_generated', snapshot_id, jsonb_build_object('cohort_size', cohort, 'eligible', cohort >= 3));
  return snapshot_id;
end;
$$;

create or replace function public.create_intelligence_proposal(target_snapshot_id uuid, target_type text, target_title text, target_summary text, target_rationale text, target_confidence numeric, target_limitations text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); proposal_id uuid;
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'intelligence_manage') then raise exception 'admin intelligence access required' using errcode = '42501'; end if;
  if target_type not in ('methodology', 'tool', 'content', 'cycle', 'training', 'product') or char_length(trim(target_title)) not between 8 and 180 or char_length(trim(target_summary)) not between 30 and 3000 or char_length(trim(target_rationale)) not between 30 and 3000 or char_length(trim(target_limitations)) not between 10 and 2000 then raise exception 'invalid intelligence proposal' using errcode = '22023'; end if;
  if target_snapshot_id is not null and not exists (select 1 from public.intelligence_aggregate_snapshots where id = target_snapshot_id and eligible) then raise exception 'eligible aggregate snapshot required' using errcode = '42501'; end if;
  insert into public.intelligence_proposals (snapshot_id, proposal_type, title, summary, rationale, confidence, limitations, created_by) values (target_snapshot_id, target_type, trim(target_title), trim(target_summary), trim(target_rationale), target_confidence, trim(target_limitations), actor_id) returning id into proposal_id;
  insert into public.intelligence_audit_events (actor_identity_id, action, resource_id) values (actor_id, 'proposal_created', proposal_id);
  return proposal_id;
end;
$$;

create or replace function public.review_intelligence_proposal(target_proposal_id uuid, target_status public.intelligence_proposal_status, target_note text)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'intelligence_manage') then raise exception 'admin intelligence access required' using errcode = '42501'; end if;
  if target_status not in ('accepted', 'rejected') or char_length(trim(target_note)) not between 3 and 1000 then raise exception 'final review and note required' using errcode = '22023'; end if;
  update public.intelligence_proposals set status = target_status, reviewed_by = actor_id, reviewed_at = now(), review_note = trim(target_note), updated_at = now() where id = target_proposal_id and status in ('draft', 'reviewed');
  if not found then raise exception 'reviewable proposal not found' using errcode = 'P0002'; end if;
  insert into public.intelligence_audit_events (actor_identity_id, action, resource_id, metadata) values (actor_id, 'proposal_reviewed', target_proposal_id, jsonb_build_object('status', target_status));
end;
$$;

create or replace function public.get_intelligence_workspace()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'intelligence_manage') then raise exception 'admin intelligence access required' using errcode = '42501'; end if;
  insert into public.intelligence_audit_events (actor_identity_id, action) values (actor_id, 'workspace_read');
  return jsonb_build_object(
    'snapshots', coalesce((select jsonb_agg(jsonb_build_object('id', snapshot.id, 'cohort_size', snapshot.cohort_size, 'eligible', snapshot.eligible, 'metrics', snapshot.metrics, 'generated_at', snapshot.generated_at) order by snapshot.generated_at desc) from public.intelligence_aggregate_snapshots snapshot), '[]'::jsonb),
    'proposals', coalesce((select jsonb_agg(jsonb_build_object('id', proposal.id, 'snapshot_id', proposal.snapshot_id, 'proposal_type', proposal.proposal_type, 'status', proposal.status, 'title', proposal.title, 'summary', proposal.summary, 'rationale', proposal.rationale, 'confidence', proposal.confidence, 'limitations', proposal.limitations, 'created_at', proposal.created_at) order by proposal.created_at desc) from public.intelligence_proposals proposal), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.generate_intelligence_aggregate_snapshot() from public;
revoke all on function public.create_intelligence_proposal(uuid, text, text, text, text, numeric, text) from public;
revoke all on function public.review_intelligence_proposal(uuid, public.intelligence_proposal_status, text) from public;
revoke all on function public.get_intelligence_workspace() from public;
revoke execute on function public.generate_intelligence_aggregate_snapshot(), public.create_intelligence_proposal(uuid, text, text, text, text, numeric, text), public.review_intelligence_proposal(uuid, public.intelligence_proposal_status, text), public.get_intelligence_workspace() from anon;
grant execute on function public.generate_intelligence_aggregate_snapshot(), public.create_intelligence_proposal(uuid, text, text, text, text, numeric, text), public.review_intelligence_proposal(uuid, public.intelligence_proposal_status, text), public.get_intelligence_workspace() to authenticated;
