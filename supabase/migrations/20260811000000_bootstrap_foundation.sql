-- Sprint 2.1R: infrastructure baseline only. No business entities are authorized.
create schema if not exists private;

comment on schema private is 'Internal Mesa OS objects not exposed through the Data API.';

revoke all on schema private from public, anon, authenticated;

-- Future tables in exposed schemas must explicitly enable RLS and grant only the required operations.
