# Pre-Release Review — RT-2.20

**Status:** técnica aprovada no ambiente isolado; promoção e deploy ainda pendentes.

## Governança e fonte

- Escopo conferido contra Constituição, V2 Scope, ADRs, Construction Protocol, Current Scope e a baseline histórica `Mesa OS V2`.
- O mapa 4 × 4 permanece a fonte metodológica versionada. A tela Jornada passou a buscar a revisão publicada, em vez de uma constante de interface.
- Nenhum conteúdo, treinamento, ferramenta adicional, autonomia TutorIA, WhatsApp ou dado histórico foi inventado.

## Dados e projeções

- T1 e ciclos seguintes mantêm sequência persistida; o carregador do produto lê somente o ciclo ativo para evitar ambiguidade quando T2/T3 existirem.
- Evidências são projetadas sobre todas as Missões do ciclo ativo, não somente a Missão disponível.
- Evolução usa observações métricas validadas e conserva estado vazio quando não há dado comparável.
- Execuções diagnósticas antigas permanecem intactas; não há comparação automática entre revisões incompatíveis.

## Banco e segurança

- Migrations locais foram reconciliadas com os identificadores efetivamente aplicados no branch Supabase de teste.
- RLS e grants explícitos permanecem nos novos objetos públicos.
- O advisor de segurança do branch retornou zero alertas após separar gateways públicos `SECURITY INVOKER` da lógica interna `private`.

## Verificação executada

- Estrutura do branch: mapa 4 × 4, ciclos temporais, episódios diagnósticos, métricas, evidências revisáveis e fronteira de RPC conferidos.
- Aplicação: lint, typecheck, 39 testes e build de produção passaram.
- Preview Netlify do PR 12 foi reconstruído com `NEXT_PUBLIC_SUPABASE_URL` e chave pública limitadas ao contexto `deploy-preview`, apontando para o branch Supabase de teste. Produção mantém suas próprias variáveis.
- Smoke não autenticado confirmou que o preview carrega a tela de login sem erros de console.

## Gates ainda pendentes

1. Commit revisado e publicação da branch no repositório.
2. Pull request e CI remoto.
3. Preview integrado com o branch Supabase de teste e smoke autenticado.
4. Aprovação explícita de promoção do branch Supabase e merge/deploy único de produção.

Não houve alteração em produção ou no site Netlify de produção nesta revisão.

## Gate de smoke autenticado

O branch Supabase de teste não recebeu usuários, organizações ou memberships reais — decisão correta para não replicar dados de membros em homologação. Por isso, a sessão existente da produção é rejeitada no preview isolado e o smoke autenticado continua pendente de uma conta-fixture convidada, exclusiva para homologação. Nenhuma cópia de dados reais será usada para contornar esse gate.
