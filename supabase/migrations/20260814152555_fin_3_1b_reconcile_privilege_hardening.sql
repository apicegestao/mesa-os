-- The webhook reconciler is never callable by browser roles.
revoke all on function public.reconcile_asaas_payment_event(text, text, text, text, text, numeric) from public, anon, authenticated;
grant execute on function public.reconcile_asaas_payment_event(text, text, text, text, text, numeric) to service_role;
