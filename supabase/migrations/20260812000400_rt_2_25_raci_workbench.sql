-- RT-2.25: published, versioned RACI workspace. It remains a draft-only tool.
insert into public.workbench_tool_revisions (code, version, status, title, methodology_outcome_id, spec)
select 'raci_roles_decisions_v1', 1, 'published', 'Mapa de papéis e decisões', outcome.id,
'{"fields":[{"code":"roles","label":"Papéis e decisões essenciais","kind":"entries","required":true,"min_entries":1,"max_entries":20,"entry_fields":[{"code":"role_name","label":"Papel ou área","required":true,"max_length":80},{"code":"expected_result","label":"Resultado esperado","required":true,"max_length":300},{"code":"responsibilities","label":"Responsabilidades essenciais","required":true,"max_length":1000},{"code":"decision_rights","label":"Decisões sem escalar","required":true,"max_length":1000}]}],"analysis_dimensions":["clareza de papéis","responsabilidade","direitos de decisão","dependência do dono"],"export_formats":["pdf","xlsx"]}'::jsonb
from public.development_outcomes outcome where outcome.code = 't1_leadership_roles_org_chart'
on conflict (code, version) do nothing;

create or replace function private.save_workbench_tool_draft(target_tool_revision_id uuid, submitted_payload jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; target_spec jsonb; submitted_entry record; field_spec jsonb; role_entry jsonb; entry_spec jsonb; instance_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(submitted_payload) <> 'object' or octet_length(submitted_payload::text) > 131072 then raise exception 'invalid workbench payload' using errcode = '22023'; end if;
  select m.organization_id, r.spec into target_organization_id, target_spec from public.memberships m join public.workbench_tool_revisions r on r.id = target_tool_revision_id and r.status = 'published' where m.identity_id = actor_id and m.role = 'owner' and m.status = 'active';
  if target_organization_id is null or target_spec is null then raise exception 'published workbench tool not available' using errcode = '42501'; end if;
  for submitted_entry in select key, value from jsonb_each(submitted_payload) loop
    select field into field_spec from jsonb_array_elements(target_spec -> 'fields') field where field ->> 'code' = submitted_entry.key;
    if field_spec is null then raise exception 'workbench payload contains unsupported fields' using errcode = '22023'; end if;
    if field_spec ->> 'kind' = 'entries' then
      if jsonb_typeof(submitted_entry.value) <> 'array' or jsonb_array_length(submitted_entry.value) < coalesce((field_spec ->> 'min_entries')::integer, 1) or jsonb_array_length(submitted_entry.value) > coalesce((field_spec ->> 'max_entries')::integer, 20) then raise exception 'workbench entries field has invalid count' using errcode = '22023'; end if;
      for role_entry in select value from jsonb_array_elements(submitted_entry.value) loop
        if jsonb_typeof(role_entry) <> 'object' then raise exception 'workbench entry has invalid value' using errcode = '22023'; end if;
        if exists (select 1 from jsonb_object_keys(role_entry) key where not exists (select 1 from jsonb_array_elements(field_spec -> 'entry_fields') f where f ->> 'code' = key)) then raise exception 'workbench entry contains unsupported field' using errcode = '22023'; end if;
        for entry_spec in select value from jsonb_array_elements(field_spec -> 'entry_fields') loop
          if entry_spec ->> 'required' = 'true' and coalesce(role_entry ->> (entry_spec ->> 'code'), '') = '' then raise exception 'workbench entry required field missing' using errcode = '22023'; end if;
          if role_entry ? (entry_spec ->> 'code') and (jsonb_typeof(role_entry -> (entry_spec ->> 'code')) <> 'string' or char_length(role_entry ->> (entry_spec ->> 'code')) > (entry_spec ->> 'max_length')::integer) then raise exception 'workbench entry field invalid' using errcode = '22023'; end if;
        end loop;
      end loop;
      continue;
    end if;
    if jsonb_typeof(submitted_entry.value) = 'null' then continue; end if;
    if field_spec ->> 'kind' in ('money','percentage','number') and jsonb_typeof(submitted_entry.value) <> 'number' then raise exception 'workbench numeric field has invalid value' using errcode = '22023'; end if;
    if field_spec ->> 'kind' in ('text','date','choice') and jsonb_typeof(submitted_entry.value) <> 'string' then raise exception 'workbench text field has invalid value' using errcode = '22023'; end if;
  end loop;
  insert into public.workbench_tool_instances (organization_id, tool_revision_id, status, payload, created_by, updated_by) values (target_organization_id,target_tool_revision_id,'draft',submitted_payload,actor_id,actor_id) on conflict (organization_id,tool_revision_id) do update set payload=excluded.payload, updated_by=excluded.updated_by, updated_at=now() returning id into instance_id;
  return instance_id;
end; $$;
