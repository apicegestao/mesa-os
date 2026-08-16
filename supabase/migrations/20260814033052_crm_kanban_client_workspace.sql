-- OPS-3.0A: enriches the existing authorized CRM projection for the client-centric Kanban.
-- No direct table access is granted; the same capability checks and actor scope remain enforced.
create or replace function public.get_my_crm_workspace()
returns jsonb language sql stable security definer set search_path = '' as $$
  with actor as (select auth.uid() as identity_id),
  opportunities as (
    select
      opportunity.id,
      opportunity.account_id,
      account.name as account_name,
      opportunity.title,
      opportunity.stage,
      opportunity.next_action,
      opportunity.next_action_due_on,
      opportunity.expected_value,
      opportunity.currency_code,
      opportunity.owner_identity_id,
      contact.full_name as contact_name,
      contact.email as contact_email,
      (select count(*)::integer from public.crm_tasks task where task.opportunity_id = opportunity.id and task.status = 'open') as open_task_count,
      (select max(activity.occurred_at) from public.crm_activities activity where activity.opportunity_id = opportunity.id) as last_activity_at,
      coalesce((
        select jsonb_agg(to_jsonb(recent_activity) order by recent_activity.occurred_at desc)
        from (
          select activity.kind, activity.summary, activity.occurred_at
          from public.crm_activities activity
          where activity.opportunity_id = opportunity.id
          order by activity.occurred_at desc
          limit 12
        ) recent_activity
      ), '[]'::jsonb) as recent_activities,
      coalesce((
        select jsonb_agg(to_jsonb(open_task) order by open_task.due_on nulls last, open_task.title)
        from (
          select task.title, task.due_on, task.status
          from public.crm_tasks task
          where task.opportunity_id = opportunity.id
          order by task.due_on nulls last, task.title
          limit 12
        ) open_task
      ), '[]'::jsonb) as tasks
    from public.crm_opportunities opportunity
    join public.crm_accounts account on account.id = opportunity.account_id
    left join public.crm_contacts contact on contact.id = opportunity.primary_contact_id
    cross join actor
    where private.has_internal_capability(actor.identity_id, 'crm_read_all')
      or (private.has_internal_capability(actor.identity_id, 'crm_read_assigned') and opportunity.owner_identity_id = actor.identity_id)
  ), handoffs as (
    select handoff.id, handoff.status, handoff.created_at, opportunity.title as opportunity_title, account.name as account_name
    from public.crm_onboarding_handoffs handoff
    join public.crm_opportunities opportunity on opportunity.id = handoff.opportunity_id
    join public.crm_accounts account on account.id = opportunity.account_id
    cross join actor
    where private.has_internal_capability(actor.identity_id, 'crm_read_all')
      or (private.has_internal_capability(actor.identity_id, 'handoff_read_assigned') and handoff.concierge_identity_id = actor.identity_id)
  )
  select jsonb_build_object(
    'opportunities', coalesce((select jsonb_agg(to_jsonb(opportunities) order by next_action_due_on nulls last, title) from opportunities), '[]'::jsonb),
    'handoffs', coalesce((select jsonb_agg(to_jsonb(handoffs) order by created_at desc) from handoffs), '[]'::jsonb)
  );
$$;

revoke all on function public.get_my_crm_workspace() from public;
revoke execute on function public.get_my_crm_workspace() from anon;
grant execute on function public.get_my_crm_workspace() to authenticated;
