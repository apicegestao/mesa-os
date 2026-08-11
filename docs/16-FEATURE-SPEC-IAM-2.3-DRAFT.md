# IAM-2.3 — Identity & Access Foundation

**Status:** DRAFT — NOT AUTHORIZED FOR BUILD

## Objetivo

Definir uma fundação segura de identidade, sessão e pertencimento organizacional que permita autorizar incrementos posteriores sem acoplar regras de negócio ao provedor de autenticação.

## Problema resolvido

O sistema ainda não possui uma forma governada de identificar uma pessoa, manter sua sessão e determinar a qual organização ela pode acessar.

## Usuários

- Pessoa convidada ou previamente autorizada a acessar uma organização.
- Operador autorizado a administrar o acesso, condicionado à definição dos papéis.

## Escopo preliminar

- Autenticação via Supabase Auth.
- Sessão segura compatível com Next.js server-side rendering.
- Identidade interna separada da identidade do provedor.
- Organização e vínculo de pertencimento mínimo.
- Proteção de rota autenticada neutra, sem tela ou dado de negócio.
- Encerramento de sessão.
- RLS e grants explícitos para qualquer tabela exposta.
- Eventos técnicos mínimos de autenticação, sem conteúdo sensível.

## Fora do escopo

- RBAC completo ou permissões de domínio.
- Journey, TutorIA, Tools, Concierge, WhatsApp e dashboards.
- Cadastro público sem convite.
- Login social, MFA, SSO empresarial ou white label.
- Administração completa de membros.
- Perfil empresarial e dados metodológicos.

## Fluxo preliminar

1. Pessoa autorizada inicia autenticação.
2. O provedor valida a credencial pelo método aprovado.
3. O sistema estabelece sessão segura.
4. O servidor resolve a identidade interna e o vínculo organizacional.
5. A pessoa acessa somente um shell autenticado neutro.
6. A pessoa pode encerrar a sessão.

## Regras de negócio

- Nenhuma identidade autenticada recebe acesso organizacional implicitamente.
- O vínculo organizacional é explícito e auditável.
- Identidade do provedor não substitui a identidade interna.
- O cliente nunca recebe chaves secret ou service-role.
- Regras específicas de papéis dependem de decisão aprovada.

## Permissões

Modelo detalhado pendente. O princípio vinculante é negar por padrão e conceder o mínimo necessário.

## Dados necessários

- Identidade interna.
- Referência à identidade do provedor.
- Organização.
- Vínculo identidade–organização e seu estado.

Nomes de tabelas, cardinalidades e estados finais serão definidos no Design Review antes do BUILD.

## Eventos de domínio

Ainda não autorizados. Eventos técnicos de login, logout e falha podem ser registrados sem credenciais, tokens ou dados sensíveis.

## UX

- Linguagem não técnica.
- Próxima ação clara.
- Mensagens de erro que não revelem a existência de contas.
- Mobile validado.
- Shell autenticado neutro; nenhum dashboard de negócio.

## Estados vazios

- Identidade válida sem vínculo ativo: acesso negado com orientação segura, sem criar vínculo automaticamente.

## Estados de erro

- Credencial inválida.
- Link expirado ou já utilizado, caso magic link seja aprovado.
- Sessão expirada.
- Vínculo ausente ou inativo.
- Indisponibilidade temporária do provedor.

## Auditoria

- Resultado técnico de autenticação.
- Início e término de sessão quando tecnicamente apropriado.
- Criação, ativação e revogação de vínculos, após autorização do fluxo administrativo.
- Nunca registrar senha, token, segredo ou conteúdo sensível.

## Critérios de aceite preliminares

- Pessoa não autenticada não acessa rota protegida.
- Pessoa autenticada sem vínculo ativo não recebe acesso organizacional.
- Pessoa autenticada com vínculo válido acessa apenas o shell neutro autorizado.
- Logout invalida a sessão e retorna ao estado público.
- Políticas RLS impedem leitura entre organizações.
- Nenhum segredo aparece no cliente, logs ou repositório.
- Lint, typecheck, testes, build e testes de banco/E2E relevantes aprovados.

## Testes necessários

- Unitários para regras de resolução de acesso.
- Integração para sessão server-side.
- Banco/RLS para isolamento entre organizações.
- E2E para login, bloqueio, sessão expirada e logout.
- Verificação de logs e ausência de secrets.

## Dependências

- Projeto Supabase de desenvolvimento operacional.
- Estratégia de staging antes de dados persistentes de homologação.
- Migração versionada e plano de rollback compatível.

## Decisões obrigatórias antes do BUILD

1. Método inicial de autenticação: magic link, e-mail/senha ou outro método aprovado.
2. Entrada no sistema: somente convite ou cadastro controlado.
3. Papéis mínimos e quem pode concedê-los.
4. Uma pessoa pode pertencer a mais de uma organização no primeiro release?
5. Quem cria a primeira organização e o primeiro vínculo administrativo?
6. Política de expiração/revogação de convite e sessão.
7. Projeto Supabase dedicado para staging.

Sem essas respostas, IAM-2.3 permanece bloqueado para BUILD.
