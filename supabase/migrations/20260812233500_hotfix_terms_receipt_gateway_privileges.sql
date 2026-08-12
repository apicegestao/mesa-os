-- HOTFIX-TMS-02: public security-invoker receipt gateways require the
-- authenticated role to execute their private, identity-scoped implementations.

grant execute on function private.list_my_mesa_os_terms_receipts() to authenticated;
grant execute on function private.get_my_mesa_os_terms_receipt(uuid) to authenticated;
