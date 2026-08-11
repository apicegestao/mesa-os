# MIS-2.11 — Mission Foundation

**Status:** DRAFT — NOT AUTHORIZED FOR BUILD

## Objetivo

Representar o resultado operacional esperado dentro do ciclo ativo por meio de Missões estruturadas, compreensíveis e rastreáveis, preparando o próximo passo do core loop sem antecipar Ferramentas ou execução.

## Problema

O ciclo estabelece tempo e foco, mas ainda não declara resultados intermediários claros que orientem o owner sobre o que precisa ser realizado e por que isso importa.

## Escopo proposto

- Missões pertencem a um único ciclo e herdam seu contexto de prioridade.
- Cada Missão possui título, objetivo, justificativa, posição e estado controlado.
- A interface apresenta uma próxima Missão inequívoca e o contexto do ciclo.
- Criação e leitura permanecem restritas ao owner ativo.
- Registros preservam autoria e timestamps para rastreabilidade.

## Fora do escopo

- Ferramenta associada, formulário metodológico ou download.
- Checklist, subtarefa, plano detalhado ou gestão de projetos.
- Implementação, evidência, anexos, impacto, score ou evolução.
- TutorIA, geração automática, recomendação ou acesso de IA ao banco.
- Colaboração por `member`, notificações ou WhatsApp.
- Segundo ciclo, edição da prioridade ou encerramento do ciclo.

## Invariantes propostas

1. Uma Missão não existe sem ciclo ativo.
2. A Missão não altera prioridade, diagnóstico ou datas do ciclo.
3. A ordem é explícita e única dentro do ciclo.
4. Somente uma Missão pode ser apresentada como a próxima ação por vez.
5. Criar ou concluir uma Missão não representa, por si só, implementação, evidência ou evolução.
6. Textos metodológicos não ficam codificados na interface.
7. Estados e transições são validados no servidor e persistidos de forma rastreável.

## Fluxo candidato

1. O owner visualiza o ciclo ativo.
2. O sistema apresenta a sequência de Missões definida para aquele contexto.
3. A primeira Missão elegível aparece como próxima ação.
4. O owner abre a Missão e compreende objetivo e motivo.
5. Qualquer avanço posterior depende de incremento próprio de Ferramenta/Implementação.

## Decisões obrigatórias antes do BUILD

1. As Missões iniciais são provisionadas por definição metodológica versionada, criadas manualmente pelo owner ou geradas futuramente pelo TutorIA?
2. Quantas Missões compõem o primeiro ciclo e essa quantidade é fixa ou definida pela metodologia?
3. Os estados iniciais serão somente `locked` e `available`, ou haverá estado de conclusão já neste incremento?
4. Qual evento libera a Missão seguinte sem antecipar Implementação ou Evidência?
5. Título, objetivo e justificativa são imutáveis após a criação?
6. O owner pode pular, reordenar, arquivar ou substituir uma Missão?
7. Missões futuras ficam visíveis ou somente a próxima ação?
8. O ciclo ultrapassado continua permitindo acesso e transições de Missão?

## Recomendação para aprovação

- Usar definições metodológicas versionadas, sem geração por IA neste incremento.
- Quantidade e conteúdo determinados pela revisão metodológica, não por constante da interface.
- Começar com estados `locked` e `available`; conclusão depende de Implementação/Evidência futura.
- Liberar apenas a primeira Missão, sem avanço automático até existir um evento legítimo em incremento posterior.
- Conteúdo imutável por instância; mudanças exigem nova revisão metodológica.
- Sem pular, reordenar, arquivar ou substituir pelo owner.
- Exibir a próxima ação e uma indicação simples da sequência, sem detalhar Missões bloqueadas.
- Manter leitura após a data final do ciclo, sem transição automática.

## Critérios de aceite candidatos

- Nenhuma Missão é criada sem ciclo válido e pertencente à organização do owner.
- A definição metodológica usada é identificável e versionada.
- Ordem e próxima ação são determinísticas.
- O owner não consegue alterar conteúdo ou ordem.
- RLS e grants impedem acesso entre organizações.
- Nenhuma Ferramenta, Implementação, Evidência, score ou evolução é criada.
- Lint, typecheck, testes, build e testes transacionais passam antes do release.

## Gate

MIS-2.11 permanece bloqueado para BUILD até aprovação explícita das oito decisões, atualização do Current Scope e novo Pre-Flight.
