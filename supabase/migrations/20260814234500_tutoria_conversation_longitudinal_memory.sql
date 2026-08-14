-- Authorized follow-up: unified Terms v1.1 and private TutorIA conversation continuity.
-- Applied to homologation first. Production promotion requires its own release gate.

create or replace function private.prevent_legal_document_content_mutation()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if old.status <> 'draft' and new.status <> 'retired'
    and (new.code, new.version, new.locale, new.title, new.body_markdown, new.content_sha256, new.published_at) is distinct from (old.code, old.version, old.locale, old.title, old.body_markdown, old.content_sha256, old.published_at) then
    raise exception 'published legal document content is immutable' using errcode = '22023';
  end if;
  if old.status = 'retired' and new.status <> 'retired' then raise exception 'retired legal document cannot be republished' using errcode = '22023'; end if;
  return new;
end;
$$;

update public.legal_document_versions set status = 'retired', published_at = null
where code = 'mesa_os_terms' and status = 'published';

with terms(body) as (values ($terms$
# Termos de Uso — Mesa dos Donos / Mesa OS

**Versão:** 1.1  
**Vigência:** 14 de agosto de 2026  
**Controladora e fornecedora:** Mesa Dos Donos LTDA, CNPJ 68.144.654/0001-22  
**Canal de privacidade e suporte:** rdigestao360@gmail.com

## 1. Objeto e aceite

Estes Termos regulam o acesso ao Mesa OS, plataforma da Mesa dos Donos voltada à organização, aprendizagem e evolução da gestão empresarial. O aceite é único: no primeiro acesso e somente quando houver nova versão material dos Termos.

## 2. Conta e acesso

O acesso é pessoal e não deve ser compartilhado. O Mesa OS identifica o perfil autorizado após confirmação por código temporário e libera somente o ambiente e as permissões correspondentes.

## 3. Dados, conteúdo e continuidade longitudinal do TutorIA

Ao aceitar estes Termos, o usuário autoriza o TutorIA a utilizar, exclusivamente dentro da sua própria organização, o histórico necessário para continuidade da tutoria. Esse histórico pode incluir diagnósticos, ciclos, missões, ferramentas, implementações, evidências, métricas, documentos, decisões registradas e conversas realizadas com o TutorIA.

As conversas são mantidas para retomar orientações, dúvidas e decisões do próprio membro ao longo do acompanhamento. O TutorIA usa apenas o contexto necessário à orientação atual.

O Mesa OS não utiliza conversas identificáveis de membros para treinamento ou fine-tuning de modelos de IA, não compartilha esse conteúdo com outras organizações e não permite acesso entre organizações. O conteúdo é protegido por isolamento técnico, controles de acesso e trilha de auditoria.

Não são incluídos automaticamente dados sensíveis que não sejam necessários à finalidade empresarial, informações de outras organizações, perfil oculto de pessoas ou conteúdo destinado a treinar modelos de IA. O TutorIA não toma decisões empresariais em nome do usuário.

## 4. Uso aceitável

É vedado usar a plataforma para violar leis ou direitos de terceiros, tentar acessar dados de outras organizações, burlar controles, inserir malware, gerar conteúdo de entretenimento desvinculado da finalidade empresarial ou sobrecarregar intencionalmente os serviços.

## 5. Documentos e propriedade intelectual

A metodologia, marca, interface e componentes do Mesa OS pertencem à Mesa Dos Donos LTDA, salvo indicação diferente. Documentos gerados a partir dos dados do usuário podem ser utilizados na sua atividade empresarial, observadas as limitações aplicáveis.

## 6. Atualizações e recibos

Cada aceite guarda identidade autenticada, versão, hash do conteúdo e data/hora, formando recibo verificável e temporal. Uma atualização material dos Termos exige novo aceite antes de liberar as áreas autenticadas.

## 7. Limites e contato

O TutorIA é uma ferramenta de apoio à gestão. Suas respostas não substituem aconselhamento jurídico, contábil, tributário, financeiro, médico, psicológico ou decisão profissional especializada. Para dúvidas sobre estes Termos ou privacidade, escreva para rdigestao360@gmail.com.
$terms$))
insert into public.legal_document_versions (code, version, status, title, body_markdown, content_sha256, published_at)
select 'mesa_os_terms', 2, 'published', 'Termos de Uso — Mesa dos Donos / Mesa OS', body, encode(extensions.digest(body, 'sha256'), 'hex'), now() from terms;

