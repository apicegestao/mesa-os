-- Defense in depth: editorial drafts are internal only and never directly readable through the Data API.

create policy "methodology editorial revisions deny direct access"
on private.methodology_editorial_unit_revisions
for all to anon, authenticated
using (false)
with check (false);

create policy "methodology editorial tool links deny direct access"
on private.methodology_editorial_tool_links
for all to anon, authenticated
using (false)
with check (false);
