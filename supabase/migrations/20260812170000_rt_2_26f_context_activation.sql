-- RT-2.26F: publish the scoped TutorIA context notice and expose authenticated consent controls.

create or replace function private.verify_legal_document_hash()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.content_sha256 <> encode(extensions.digest(new.body_markdown, 'sha256'), 'hex') then
    raise exception 'legal document hash does not match content' using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger verify_legal_document_hash_before_write
before insert or update on public.legal_document_versions
for each row execute procedure private.verify_legal_document_hash();

insert into public.legal_document_versions (code, version, status, title, body_markdown, content_sha256, published_at)
values (
  'tutoria_longitudinal_context',
  1,
  'published',
  'Aviso específico — Contexto Longitudinal do TutorIA',
  $notice$
# Aviso específico — Contexto Longitudinal do TutorIA

**Versão:** 1.0  
**Vigência:** 12 de agosto de 2026  
**Controladora:** Mesa Dos Donos LTDA, CNPJ 68.144.654/0001-22  
**Canal de privacidade:** rdigestao360@gmail.com

## Finalidade

O TutorIA pode utilizar o histórico estruturado da sua própria organização para oferecer orientações mais úteis ao longo do tempo. Isso permite reconhecer o ciclo atual, decisões, compromissos, ferramentas preenchidas, evolução e lacunas de aprendizagem relacionadas à metodologia Mesa dos Donos.

## Sua escolha

A ativação é opcional. Ao escolher **“Ativar contexto automático”**, você autoriza a personalização longitudinal do TutorIA para a sua organização, nos limites deste aviso. Você pode retirar essa autorização a qualquer momento; o Mesa OS continuará disponível, sem novas derivações automáticas de contexto para a sua conta.

## Informações que poderão ser derivadas automaticamente

Somente informações necessárias e provenientes de registros estruturados do Mesa OS: diagnósticos, ciclos, missões, ferramentas, implementações, evidências, métricas, documentos gerados e decisões registradas nos fluxos da plataforma.

Cada item de contexto terá origem, versão, confiança, validade e histórico de correções. O TutorIA utilizará apenas o contexto necessário para a orientação atual e apenas dentro da sua organização.

## O que não será feito neste escopo

- conversas livres não serão guardadas automaticamente como memória canônica;
- informações da sua organização não serão utilizadas para atender outra empresa;
- dados privados não serão usados para treinar ou fazer fine-tuning de modelos de IA;
- não será criado perfil oculto sobre você ou seus colaboradores;
- o TutorIA não tomará decisões empresariais em seu nome;
- dados pessoais sensíveis e informações pessoais fora desta finalidade não serão incluídos sem avaliação e aviso específico.

## Seus controles e recibo

Você poderá consultar memórias ativas, identificar a origem, corrigir ou invalidar informações e desligar novas derivações automáticas. A retirada não apaga registros canônicos que precisem ser mantidos para prestar o serviço, cumprir obrigação legal ou exercer direitos.

Ao escolher ativar ou desligar, o Mesa OS guarda um recibo com sua identidade autenticada, versão e hash deste aviso, data/hora e ação registrada. Uma cópia fica disponível para consulta em sua conta.

## Contato

Para dúvidas ou solicitações sobre privacidade e contexto do TutorIA, escreva para rdigestao360@gmail.com.
$notice$,
  encode(extensions.digest($notice$
# Aviso específico — Contexto Longitudinal do TutorIA

**Versão:** 1.0  
**Vigência:** 12 de agosto de 2026  
**Controladora:** Mesa Dos Donos LTDA, CNPJ 68.144.654/0001-22  
**Canal de privacidade:** rdigestao360@gmail.com

## Finalidade

O TutorIA pode utilizar o histórico estruturado da sua própria organização para oferecer orientações mais úteis ao longo do tempo. Isso permite reconhecer o ciclo atual, decisões, compromissos, ferramentas preenchidas, evolução e lacunas de aprendizagem relacionadas à metodologia Mesa dos Donos.

## Sua escolha

A ativação é opcional. Ao escolher **“Ativar contexto automático”**, você autoriza a personalização longitudinal do TutorIA para a sua organização, nos limites deste aviso. Você pode retirar essa autorização a qualquer momento; o Mesa OS continuará disponível, sem novas derivações automáticas de contexto para a sua conta.

## Informações que poderão ser derivadas automaticamente

Somente informações necessárias e provenientes de registros estruturados do Mesa OS: diagnósticos, ciclos, missões, ferramentas, implementações, evidências, métricas, documentos gerados e decisões registradas nos fluxos da plataforma.

Cada item de contexto terá origem, versão, confiança, validade e histórico de correções. O TutorIA utilizará apenas o contexto necessário para a orientação atual e apenas dentro da sua organização.

## O que não será feito neste escopo

- conversas livres não serão guardadas automaticamente como memória canônica;
- informações da sua organização não serão utilizadas para atender outra empresa;
- dados privados não serão usados para treinar ou fazer fine-tuning de modelos de IA;
- não será criado perfil oculto sobre você ou seus colaboradores;
- o TutorIA não tomará decisões empresariais em seu nome;
- dados pessoais sensíveis e informações pessoais fora desta finalidade não serão incluídos sem avaliação e aviso específico.

## Seus controles e recibo

Você poderá consultar memórias ativas, identificar a origem, corrigir ou invalidar informações e desligar novas derivações automáticas. A retirada não apaga registros canônicos que precisem ser mantidos para prestar o serviço, cumprir obrigação legal ou exercer direitos.

Ao escolher ativar ou desligar, o Mesa OS guarda um recibo com sua identidade autenticada, versão e hash deste aviso, data/hora e ação registrada. Uma cópia fica disponível para consulta em sua conta.

## Contato

Para dúvidas ou solicitações sobre privacidade e contexto do TutorIA, escreva para rdigestao360@gmail.com.
$notice$, 'sha256'), 'hex'),
  now()
);

