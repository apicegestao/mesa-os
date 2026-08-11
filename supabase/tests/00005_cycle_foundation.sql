begin;
select plan(5);
select has_table('public', 'cycles', 'cycles table exists');
select row_security_active('public', 'cycles', 'cycles has RLS');
select has_function('public', 'start_cycle', array['uuid'], 'start cycle function exists');
select col_is_unique('public', 'cycles', 'organization_id', 'one cycle per organization');
select col_is_unique('public', 'cycles', 'priority_id', 'one cycle per priority');
select * from finish();
rollback;
