create index if not exists access_enrollments_provisioned_identity_idx
  on public.access_enrollments (provisioned_identity_id)
  where provisioned_identity_id is not null;
create index if not exists access_enrollments_created_by_idx
  on public.access_enrollments (created_by)
  where created_by is not null;
create index if not exists access_enrollments_revoked_by_idx
  on public.access_enrollments (revoked_by)
  where revoked_by is not null;
create index if not exists access_enrollment_audits_actor_identity_idx
  on public.access_enrollment_audits (actor_identity_id)
  where actor_identity_id is not null;

create policy "access enrollments deny direct access"
  on public.access_enrollments for all to anon, authenticated
  using (false) with check (false);
create policy "access enrollment audits deny direct access"
  on public.access_enrollment_audits for all to anon, authenticated
  using (false) with check (false);
