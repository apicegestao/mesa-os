# MOS-CP — Mesa OS Construction Protocol

**Versão:** 1.2

## Modo padrão

Durante construção, o modo padrão é `BUILD`. Ele permite implementar, testar, corrigir e refatorar dentro do escopo. Não permite inventar produto.

## Hierarquia de autoridade

1. Constitution.
2. Approved Product Source Register e decisões fonte explicitamente aprovadas.
3. Blueprint, V2 Scope e ADRs.
4. Backlog Master e Traceability Matrix.
5. Feature Specification.
6. Current Scope / sprint atual.
7. Instruções da conversa corrente.
8. Sugestões da IA.

Em conflito, vence o nível superior. Uma solicitação explícita de alteração de governança deve primeiro atualizar os documentos correspondentes.

## Source Recovery obrigatório

A conversa `Mesa OS V2`, identificada de forma estável no Source Register, é a baseline histórica oficial do produto.

Antes de definir ou implementar qualquer domínio relevante, o agente deve:

1. localizar o domínio na conversa fonte;
2. comparar as decisões com Constitution, Blueprint, Scope, ADRs, Backlog e UX Architecture;
3. registrar requisitos ausentes ou conflitos na matriz de reconciliação;
4. canonizar a decisão por Change Request quando necessário;
5. somente então preparar Definition Pack e BUILD.

O agente não pode alegar que uma capacidade aprovada deixou de existir apenas porque foi omitida de um resumo posterior. Também não pode executar diretamente a partir da conversa sem especificação, critérios de aceite e Current Scope.

## Regras de BUILD

- Não adicionar funcionalidade, entidade, fluxo, tela, métrica, automação ou regra de negócio não autorizada.
- Melhorias descobertas viram `PROPOSAL`; não são implementadas silenciosamente.
- Mudança em decisão FROZEN exige Change Request.
- Não antecipar infraestrutura de possibilidade futura (YAGNI).
- Não realizar refatoração ampla não relacionada ao sprint.
- Toda migration é versionada; `DROP`, `TRUNCATE` e exclusão massiva exigem Change Request.
- Dependências devem ser fixadas no lockfile.

## Pre-Flight obrigatório

Antes de editar: declarar item, documentos consultados, decisões da conversa fonte consultadas, escopo, fora do escopo, arquivos previstos, migrations, riscos, testes e conflitos.

## Regression Guard

Uma entrega só termina após lint, typecheck, testes relevantes e build. Testes de banco e E2E entram quando houver infraestrutura/fluxo correspondente.

## Post-Flight obrigatório

Registrar implementado, deliberadamente não implementado, testes, migrations, documentação, dívida técnica, proposals e rastreabilidade.

## Checkpoints de Governança

Checkpoints são gates curtos e obrigatórios para manter a execução alinhada à conversa fonte `Mesa OS V2` e ao contrato operacional do repositório. Eles não substituem Definition Pack, Pre-Flight ou Post-Flight.

Um checkpoint ocorre antes de cada incremento material, antes de qualquer promoção e imediatamente quando houver dúvida de escopo. Seu registro deve declarar:

1. objetivo concreto e requisito da conversa fonte recuperado;
2. autoridades e decisões consultadas;
3. o que será alterado e o que continua explicitamente fora do escopo;
4. dados, segurança, migrations, IA e impacto de custo envolvidos;
5. critérios objetivos de validação e condição de parada;
6. decisão do owner necessária, quando houver mudança material de escopo, risco ou custo.

O agente deve parar para reconciliação — e não continuar por inferência — diante de conflito de autoridade, lacuna material da conversa fonte, decisão `FROZEN`, risco de isolamento, ação destrutiva, nova dependência/custo ou pedido que extrapole o Current Scope. Checkpoints internos de BUILD não consomem aprovação do owner quando o incremento já estiver autorizado; checkpoints de escopo ou promoção exigem aprovação explícita.

## Release Train seguro

O Fast Track reduz esperas e deploys, nunca controles. Pode agrupar de dois a quatro incrementos consecutivos do core loop quando formarem uma única entrega vertical homologável.

### Regras vinculantes

- Cada incremento mantém Feature Spec, escopo, critérios de aceite, migrations e rastreabilidade próprios.
- Um Definition Pack pode reunir as decisões dos incrementos e receber uma aprovação explícita única.
- Uma aprovação em lote não autoriza itens ausentes do pack nem altera decisões `FROZEN`.
- O trabalho ocorre em branch `agent/*` ou `release/*`; `main` representa somente produção.
- Pull Request para `main` exige CI completo e revisão do diff integrado.
- Migrations permanecem separadas, ordenadas, aditivas e verificadas antes do merge.
- Segredos permanecem exclusivamente nos ambientes gerenciados.
- Um único merge e um único deploy de produção encerram o Release Train.
- Post-Flight pode ser consolidado, mas deve registrar resultados e pendências por incremento.
- Commits exclusivamente documentais não devem consumir deploy de produção.

### Gates do Release Train

1. Alignment Check integrado.
2. Definition Pack com escopo, fora do escopo, specs e matriz de dependências.
3. Aprovação explícita do pack.
4. BUILD em branch com verificações contínuas.
5. Pre-Release Review: migrations, segurança, regressão e secret scan.
6. Merge único em `main`.
7. Deploy único, smoke test integrado e Post-Flight consolidado.

### Interrupção obrigatória

O train volta ao fluxo unitário quando surgir conflito de autoridade, mudança `FROZEN`, risco destrutivo, dependência externa não aprovada, falha de isolamento ou decisão de produto que altere materialmente o pacote aprovado.

Hotfix de segurança ou indisponibilidade pode usar fluxo separado, mas exige escopo mínimo, testes relevantes e Post-Flight próprio.
