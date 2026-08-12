-- HOTFIX-TMS-01: public SECURITY INVOKER gateways require executable internal implementations.
-- The private schema remains unexposed; every privileged implementation still derives the actor from auth.uid().

grant execute on function private.get_my_mesa_os_terms_state() to authenticated;
grant execute on function private.accept_legal_document_version(uuid) to authenticated;
grant execute on function private.accept_my_mesa_os_terms(uuid) to authenticated;
grant execute on function private.withdraw_my_mesa_os_tutoria_context(uuid) to authenticated;
