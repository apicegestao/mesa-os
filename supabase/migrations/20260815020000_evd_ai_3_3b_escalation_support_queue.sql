-- EVD-AI-3.3B phase B1: an escalation must create one auditable human-support case.
alter table public.member_support_requests
  add column source_evidence_id uuid references public.mission_evidence(id) on delete restrict;

create unique index member_support_requests_source_evidence_unique
  on public.member_support_requests (source_evidence_id)
  where source_evidence_id is not null;

create or replace function private.apply_tutoria_evidence_decision(
  target_evidence_id uuid,
  target_outcome text,
  target_confidence numeric,
  target_rationale text,
  target_escalation_reason text default null,
  target_model_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  evidence public.mission_evidence%rowtype;
  mission public.missions%rowtype;
  next_mission_id uuid;
  sequence integer;
  support_request_id uuid;
begin
  if target_outcome not in ('approved', 'changes_requested', 'escalated') then raise exception 'invalid evidence outcome' using errcode = '22023'; end if;
  if target_confidence < 0 or target_confidence > 1 or char_length(trim(target_rationale)) not between 10 and 2000 then raise exception 'invalid Tutoria decision' using errcode = '22023'; end if;
  if target_outcome = 'approved' and target_confidence < 0.85 then raise exception 'auto approval requires high confidence' using errcode = '22023'; end if;
  if target_outcome = 'escalated' and char_length(trim(coalesce(target_escalation_reason, ''))) < 10 then raise exception 'escalation reason required' using errcode = '22023'; end if;

  select * into evidence from public.mission_evidence where id = target_evidence_id for update;
  if evidence.id is null then raise exception 'evidence not found' using errcode = 'P0002'; end if;
  if exists (select 1 from public.evidence_reviews where evidence_id = evidence.id) then raise exception 'evidence already decided' using errcode = '23505'; end if;
  select * into mission from public.missions where id = evidence.mission_id for update;
  if mission.status <> 'available' then raise exception 'mission is not available' using errcode = '22023'; end if;

  select coalesce(max(review_sequence), 0) + 1 into sequence from public.evidence_reviews where evidence_id = evidence.id;
  insert into public.evidence_reviews (organization_id, evidence_id, review_sequence, reviewer_kind, outcome, confidence, rationale, policy_code, escalation_reason, model_reference)
  values (evidence.organization_id, evidence.id, sequence, 'tutoria', target_outcome, target_confidence, trim(target_rationale), 'evd_ai_3_3a', nullif(trim(target_escalation_reason), ''), nullif(trim(target_model_reference), ''));

  if target_outcome = 'escalated' then
    insert into public.member_support_requests (organization_id, opened_by_identity_id, category, subject, source_evidence_id)
    values (evidence.organization_id, evidence.submitted_by, 'management_decision', 'Revisão de Evidência solicitada pelo TutorIA', evidence.id)
    on conflict (source_evidence_id) where source_evidence_id is not null do update set updated_at = now()
    returning id into support_request_id;
    insert into public.member_support_messages (request_id, author_identity_id, body)
    values (support_request_id, evidence.submitted_by, 'A TutorIA solicitou revisão humana para a Missão "' || mission.title || '". Motivo: ' || trim(target_escalation_reason));
    insert into public.member_support_audit_events (request_id, actor_identity_id, action, metadata)
    values (support_request_id, null, 'opened', jsonb_build_object('source', 'tutoria_evidence_review', 'evidence_id', evidence.id));
  end if;

  if target_outcome = 'approved' then
    update public.missions set status = 'completed', completed_at = now(), completed_by = evidence.submitted_by where id = mission.id;
    update public.missions set status = 'available' where id = (select id from public.missions where cycle_id = mission.cycle_id and position > mission.position and status = 'locked' order by position limit 1 for update skip locked) returning id into next_mission_id;
  end if;
  return jsonb_build_object('evidence_id', evidence.id, 'outcome', target_outcome, 'next_mission_id', next_mission_id, 'support_request_id', support_request_id);
end;
$$;

revoke all on function private.apply_tutoria_evidence_decision(uuid, text, numeric, text, text, text) from public, anon, authenticated;
