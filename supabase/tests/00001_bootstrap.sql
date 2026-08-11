begin;
select plan(1);
select has_schema('private', 'private infrastructure schema exists');
select * from finish();
rollback;
