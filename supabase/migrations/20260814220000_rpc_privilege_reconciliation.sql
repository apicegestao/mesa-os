-- Keeps the public RPC contract while moving elevated execution to private.
-- This migration is intentionally generic so every already-authorized internal
-- surface receives the same reviewed privilege boundary.

create schema if not exists private;

do $$
declare
  source_function record;
  private_definition text;
  wrapper_definition text;
  function_arguments text;
  positional_arguments text;
  invocation text;
begin
  for source_function in
    select
      procedure.oid,
      procedure.proname,
      procedure.pronargs,
      procedure.proretset,
      pg_get_functiondef(procedure.oid) as definition,
      pg_get_function_arguments(procedure.oid) as arguments,
      pg_get_function_identity_arguments(procedure.oid) as identity_arguments,
      pg_get_function_result(procedure.oid) as result_type
    from pg_proc procedure
    join pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.prokind = 'f'
      and procedure.prosecdef
      and has_function_privilege('authenticated', procedure.oid, 'EXECUTE')
  loop
    private_definition := regexp_replace(
      source_function.definition,
      '^CREATE OR REPLACE FUNCTION public[.]',
      'CREATE OR REPLACE FUNCTION private.'
    );

    if private_definition = source_function.definition then
      raise exception 'could not relocate public privileged function %', source_function.proname;
    end if;

    execute private_definition;

    function_arguments := coalesce(source_function.arguments, '');
    positional_arguments := array_to_string(
      array(
        select format('$%s', argument_position)
        from generate_series(1, source_function.pronargs) as argument_position
      ),
      ', '
    );

    invocation := case
      when source_function.proretset then
        format('select * from private.%I(%s);', source_function.proname, positional_arguments)
      else
        format('select private.%I(%s);', source_function.proname, positional_arguments)
    end;

    wrapper_definition := format(
      'create or replace function public.%I(%s) returns %s language sql security invoker set search_path = '''' as $rpc$ %s $rpc$;',
      source_function.proname,
      function_arguments,
      source_function.result_type,
      invocation
    );

    execute wrapper_definition;
    execute format('revoke all on function public.%I(%s) from public, anon;', source_function.proname, source_function.identity_arguments);
    execute format('grant execute on function public.%I(%s) to authenticated;', source_function.proname, source_function.identity_arguments);
    execute format('revoke all on function private.%I(%s) from public, anon;', source_function.proname, source_function.identity_arguments);
    execute format('grant execute on function private.%I(%s) to authenticated;', source_function.proname, source_function.identity_arguments);
  end loop;

  revoke all on all functions in schema private from public, anon;

  if exists (
    select 1
    from pg_proc procedure
    join pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.prokind = 'f'
      and procedure.prosecdef
      and has_function_privilege('authenticated', procedure.oid, 'EXECUTE')
  ) then
    raise exception 'public SECURITY DEFINER function remains executable by authenticated';
  end if;

  if exists (
    select 1
    from pg_proc procedure
    join pg_namespace namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'private'
      and procedure.prosecdef
      and (
        has_function_privilege('anon', procedure.oid, 'EXECUTE')
        or has_function_privilege('public', procedure.oid, 'EXECUTE')
      )
  ) then
    raise exception 'private SECURITY DEFINER function remains broadly executable';
  end if;
end;
$$;
