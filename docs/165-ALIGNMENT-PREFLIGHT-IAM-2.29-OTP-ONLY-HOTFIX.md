# Alignment Check e Pre-Flight — IAM-2.29 OTP-only

**Status:** BUILD autorizado pelo owner em 2026-08-13  
**Tipo:** hotfix de indisponibilidade da autenticação em homologação  
**Ambiente de BUILD:** branch `agent/member-experience-refinement`; produção preservada

## Objetivo

Restabelecer uma entrada profissional, simples e não enumerável: apenas
e-mail previamente autorizado + código temporário. O fluxo deve sempre
oferecer o campo de código após um pedido válido de e-mail, inclusive quando
o provedor retorna uma falha que não pode ser exposta ao usuário.

## Autoridades consultadas

- `00-CONSTITUTION.md` — menor privilégio, rastreabilidade e ausência de
  complexidade exposta ao membro.
- `09-CONSTRUCTION-PROTOCOL.md` — hotfix mínimo, testes e Post-Flight.
- `10-CURRENT-SCOPE.md` — IAM-2.29 e a vedação a senha e login social.
- `159-DEFINITION-PACK-IAM-2.29-SEGREGATED-ACCESS-DRAFT.md` — entrada por
  e-mail + código, matrícula prévia e resposta neutra.

## Escopo

- Remover GitHub, senha e link mágico das superfícies e rotas de acesso.
- Remover a flag pública que pode ocultar o único método de entrada.
- Tornar o formulário resiliente a falhas transitórias do provedor: a etapa
  de código permanece acessível, com mensagem neutra.
- Manter `shouldCreateUser: false`, segregação membro/equipe, matrícula
  prévia, RLS, auditoria e produção sem alterações.

## Fora do escopo

- Cadastro público, Google, MFA, SSO, alteração de rate limits, SMTP novo,
  produção, dados de negócio, TutorIA e backoffice além de IAM-2.29.

## Riscos e validação

| Risco | Controle |
| --- | --- |
| Enumerar e-mails | Mensagem idêntica para sucesso, erro e e-mail não autorizado. |
| Criar conta por engano | `shouldCreateUser: false` e teste explícito. |
| Ocultar o campo após erro transitório | Teste de regressão para mostrar a etapa de código também no erro. |
| Reintroduzir método proibido | Teste de interface e remoção de componentes/rotas legadas. |

**Verificações previstas:** lint, typecheck, testes, build, `git diff --check`
e smoke no deploy de homologação. Não há migration.
