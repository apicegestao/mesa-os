-- Reconcile the deployed B2 functions with the private-RPC boundary.
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