create or replace function private.get_my_tutoria_context_consent_state()
returns table (
  document_version_id uuid,
  title text,
  body_markdown text,
  content_sha256 text,
  latest_event public.legal_document_acceptance_event,
  automation_enabled boolean
)
language sql stable security definer set search_path = '' as $$
  with member as (
    select organization_id
    from public.memberships
    where identity_id = (select auth.uid()) and status = 'active'
  ), document as (
    select id, title, body_markdown, content_sha256
    from public.legal_document_versions
    where code = 'tutoria_longitudinal_context' and status = 'published'
  )
  select d.id, d.title, d.body_markdown, d.content_sha256,
    (select a.event from public.legal_document_acceptances a, member m where a.document_version_id = d.id and a.organization_id = m.organization_id and a.identity_id = (select auth.uid()) order by a.created_at desc, a.id desc limit 1),
    coalesce((select p.automation_enabled from public.organization_tutoria_context_policies p, member m where p.organization_id = m.organization_id and p.legal_document_version_id = d.id), false)
  from document d
  where exists (select 1 from member)
$$;

create or replace function private.activate_my_organization_tutoria_context(target_document_version_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; receipt_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and role = 'owner' and status = 'active';
  if target_organization_id is null then raise exception 'active organization owner required' using errcode = '42501'; end if;
  if not exists (select 1 from public.legal_document_versions where id = target_document_version_id and code = 'tutoria_longitudinal_context' and status = 'published') then
    raise exception 'published TutorIA context notice required' using errcode = '22023';
  end if;
  receipt_id := private.accept_legal_document_version(target_document_version_id);
  insert into public.organization_tutoria_context_policies (organization_id, automation_enabled, legal_document_version_id, enabled_at, enabled_by)
  values (target_organization_id, true, target_document_version_id, now(), actor_id)
  on conflict (organization_id) do update set automation_enabled = true, legal_document_version_id = excluded.legal_document_version_id, enabled_at = excluded.enabled_at, enabled_by = excluded.enabled_by, updated_at = now();
  return receipt_id;
end;
$$;

create or replace function private.withdraw_my_tutoria_context_consent(target_document_version_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; document_hash text; receipt_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and status = 'active';
  select content_sha256 into document_hash from public.legal_document_versions where id = target_document_version_id and code = 'tutoria_longitudinal_context' and status = 'published';
  if target_organization_id is null or document_hash is null then raise exception 'active membership and published TutorIA context notice required' using errcode = '42501'; end if;
  insert into public.legal_document_acceptances (document_version_id, organization_id, identity_id, event, document_sha256)
  values (target_document_version_id, target_organization_id, actor_id, 'withdrawn', document_hash)
  returning id into receipt_id;
  return receipt_id;
end;
$$;

revoke all on function private.verify_legal_document_hash(), private.get_my_tutoria_context_consent_state(), private.activate_my_organization_tutoria_context(uuid), private.withdraw_my_tutoria_context_consent(uuid) from public, anon, authenticated;

create or replace function public.get_my_tutoria_context_consent_state()
returns table (document_version_id uuid, title text, body_markdown text, content_sha256 text, latest_event public.legal_document_acceptance_event, automation_enabled boolean)
language sql security invoker set search_path = '' as $$ select * from private.get_my_tutoria_context_consent_state() $$;
create or replace function public.activate_my_organization_tutoria_context(target_document_version_id uuid)
returns uuid language sql security invoker set search_path = '' as $$ select private.activate_my_organization_tutoria_context($1) $$;
create or replace function public.withdraw_my_tutoria_context_consent(target_document_version_id uuid)
returns uuid language sql security invoker set search_path = '' as $$ select private.withdraw_my_tutoria_context_consent($1) $$;

revoke all on function public.get_my_tutoria_context_consent_state(), public.activate_my_organization_tutoria_context(uuid), public.withdraw_my_tutoria_context_consent(uuid) from public, anon;
grant execute on function public.get_my_tutoria_context_consent_state(), public.activate_my_organization_tutoria_context(uuid), public.withdraw_my_tutoria_context_consent(uuid) to authenticated;
