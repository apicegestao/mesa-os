-- GEM-3.5: distinguish the direct, server-only Gemini integration from the
-- prior gateway placeholder. This changes audit vocabulary only; no table,
-- RPC, grant, policy or client capability is exposed.

alter table public.tutoria_orientation_audits
  drop constraint if exists tutoria_orientation_audits_provider_code_check;

alter table public.tutoria_orientation_audits
  add constraint tutoria_orientation_audits_provider_code_check
  check (provider_code in ('gemini_direct', 'netlify_ai_gateway', 'none'));
