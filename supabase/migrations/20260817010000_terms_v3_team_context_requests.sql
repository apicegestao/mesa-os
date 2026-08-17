-- Terms v3 replaces self-service withdrawal of TutorIA derivations with a
-- documented request-to-team flow. Published legal content stays immutable.

update public.legal_document_versions
set status = 'retired', published_at = null
where code = 'mesa_os_terms' and status = 'published';

with terms(body) as (values ($terms$
# Termos de Uso — Mesa dos Donos / Mesa OS

**Versão:** 1.2  
**Vigência:** 17 de agosto de 2026  
**Controladora e fornecedora:** Mesa Dos Donos LTDA, CNPJ 68.144.654/0001-22  
**Canal de privacidade e suporte:** suporte@mesadosdonos.com

## 1. Objeto e aceite

Estes Termos regulam o acesso ao Mesa OS, plataforma da Mesa dos Donos voltada à organização, aprendizagem e evolução da gestão empresarial. O aceite é único: no primeiro acesso e somente quando houver nova versão material dos Termos.

## 2. Conta e acesso

O acesso é pessoal e não deve ser compartilhado. O Mesa OS identifica o perfil autorizado após confirmação por código temporário e libera somente o ambiente e as permissões correspondentes.

## 3. Dados, conteúdo e continuidade longitudinal do TutorIA

Ao aceitar estes Termos, o usuário autoriza o TutorIA a utilizar, exclusivamente dentro da sua própria organização, o histórico necessário para continuidade da tutoria. Esse histórico pode incluir diagnósticos, ciclos, missões, ferramentas, implementações, evidências, métricas, documentos, decisões registradas e conversas realizadas com o TutorIA.

As conversas são mantidas para retomar orientações, dúvidas e decisões do próprio membro ao longo do acompanhamento. O TutorIA usa apenas o contexto necessário à orientação atual.

O Mesa OS não utiliza conversas identificáveis de membros para treinamento ou fine-tuning de modelos de IA, não compartilha esse conteúdo com outras organizações e não permite acesso entre organizações. O conteúdo é protegido por isolamento técnico, controles de acesso e trilha de auditoria.

Não são incluídos automaticamente dados sensíveis que não sejam necessários à finalidade empresarial, informações de outras organizações, perfil oculto de pessoas ou conteúdo destinado a treinar modelos de IA. O TutorIA não toma decisões empresariais em nome do usuário.

Caso queira solicitar a interrupção de novas derivações automáticas de contexto, o usuário poderá falar com a equipe Mesa pelo canal de suporte. A solicitação será tratada pela operação autorizada, preservando registros canônicos e recibos que precisem ser mantidos para a prestação do serviço, cumprimento de obrigação legal ou exercício de direitos.

## 4. Uso aceitável

É vedado usar a plataforma para violar leis ou direitos de terceiros, tentar acessar dados de outras organizações, burlar controles, inserir malware, gerar conteúdo de entretenimento desvinculado da finalidade empresarial ou sobrecarregar intencionalmente os serviços.

## 5. Documentos e propriedade intelectual

A metodologia, marca, interface e componentes do Mesa OS pertencem à Mesa Dos Donos LTDA, salvo indicação diferente. Documentos gerados a partir dos dados do usuário podem ser utilizados na sua atividade empresarial, observadas as limitações aplicáveis.

## 6. Atualizações e recibos

Cada aceite guarda identidade autenticada, versão, hash do conteúdo e data/hora, formando recibo verificável e temporal. Uma atualização material dos Termos exige novo aceite antes de liberar as áreas autenticadas.

## 7. Limites e contato

O TutorIA é uma ferramenta de apoio à gestão. Suas respostas não substituem aconselhamento jurídico, contábil, tributário, financeiro, médico, psicológico ou decisão profissional especializada. Para dúvidas sobre estes Termos, privacidade ou contexto do TutorIA, escreva para suporte@mesadosdonos.com.
$terms$))
insert into public.legal_document_versions (code, version, status, title, body_markdown, content_sha256, published_at)
select 'mesa_os_terms', 3, 'published', 'Termos de Uso — Mesa dos Donos / Mesa OS', body, encode(extensions.digest(body, 'sha256'), 'hex'), now()
from terms;

-- The member-facing self-service endpoint is no longer executable. Any future
-- operational override must use an authenticated backoffice workflow.
revoke execute on function public.withdraw_my_mesa_os_tutoria_context(uuid) from authenticated;
revoke execute on function private.withdraw_my_mesa_os_tutoria_context(uuid) from authenticated;
