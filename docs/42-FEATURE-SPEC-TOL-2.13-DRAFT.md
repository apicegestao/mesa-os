# TOL-2.13 — Structured Tool Foundation

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11.

## Objetivo

Permitir que o owner construa um `Mapa de Papéis e Decisões` estruturado para a Missão `Clareza de papéis e decisões`, preservando um rascunho rastreável sem alegar implementação ou evolução.

## Problema

A Missão explica o resultado esperado, mas ainda não oferece um objeto metodológico estruturado para organizar papéis, responsabilidades e decisões essenciais da empresa.

## Escopo proposto

- Uma definição de Ferramenta versionada e schema-driven ligada à definição da Missão.
- Uma instância da Ferramenta por Missão da organização.
- Rascunho editável e retomável somente pelo owner ativo.
- Entradas repetíveis para representar papéis ou áreas da empresa.
- Validação de tipos, limites e campos obrigatórios no servidor.
- Registro de definição, revisão, autor e timestamps.

## Schema candidato

Cada entrada do mapa contém:

- `role_name`: nome do papel ou área.
- `expected_result`: principal resultado pelo qual responde.
- `responsibilities`: responsabilidades essenciais.
- `decision_rights`: decisões que pode tomar sem escalar ao owner.

O schema, rótulos, textos de ajuda, obrigatoriedade, limites e ordem pertencem à revisão metodológica, não ao componente React.

## Fora do escopo

- Upload, download, PDF, planilha ou documento avulso.
- Organograma, cadastro de pessoas, cargos formais ou permissões do sistema.
- Checklist, tarefas, prazos, metas ou gestão de projetos.
- Submissão final, aprovação, conclusão ou desbloqueio de Missão.
- Implementação, Evidência, impacto, score ou Evolução.
- TutorIA, sugestão automática, geração por IA ou acesso direto de IA ao banco.
- Colaboração por `member`, comentários, notificações ou WhatsApp.

## Invariantes propostas

1. Ferramenta não existe sem Missão disponível e organização válida.
2. Definição e schema são versionados e imutáveis após publicação.
3. A instância preserva a revisão usada e possui no máximo um rascunho por Missão.
4. Dados são validados no servidor contra o schema publicado.
5. Somente o owner ativo lê e altera o rascunho.
6. Campos desconhecidos, tipos inválidos e limites excedidos são rejeitados.
7. Salvar rascunho não conclui a Missão nem representa Implementação ou Evidência.
8. Ferramenta não altera diagnóstico, prioridade, ciclo ou conteúdo da Missão.

## Fluxo candidato

1. O owner abre a Missão disponível.
2. O sistema apresenta o `Mapa de Papéis e Decisões` da revisão publicada.
3. O owner adiciona uma ou mais entradas e salva o rascunho.
4. O owner pode sair e retomar o mesmo rascunho.
5. A Missão permanece disponível; nenhuma etapa seguinte é liberada.

## Decisões obrigatórias antes do BUILD

1. Confirmar `Mapa de Papéis e Decisões` como primeira Ferramenta.
2. Confirmar os quatro campos candidatos e se todos são obrigatórios.
3. Definir mínimo e máximo de entradas do mapa.
4. Salvar por botão explícito ou automaticamente com indicação de estado?
5. Permitir remover e reordenar entradas durante o rascunho?
6. Definir limites de caracteres por campo.
7. O rascunho fica disponível após a data final do ciclo?
8. Confirmar que não haverá submissão/conclusão nem desbloqueio neste incremento.

## Recomendação para aprovação

- Aprovar o `Mapa de Papéis e Decisões` com os quatro campos obrigatórios.
- Exigir de 1 a 20 entradas.
- Usar salvamento explícito, com mensagem clara de sucesso ou erro.
- Permitir adicionar, remover e reordenar entradas antes de salvar.
- Limites: papel/área 80 caracteres; resultado 300; responsabilidades 1.000; decisões 1.000.
- Manter leitura e edição após a data final do ciclo, sem transição automática.
- Permanecer em estado único `draft`; sem submissão, conclusão ou desbloqueio.
- Persistir payload validado contra schema versionado e limitar tamanho total.

## Critérios de aceite candidatos

- A interface é renderizada a partir da definição e do schema publicados.
- O owner salva e retoma um único rascunho da Missão.
- Entradas inválidas ou fora dos limites são rejeitadas de modo compreensível.
- Organização diferente, `member` e anônimo não acessam o rascunho.
- Salvar não altera o estado da Missão nem libera a próxima.
- Nenhuma Implementação, Evidência, score ou Evolução é criada.
- Lint, typecheck, testes, build, pgTAP e teste transacional passam antes do release.

## Gate

Gate de BUILD aberto após aprovação explícita, atualização do Current Scope e Pre-Flight TOL-2.13.
