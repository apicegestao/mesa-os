-- FIN-3.1B corrective migration: Postgres must receive one regex escape for
-- the domain separator. The previous remote execution preserved two escapes.
alter table public.finance_provider_checkouts
  drop constraint if exists finance_provider_checkouts_payer_email_check,
  add constraint finance_provider_checkouts_payer_email_check
    check (
      payer_email = lower(trim(payer_email))
      and payer_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    );
