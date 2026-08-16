# Governance Checkpoint — IAM-2.28 Onboarding controlado

**Status:** APPROVED FOR BUILD — owner aprovou em 2026-08-12  
**Gatilho:** o teste de GitHub OAuth na homologação confirmou que o provedor funciona, mas a ausência de uma identidade já provisionada resulta em `signup_disabled`. A tentativa de habilitar cadastro público foi interrompida.

## Objetivo concreto

Permitir que uma pessoa previamente autorizada pela Mesa dos Donos entre sem senha e sem espera por magic link, preservando a regra de entrada exclusiva por convite e o vínculo organizacional criado antes do primeiro acesso.

## Autoridades consultadas

- `00-CONSTITUTION.md`: segurança, menor privilégio, rastreabilidade e ausência de complexidade para o membro.
- `02-V2-SCOPE.md`: ambientes separados e arquitetura modular.
- ADR-027: entrada somente por convite; sem cadastro público; primeiro vínculo provisionado administrativamente.
- ADR-033: cloud-first, branch, CI e promoção única.
- `145-DEFINITION-PACK-MEMBER-EXPERIENCE-AND-INTELLIGENCE-BOUNDARIES.md`: separar experiência do membro da operação interna.
- Conversa fonte `Mesa OS V2`: acesso por e-mail/código e Google como experiência desejada; mínima burocracia para empresário.

## Escopo proposto

1. **Pré-autorização interna:** uma matrícula contém e-mail normalizado, organização, papel inicial, expiração e estado. Ela não cria vínculo por si só nem expõe uma interface administrativa ao membro.
2. **Provisionamento controlado:** apenas um adaptador server-side de operação cria a identidade Auth e o vínculo ativo a partir de matrícula válida; segredos ficam em runtime gerenciado e ações são auditadas.
3. **Entrada sem senha:** e-mail com código temporário para uma identidade já provisionada; não cria usuários e não revela se um e-mail está cadastrado.
4. **Google OAuth opcional:** somente para identidade já provisionada e e-mail verificado coincidente; não habilita cadastro público nem cria vínculo automático.
5. **Experiência de falha clara:** acesso sem matrícula recebe mensagem neutra e caminho de suporte, sem enumerar usuários ou organizações.

## Deliberadamente fora do escopo

- liberar cadastro público, signup automático, identidade anônima ou vínculo criado pela pessoa;
- interface de backoffice, concierge, RBAC além de `owner`/`member`, MFA ou SSO empresarial;
- alterar a produção, configurar provedores externos, enviar e-mails reais, criar usuários reais ou usar a homologação atual;
- WhatsApp, IA, TutorIA, ferramentas metodológicas, dados de negócio ou mudança de Terms;
- login por senha como caminho novo.

## Dados e segurança

- nova matrícula possui apenas dados mínimos de acesso e expiração;
- toda leitura/gravação é organizacional e server-side; RLS, grants explícitos e trilha de auditoria são obrigatórios;
- service role nunca é exposta ao navegador; a operação interna não é uma API pública;
- códigos expiram, são de uso único, sofrem rate limit e resposta neutra; nenhum token ou segredo é persistido em texto claro;
- Google exige configuração externa e credenciais próprias por ambiente, portanto é um gate operacional separado do BUILD de código.

## Arquivos previstos após aprovação

- migration versionada para matrículas e auditoria;
- `src/modules/identity-access/*` para contratos, ações e telas de entrada;
- adaptador server-side de provisionamento restrito;
- testes unitários, de integração SQL e testes de UI;
- atualização de `10-CURRENT-SCOPE.md`, matriz de rastreabilidade, Pre-Flight e Post-Flight.

## Critérios de aceite

1. Cadastro público permanece desativado em todos os ambientes.
2. Sem matrícula válida, nenhuma identidade, membership ou organização é criada.
3. Com matrícula válida, a identidade recebe somente o vínculo previsto e o evento é auditado.
4. A entrada por código não divulga se o e-mail existe e respeita expiração/rate limit.
5. Google só autentica uma identidade pré-provisionada com e-mail verificado correspondente.
6. RLS, lint, typecheck, testes e build passam; produção permanece sem alteração até promoção autorizada.

## Condições de parada

- não criar esta capacidade sem aprovação explícita deste pack;
- parar se a integração do provedor exigir mudança de custo, compartilhamento de segredo no chat, cadastro público ou acesso a dados de outra organização.
