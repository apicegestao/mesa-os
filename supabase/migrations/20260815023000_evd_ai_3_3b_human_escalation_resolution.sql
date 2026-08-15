-- EVD-AI-3.3B phase B2: Mentor/Admin resolves only TutorIA-escalated evidence.
create or replace function private.resolve_escalated_evidence_review(
  target_evidence_id uuid,
  target_outcome text,
  target_rationale text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  evidence public.mission_evidence%rowtype;
  mission public.missions%rowtype;
  latest_review public.evidence_reviews%rowtype;
  next_mission_id uuid;
  sequence integer;
  support_request_id uuid;
begin
  if actor_id is null or not (private.has_internal_role(actor_id, 'admin') or private.has_internal_role(actor_id, 'mentor')) then
    raise exception 'evidence review access required' using errcode = '42501';
  end if;
  if target_outcome not in ('approved', 'changes_requested') or char_length(trim(target_rationale)) not between 20 and 2000 then
    raise exception 'invalid human evidence decision' using errcode = '22023';
  end if;

  select * into evidence from public.mission_evidence where id = target_evidence_id for update;
  if evidence.id is null then raise exception 'evidence not found' using errcode = 'P0002'; end if;
  select * into latest_review from public.evidence_reviews where evidence_id = evidence.id order by review_sequence desc, created_at desc limit 1 for update;
  if latest_review.id is null or latest_review.outcome <> 'escalated' or latest_review.reviewer_kind <> 'tutoria' then
    raise exception 'evidence is not awaiting human resolution' using errcode = '22023';
  end if;
  select * into mission from public.missions where id = evidence.mission_id for update;
  if mission.status <> 'available' then raise exception 'mission is not available' using errcode = '22023'; end if;

  select coalesce(max(review_sequence), 0) + 1 into sequence from public.evidence_reviews where evidence_id = evidence.id;
  insert into public.evidence_reviews (organization_id, evidence_id, review_sequence, reviewer_kind, reviewer_identity_id, outcome, confidence, rationale, policy_code)
  values (evidence.organization_id, evidence.id, sequence, 'human', actor_id, target_outcome, null, trim(target_rationale), 'evd_ai_3_3b_human_resolution');

  select id into support_request_id from public.member_support_requests where source_evidence_id = evidence.id for update;
  if support_request_id is not null then
    insert into public.member_support_messages (request_id, author_identity_id, body)
    values (support_request_id, actor_id, trim(target_rationale));
    update public.member_support_requests
      set status = case when target_outcome = 'approved' then 'resolved'::public.member_support_status else 'waiting_member'::public.member_support_status end,
          updated_at = now(),
          resolved_at = case when target_outcome = 'approved' then now() else null end
      where id = support_request_id;
    insert into public.member_support_audit_events (request_id, actor_identity_id, action, metadata)
    values (support_request_id, actor_id, 'status_changed', jsonb_build_object('evidence_outcome', target_outcome));
  end if;

  if target_outcome = 'approved' then
    update public.missions set status = 'completed', completed_at = now(), completed_by = evidence.submitted_by where id = mission.id;
    update public.missions set status = 'available' where id = (
      select id from public.missions
      where cycle_id = mission.cycle_id and position > mission.position and status = 'locked'
      order by position limit 1 for update skip locked
    ) returning id into next_mission_id;
  end if;
  return jsonb_build_object('evidence_id', evidence.id, 'outcome', target_outcome, 'next_mission_id', next_mission_id);
end;
$$;

create or replace function public.resolve_escalated_evidence_review(target_evidence_id uuid, target_outcome text, target_rationale text)
returns jsonb
language sql
security invoker
set search_path = ''
as $$ select private.resolve_escalated_evidence_review($1, $2, $3) $$;

revoke all on function private.resolve_escalated_evidence_review(uuid, text, text) from public, anon, authenticated;
revoke all on function public.resolve_escalated_evidence_review(uuid, text, text) from public, anon;
grant execute on function public.resolve_escalated_evidence_review(uuid, text, text) to authenticated;
grant execute on function private.resolve_escalated_evidence_review(uuid, text, text) to authenticated;

create or replace function private.get_my_internal_support_queue()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid();
begin
  if actor_id is null or not private.has_internal_capability(actor_id, 'support_answer') then raise exception 'internal support access required' using errcode = '42501'; end if;
  insert into public.member_support_audit_events (request_id, actor_identity_id, action)
  select request.id, actor_id, 'read_staff' from public.member_support_requests request where private.can_staff_access_support(actor_id, request.id);
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', request.id, 'organization_id', request.organization_id, 'organization_name', organization.name,
    'category', request.category, 'subject', request.subject, 'status', request.status,
    'assigned_to_identity_id', request.assigned_to_identity_id, 'source_evidence_id', request.source_evidence_id,
    'updated_at', request.updated_at,
    'messages', coalesce((select jsonb_agg(jsonb_build_object('id', message.id, 'author_identity_id', message.author_identity_id, 'body', message.body, 'created_at', message.created_at) order by message.created_at) from public.member_support_messages message where message.request_id = request.id), '[]'::jsonb)
  ) order by request.updated_at desc) from public.member_support_requests request join public.organizations organization on organization.id = request.organization_id where private.can_staff_access_support(actor_id, request.id)), '[]'::jsonb);
end;
$$;

create or replace function public.get_my_internal_support_queue()
returns jsonb language sql security invoker set search_path = '' as $$
  select private.get_my_internal_support_queue()
$$;

revoke all on function private.get_my_internal_support_queue() from public, anon, authenticated;
revoke all on function public.get_my_internal_support_queue() from public, anon;
grant execute on function private.get_my_internal_support_queue() to authenticated;
grant execute on function public.get_my_internal_support_queue() to authenticated;
