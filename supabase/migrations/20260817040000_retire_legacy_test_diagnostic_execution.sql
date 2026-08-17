-- Owner-authorized cleanup: the only v1 execution in production was a test
-- draft with no responses or downstream records. The v1 definition remains
-- retired for auditability; all organizations now enter through v2.
delete from public.diagnostic_executions
where revision_id = '10000000-0000-4000-8000-000000000002';
