# MOS-CP — Mesa OS Construction Protocol

## Modo padrão

Durante construção, o modo padrão é `BUILD`. Ele permite implementar, testar, corrigir e refatorar dentro do escopo. Não permite inventar produto.

## Hierarquia de autoridade

1. Constitution.
2. Blueprint, V2 Scope e ADRs.
3. Backlog Master e Traceability Matrix.
4. Feature Specification.
5. Current Scope / sprint atual.
6. Instruções da conversa.
7. Sugestões da IA.

Em conflito, vence o nível superior. Uma solicitação explícita de alteração de governança deve primeiro atualizar os documentos correspondentes.

## Regras de BUILD

- Não adicionar funcionalidade, entidade, fluxo, tela, métrica, automação ou regra de negócio não autorizada.
- Melhorias descobertas viram `PROPOSAL`; não são implementadas silenciosamente.
- Mudança em decisão FROZEN exige Change Request.
- Não antecipar infraestrutura de possibilidade futura (YAGNI).
- Não realizar refatoração ampla não relacionada ao sprint.
- Toda migration é versionada; `DROP`, `TRUNCATE` e exclusão massiva exigem Change Request.
- Dependências devem ser fixadas no lockfile.

## Pre-Flight obrigatório

Antes de editar: declarar item, documentos consultados, escopo, fora do escopo, arquivos previstos, migrations, riscos, testes e conflitos.

## Regression Guard

Uma entrega só termina após lint, typecheck, testes relevantes e build. Testes de banco e E2E entram quando houver infraestrutura/fluxo correspondente.

## Post-Flight obrigatório

Registrar implementado, deliberadamente não implementado, testes, migrations, documentação, dívida técnica, proposals e rastreabilidade.
