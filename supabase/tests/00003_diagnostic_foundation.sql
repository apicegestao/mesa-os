begin;
select plan(22);

select has_table('public', 'diagnostic_definitions', 'diagnostic definitions table exists');
select has_table('public', 'diagnostic_revisions', 'diagnostic revisions table exists');
select has_table('public', 'diagnostic_dimensions', 'diagnostic dimensions table exists');
select has_table('public', 'diagnostic_questions', 'diagnostic questions table exists');
select has_table('public', 'diagnostic_options', 'diagnostic options table exists');
select has_table('public', 'diagnostic_executions', 'diagnostic executions table exists');
select has_table('public', 'diagnostic_responses', 'diagnostic responses table exists');

select row_security_active('public', 'diagnostic_definitions', 'definitions has RLS');
select row_security_active('public', 'diagnostic_revisions', 'revisions has RLS');
select row_security_active('public', 'diagnostic_dimensions', 'dimensions has RLS');
select row_security_active('public', 'diagnostic_questions', 'questions has RLS');
select row_security_active('public', 'diagnostic_options', 'options has RLS');
select row_security_active('public', 'diagnostic_executions', 'executions has RLS');
select row_security_active('public', 'diagnostic_responses', 'responses has RLS');

select has_function('public', 'start_diagnostic', array['uuid'], 'start function exists');
select has_function('public', 'save_diagnostic_responses', array['uuid', 'jsonb'], 'save function exists');
select has_function('public', 'submit_diagnostic', array['uuid'], 'submit function exists');

select is((select count(*)::integer from public.diagnostic_definitions), 1, 'one definition seeded');
select is((select count(*)::integer from public.diagnostic_revisions where status = 'published'), 1, 'one revision published');
select is((select count(*)::integer from public.diagnostic_dimensions), 5, 'five dimensions seeded');
select is((select count(*)::integer from public.diagnostic_questions), 20, 'twenty questions seeded');
select is((select count(*)::integer from public.diagnostic_options), 5, 'five scale options seeded');

select * from finish();
rollback;
