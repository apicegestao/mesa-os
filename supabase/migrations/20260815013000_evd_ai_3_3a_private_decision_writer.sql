-- EVD-AI-3.3A: only a trusted server path may persist a TutorIA decision.
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
  if target_outcome = 'approved' then
    update public.missions set status = 'completed', completed_at = now(), completed_by = evidence.submitted_by where id = mission.id;
    update public.missions set status = 'available' where id = (select id from public.missions where cycle_id = mission.cycle_id and position > mission.position and status = 'locked' order by position limit 1 for update skip locked) returning id into next_mission_id;
  end if;
  return jsonb_build_object('evidence_id', evidence.id, 'outcome', target_outcome, 'next_mission_id', next_mission_id);
end;
$$;
revoke all on function private.apply_tutoria_evidence_decision(uuid, text, numeric, text, text, text) from public, anon, authenticated;
create function public.apply_tutoria_evidence_decision(target_evidence_id uuid, target_outcome text, target_confidence numeric, target_rationale text, target_escalation_reason text default null, target_model_reference text default null)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.apply_tutoria_evidence_decision($1, $2, $3, $4, $5, $6)
$$;
revoke all on function public.apply_tutoria_evidence_decision(uuid, text, numeric, text, text, text) from public, anon, authenticated;
