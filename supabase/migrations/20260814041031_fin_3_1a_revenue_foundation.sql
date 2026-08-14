-- Separate transaction required before any function can use the new enum value.
alter type public.internal_staff_role add value if not exists 'finance';
