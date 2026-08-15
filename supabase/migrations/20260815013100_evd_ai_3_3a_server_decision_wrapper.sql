create function public.apply_tutoria_evidence_decision(target_evidence_id uuid, target_outcome text, target_confidence numeric, target_rationale text, target_escalation_reason text default null, target_model_reference text default null)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.apply_tutoria_evidence_decision($1, $2, $3, $4, $5, $6)
$$;
revoke all on function public.apply_tutoria_evidence_decision(uuid, text, numeric, text, text, text) from public, anon, authenticated;
