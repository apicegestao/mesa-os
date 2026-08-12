create or replace function private.save_workbench_tool_draft(target_tool_revision_id uuid, submitted_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_organization_id uuid;
  target_spec jsonb;
  submitted_entry record;
  field_spec jsonb;
  instance_id uuid;
begin
  if actor_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if jsonb_typeof(submitted_payload) <> 'object' or octet_length(submitted_payload::text) > 131072 then
    raise exception 'invalid workbench payload' using errcode = '22023';
  end if;

  select m.organization_id, r.spec
  into target_organization_id, target_spec
  from public.memberships m
  join public.workbench_tool_revisions r on r.id = target_tool_revision_id and r.status = 'published'
  where m.identity_id = actor_id and m.role = 'owner' and m.status = 'active';

  if target_organization_id is null or target_spec is null then
    raise exception 'published workbench tool not available' using errcode = '42501';
  end if;

  for submitted_entry in select key, value from jsonb_each(submitted_payload)
  loop
    select field into field_spec
    from jsonb_array_elements(target_spec -> 'fields') as field
    where field ->> 'code' = submitted_entry.key;
    if field_spec is null then
      raise exception 'workbench payload contains unsupported fields' using errcode = '22023';
    end if;
    if jsonb_typeof(submitted_entry.value) = 'null' then
      continue;
    end if;
    if field_spec ->> 'kind' in ('money', 'percentage', 'number')
      and jsonb_typeof(submitted_entry.value) <> 'number' then
      raise exception 'workbench numeric field has invalid value' using errcode = '22023';
    end if;
    if field_spec ->> 'kind' in ('text', 'date', 'choice')
      and jsonb_typeof(submitted_entry.value) <> 'string' then
      raise exception 'workbench text field has invalid value' using errcode = '22023';
    end if;
    if field_spec ->> 'kind' = 'date'
      and (submitted_entry.value #>> '{}') !~ '^\d{4}-\d{2}-\d{2}$' then
      raise exception 'workbench date field has invalid value' using errcode = '22023';
    end if;
    if field_spec ->> 'kind' = 'choice'
      and not exists (select 1 from jsonb_array_elements_text(coalesce(field_spec -> 'choices', '[]'::jsonb)) option where option = submitted_entry.value #>> '{}') then
      raise exception 'workbench choice field has invalid value' using errcode = '22023';
    end if;
  end loop;

  insert into public.workbench_tool_instances (
    organization_id, tool_revision_id, status, payload, created_by, updated_by
  ) values (
    target_organization_id, target_tool_revision_id, 'draft', submitted_payload, actor_id, actor_id
  ) on conflict (organization_id, tool_revision_id) do update set
    payload = excluded.payload,
    updated_by = excluded.updated_by,
    updated_at = now()
  returning id into instance_id;

  return instance_id;
end;
$$;
