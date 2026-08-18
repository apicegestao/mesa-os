# Auditoria UX consolidada 3.12

## Escopo revisado

- Acesso único por e-mail e código.
- Área do membro: Hoje, Jornada, Diagnósticos, Evidências, Evolução, Conta e TutorIA.
- Área interna: CRM, carteira, suporte, financeiro, Intelligence, editorial e acessos.
- Desktop e móvel.

## Achados priorizados

1. **P0 corrigido:** ações da tela Hoje usavam âncoras que não existiam na mesma tela; o fluxo agora navega para a Jornada executável.
2. **P1 corrigido:** símbolos tipográficos distintos para navegação reduziam consistência visual e podiam renderizar de modo diferente no móvel. A navegação passa a usar ícones vetoriais próprios.
3. **P1 corrigido:** superfícies não tinham atalho de teclado para conteúdo principal; ambas as áreas passam a ter link de salto e destino focável.
4. **P1 corrigido:** nomenclatura interna “Core loop” não era clara para o membro; substituída por “Etapas da jornada”.
5. **P2 corrigido:** campo OTP recebe foco ao chegar na etapa de confirmação e limita caracteres ao tamanho de código esperado.
6. **P2 em melhoria visual:** unificar estados de foco, campos, botões, cartões e mensagens entre área do membro e operação sem alterar o modelo de permissões ou conteúdo.

## Critérios desta rodada

- Ações claras e navegáveis em todos os estados de jornada.
- Ícones, contraste e controles previsíveis em desktop e móvel.
- Sem alteração de dados, permissões, metodologia, IA ou integrações externas.
