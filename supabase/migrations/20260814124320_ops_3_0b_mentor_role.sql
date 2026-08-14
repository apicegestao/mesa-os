-- OPS-3.0B must introduce the enum value in its own transaction before it is used.
alter type public.internal_staff_role add value if not exists 'mentor';
