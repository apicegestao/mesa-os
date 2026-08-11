begin;
select plan(5);
select has_table('public', 'priorities', 'priorities table exists');
select row_security_active('public', 'priorities', 'priorities has RLS');
select has_function('public', 'confirm_priority', array['uuid', 'text'], 'confirm function exists');
select col_is_unique('public', 'priorities', 'organization_id', 'one priority per organization');
select col_is_unique('public', 'priorities', 'diagnostic_execution_id', 'one priority per diagnostic execution');
select * from finish();
rollback;
