-- MTH-3.4C corrective migration: the public security-invoker wrapper delegates
-- to a private function that retains the Admin check and the atomic release gate.

grant execute on function private.publish_methodology_editorial_unit(text, integer) to authenticated;