create type public.tutoria_conversation_role as enum ('member', 'tutoria');

create table public.tutoria_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  identity_id uuid not null references public.identities(id) on delete cascade,
  role public.tutoria_conversation_role not null,
  content text not null check (char_length(trim(content)) between 1 and 4000),
  terms_document_version_id uuid not null references public.legal_document_versions(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index tutoria_conversation_messages_scope_idx on public.tutoria_conversation_messages (organization_id, identity_id, created_at desc);

alter table public.tutoria_conversation_messages enable row level security;
revoke all on public.tutoria_conversation_messages from anon, authenticated;
grant select on public.tutoria_conversation_messages to authenticated;
create policy "members read own TutorIA conversation" on public.tutoria_conversation_messages for select to authenticated
using ((select auth.uid()) = identity_id and (select private.is_active_member(organization_id)));

create or replace function private.persist_my_tutoria_conversation_exchange(submitted_question text, submitted_response text)
returns void language plpgsql security definer set search_path = '' as $$
declare actor_id uuid := (select auth.uid()); target_organization_id uuid; current_terms_id uuid;
begin
  if actor_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if char_length(trim(coalesce(submitted_question, ''))) not between 4 and 1200 or char_length(trim(coalesce(submitted_response, ''))) not between 1 and 4000 then raise exception 'invalid conversation payload' using errcode = '22023'; end if;
  select organization_id into target_organization_id from public.memberships where identity_id = actor_id and status = 'active';
  select id into current_terms_id from public.legal_document_versions where code = 'mesa_os_terms' and status = 'published';
  if target_organization_id is null or current_terms_id is null or not private.is_tutoria_auto_context_eligible(target_organization_id, actor_id) then raise exception 'active membership and current TutorIA terms required' using errcode = '42501'; end if;
  insert into public.tutoria_conversation_messages (organization_id, identity_id, role, content, terms_document_version_id)
  values (target_organization_id, actor_id, 'member', trim(submitted_question), current_terms_id), (target_organization_id, actor_id, 'tutoria', trim(submitted_response), current_terms_id);
end;
$$;

create or replace function private.get_my_tutoria_conversation()
returns table (id uuid, role text, content text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select message.id, message.role::text, message.content, message.created_at
  from public.tutoria_conversation_messages message
  join public.memberships membership on membership.organization_id = message.organization_id and membership.identity_id = (select auth.uid()) and membership.status = 'active'
  where message.identity_id = (select auth.uid())
  order by message.created_at asc, message.id asc
  limit 200
$$;

revoke all on function private.persist_my_tutoria_conversation_exchange(text, text), private.get_my_tutoria_conversation() from public, anon, authenticated;
create or replace function public.persist_my_tutoria_conversation_exchange(submitted_question text, submitted_response text)
returns void language sql security invoker set search_path = '' as $$ select private.persist_my_tutoria_conversation_exchange($1, $2) $$;
create or replace function public.get_my_tutoria_conversation()
returns table (id uuid, role text, content text, created_at timestamptz)
language sql security invoker set search_path = '' as $$ select * from private.get_my_tutoria_conversation() $$;
revoke all on function public.persist_my_tutoria_conversation_exchange(text, text), public.get_my_tutoria_conversation() from public, anon;
grant execute on function private.persist_my_tutoria_conversation_exchange(text, text), private.get_my_tutoria_conversation() to authenticated;
grant execute on function public.persist_my_tutoria_conversation_exchange(text, text), public.get_my_tutoria_conversation() to authenticated;
