# Pre-Flight — RT-2.21 TutorIA Foundation

**Status:** PASS — 2026-08-11  
**Ambiente de BUILD:** branch Supabase isolado `tqpxqevlhfyqnjdrhlhd`; preview Netlify do PR 12. Produção permanece intacta.

## Autoridades consultadas

- `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md` e `10-CURRENT-SCOPE.md`.
- SRC-001 / Mesa OS V2, por meio do Source Register, da matriz de reconciliação, da arquitetura canônica do TutorIA e da política de isolamento.
- Definition Pack RT-2.21 aprovado e Alignment Check correspondente.

## BUILD autorizado

1. Contexto tipado e mínimo, sempre escopado por identidade, organização e finalidade.
2. Policy engine determinístico com `allow`, `deny` e `escalate`.
3. Gateway de leitura allow-list e eventos de auditoria sem conteúdo sensível.
4. CTA contextual honesta, sem alegação de análise ou resposta de IA.
5. Migrations aditivas, RLS, grants mínimos, tipos gerados e testes de isolamento.

## Fora do escopo

Modelo/provedor/segredo de IA, chat, RAG, memória conversacional, criação de ferramenta, decisão de empate, revisão de evidência, automação, WhatsApp, e-mail proativo, dados entre organizações e produção.

## Arquivos e dados previstos

- Migration RT-2.21 para auditoria de contexto, decisão de política e execução de tool de leitura.
- Novo módulo `src/modules/tutoria-foundation` para contratos, política, gateway e testes.
- Ajuste limitado do app shell para CTA de TutorIA em preparação.
- Tipos Supabase regenerados e documentação de Post-Flight/segurança.

## Riscos e controles

| Risco | Controle |
| --- | --- |
| Contexto de outra organização | RLS + identidade autenticada + organização derivada do vínculo, nunca da entrada do cliente |
| Auditoria com dados sensíveis | somente códigos, fontes, campos ausentes e metadados; sem texto de evidência ou conversa |
| Bypass por função privilegiada | nenhum RPC novo; políticas e gateway no servidor da aplicação |
| Resposta de IA fictícia | CTA de preparação, sem geração de conteúdo |

## Verificações exigidas

- Consulta de schema e RLS no branch isolado.
- Advisor de segurança e performance.
- Testes unitários de policy/gateway; lint, typecheck e build.
- Preview isolado; o smoke autenticado continua opcional até o owner retomar o teste de produção, sem promover dados reais ao branch.
