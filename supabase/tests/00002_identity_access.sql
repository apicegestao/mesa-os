begin;
select plan(8);

select has_table('public', 'identities', 'identities table exists');
select has_table('public', 'organizations', 'organizations table exists');
select has_table('public', 'memberships', 'memberships table exists');
select has_table('public', 'invitations', 'invitations table exists');
select row_security_active('public', 'identities', 'identities has RLS');
select row_security_active('public', 'organizations', 'organizations has RLS');
select row_security_active('public', 'memberships', 'memberships has RLS');
select row_security_active('public', 'invitations', 'invitations has RLS');

select * from finish();
rollback;
