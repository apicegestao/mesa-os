create or replace function public.assign_member_support_request(target_request_id uuid, target_assignee_identity_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := auth.uid(); request_record public.member_support_requests%rowtype;
begin
  select * into request_record from public.member_support_requests where id = target_request_id for update;
  if not found then raise exception 'support request not found' using errcode = 'P0002'; end if;
  if not private.has_internal_capability(actor_id, 'support_manage_all')
    and not (actor_id = target_assignee_identity_id and private.can_staff_access_support(actor_id, target_request_id)) then
    raise exception 'support assignment access required' using errcode = '42501';
  end if;
  if not private.has_internal_role(target_assignee_identity_id, 'concierge') and not private.has_internal_role(target_assignee_identity_id, 'mentor') and not private.has_internal_role(target_assignee_identity_id, 'admin') then
    raise exception 'active support assignee required' using errcode = '42501';
  end if;
  update public.member_support_requests set assigned_to_identity_id = target_assignee_identity_id, status = 'in_progress', updated_at = now() where id = target_request_id;
  insert into public.member_support_audit_events (request_id, actor_identity_id, action, metadata) values (target_request_id, actor_id, 'assigned', jsonb_build_object('assignee_identity_id', target_assignee_identity_id));
end; $$;
revoke all on function public.assign_member_support_request(uuid, uuid) from public;
revoke execute on function public.assign_member_support_request(uuid, uuid) from anon;
grant execute on function public.assign_member_support_request(uuid, uuid) to authenticated;
