-- MTH-3.4C: admin-only, atomic editorial release gate. Homologation build only.

create unique index methodology_editorial_unit_revisions_one_published_code_idx
  on private.methodology_editorial_unit_revisions(code) where status = 'published';

create function private.allow_methodology_editorial_publication_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'draft'
    and new.status = 'published'
    and old.published_at is null
    and new.published_at is not null
    and (to_jsonb(new) - array['status', 'published_at']) is not distinct from (to_jsonb(old) - array['status', 'published_at']) then
    return new;
  end if;
  raise exception 'methodology editorial revisions are immutable; only draft publication is allowed' using errcode = '55000';
end;
$$;

revoke all on function private.allow_methodology_editorial_publication_only() from public, anon, authenticated;
drop trigger methodology_editorial_unit_revisions_immutable on private.methodology_editorial_unit_revisions;
create trigger methodology_editorial_unit_revisions_immutable
before update or delete on private.methodology_editorial_unit_revisions
for each row execute function private.allow_methodology_editorial_publication_only();

create function private.get_my_methodology_editorial_release_workspace()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := (select auth.uid()); result jsonb;
begin
  if actor_id is null or not private.has_internal_role(actor_id, 'admin') then
    raise exception 'admin access required' using errcode = '42501';
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', editorial.id,
    'code', editorial.code,
    'version', editorial.version,
    'status', editorial.status,
    'title', editorial.title,
    'business_outcome', editorial.business_outcome,
    'tools', coalesce((select jsonb_agg(jsonb_build_object('code', link.workbench_tool_code, 'version', link.workbench_tool_version, 'role', link.role, 'status', tool.status) order by link.role, link.workbench_tool_code)
      from private.methodology_editorial_tool_links link
      join public.workbench_tool_revisions tool on tool.code = link.workbench_tool_code and tool.version = link.workbench_tool_version
      where link.editorial_revision_id = editorial.id), '[]'::jsonb)
  ) order by editorial.code, editorial.version desc), '[]'::jsonb)
  into result
  from private.methodology_editorial_unit_revisions editorial;
  return result;
end;
$$;

create function public.get_my_methodology_editorial_release_workspace()
returns jsonb
language sql
security invoker
set search_path = ''
as $$ select private.get_my_methodology_editorial_release_workspace() $$;

revoke all on function private.get_my_methodology_editorial_release_workspace() from public, anon, authenticated;
revoke all on function public.get_my_methodology_editorial_release_workspace() from public, anon;
grant execute on function public.get_my_methodology_editorial_release_workspace() to authenticated;

create function private.publish_methodology_editorial_unit(target_code text, target_version integer)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare actor_id uuid := (select auth.uid()); target_id uuid;
begin
  if actor_id is null or not private.has_internal_role(actor_id, 'admin') then
    raise exception 'admin access required' using errcode = '42501';
  end if;
  if target_code !~ '^t[1-4]_[a-z0-9_]+$' or target_version <= 0 then
    raise exception 'invalid editorial target' using errcode = '22023';
  end if;
  select id into target_id from private.methodology_editorial_unit_revisions
  where code = target_code and version = target_version and status = 'draft'
  for update;
  if target_id is null then raise exception 'draft editorial unit not found' using errcode = 'P0002'; end if;
  if not exists (select 1 from private.methodology_editorial_tool_links where editorial_revision_id = target_id) then
    raise exception 'editorial tool link required' using errcode = '22023';
  end if;
  if exists (
    select 1 from private.methodology_editorial_tool_links link
    join public.workbench_tool_revisions tool on tool.code = link.workbench_tool_code and tool.version = link.workbench_tool_version
    where link.editorial_revision_id = target_id and tool.status not in ('draft', 'published')
  ) then raise exception 'linked tool is not publishable' using errcode = '22023'; end if;

  update public.workbench_tool_revisions tool set status = 'published'
  from private.methodology_editorial_tool_links link
  where link.editorial_revision_id = target_id
    and tool.code = link.workbench_tool_code and tool.version = link.workbench_tool_version
    and tool.status = 'draft';

  update private.methodology_editorial_unit_revisions
  set status = 'published', published_at = now()
  where id = target_id;

  insert into public.internal_ops_audit_events (actor_identity_id, action, resource_type, resource_id, metadata)
  values (actor_id, 'publish_editorial_unit', 'methodology_editorial_unit', target_id, jsonb_build_object('code', target_code, 'version', target_version));
  return target_id;
end;
$$;

create function public.publish_methodology_editorial_unit(target_code text, target_version integer)
returns uuid
language sql
security invoker
set search_path = ''
as $$ select private.publish_methodology_editorial_unit($1, $2) $$;

revoke all on function private.publish_methodology_editorial_unit(text, integer) from public, anon, authenticated;
revoke all on function public.publish_methodology_editorial_unit(text, integer) from public, anon;
grant execute on function public.publish_methodology_editorial_unit(text, integer) to authenticated;
