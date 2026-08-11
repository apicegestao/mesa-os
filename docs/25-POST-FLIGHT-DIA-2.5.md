# Post-Flight — DIA-2.5 Diagnostic Foundation

**Backlog:** DIA-2.5  
**Status:** COMPLETE — PRODUCTION RELEASED  
**Data:** 2026-08-11

## Implementado

- Raio-X do Empresário no Mês 0 para `owner` ativo.
- Definição metodológica versionada e provisionada como dados.
- Cinco dimensões, vinte perguntas e escala aprovada de 1 a 5.
- Uma execução por organização/revisão/período.
- Rascunho persistente e retomável.
- Submissão transacional, resultado imutável e snapshot da revisão usada.
- IME, faixa de maturidade, score por dimensão, radar acessível e detalhamento.
- RLS em sete tabelas, grants mínimos e isolamento organizacional.
- Funções de escrita restritas, com validação de sessão, owner, organização, estado e payload.
- UI responsiva, navegação por dimensões, estados de progresso e feedback.
- Tipos TypeScript regenerados do schema remoto.

## Deliberadamente não implementado

- Mês 3, 6, 9 e 12.
- Evolução longitudinal, comparação e delta.
- Prioridade e demais etapas do core loop.
- Dashboard, IA, administração metodológica, colaboração ou reabertura.
- Gráficos ou bibliotecas do JSX de referência.

## Verificação

- ESLint: aprovado, zero warnings.
- TypeScript e rotas tipadas: aprovados.
- Vitest: 5 arquivos, 11 testes aprovados.
- Next.js production build: aprovado.
- Teste transacional remoto: criação, 20 respostas, submissão e resultado; payload controlado retornou IME 60, faixa `Em Maturação` e cinco dimensões com score 60.
- A transação de teste foi revertida; produção permaneceu com zero execuções e zero respostas.
- Supabase remoto: 1 definição, 1 revisão publicada, 5 dimensões, 20 perguntas, 5 opções e 7 políticas RLS.
- Netlify: deploy `6a7b25fca6e0a90009aab9bf`, pronto em 38 segundos; 88 arquivos e nenhum secret detectado.

## Migrations

Locais:

- `20260811132443_diagnostic_foundation.sql`
- `20260811133405_index_diagnostic_foreign_keys.sql`
- `20260811133531_fix_diagnostic_score_ambiguity.sql`

Registradas remotamente como versões `20260811133316`, `20260811133430` e `20260811133612` pelo conector Supabase.

## Segurança e advisors

- Cinco índices de foreign key apontados pelo advisor foram adicionados.
- Três avisos sobre funções `SECURITY DEFINER` são intencionais: são endpoints transacionais autenticados, têm `search_path` vazio, negam público/anônimo e revalidam owner e organização internamente.
- A proteção de senha vazada permanece não aplicável ao login exclusivamente por magic link.
- Avisos de índices ainda não utilizados são esperados antes do primeiro uso real.

## Limitações operacionais

- O smoke test visual autenticado aguarda o próximo login do owner. A sessão do navegador de QA estava expirada; nenhum magic link foi disparado automaticamente e nenhuma rota pública de teste foi criada.
- Staging persistente continua condicionado a projeto Supabase dedicado.

## Dívida técnica

- Automatizar E2E autenticado quando existir ambiente de staging dedicado.

## Próximo gate permitido

Owner entra em produção, inicia o Raio-X e valida visualmente o primeiro passo. Qualquer reaplicação, Evolução ou Prioridade exige novo sprint de Definition & Alignment e novo Current Scope.
