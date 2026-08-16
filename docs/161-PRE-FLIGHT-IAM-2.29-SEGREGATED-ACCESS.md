# Pre-Flight — IAM-2.29 Acesso segregado

**Ambiente de BUILD:** branch `agent/member-experience-refinement`; banco somente na branch Supabase `pjkfifjcaezspwessaem` após validação local.

## Alterações previstas

- Migration aditiva para grants internos, auditoria e RPCs restritos para matrícula/revogação.
- Rotas `/ops/login` e `/ops`, guardas server-side e UI mínima sem dados de negócio.
- Revisão do login de membro para manter a experiência de e-mail + código separada do acesso interno.
- Testes de capability, negação, isolamento, expiração e contratos de matrícula.

## Fora do escopo

- Cadastro de e-mails reais, produção, Google, senha, MFA, SSO, dados de membro no backoffice, suporte por impersonação, IA, conteúdo e dashboards.

## Riscos e controles

| Risco | Controle |
| --- | --- |
| URL interna acessada por membro | Guarda no servidor e RLS; capability explícita e teste de negação. |
| Operador lê dados de organizações | Não há policy, query ou loader de dados de negócio em `/ops`. |
| Criação pública | RPCs somente para `internal_operator`; signup segue desligado. |
| Vínculo incorreto | Matrícula cria somente papel/organização indicados, com expiração e auditoria. |
| Segredo no cliente | Nenhum service key, token administrativo ou segredo entra em UI/ambiente público. |

## Verificação

- lint, typecheck, testes, build e `git diff --check`;
- testes de banco e Security Advisor após migration na branch isolada;
- smoke de operador e membro somente após bootstrap dos dois e-mails fornecidos pelo owner;
- sem merge ou deploy de produção neste incremento.
