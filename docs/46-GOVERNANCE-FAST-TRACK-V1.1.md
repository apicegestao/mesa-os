# Governance Fast Track v1.1

**Status:** APPROVED
**Data:** 2026-08-11

## Objetivo

Reduzir tempo de coordenação e consumo de deploys sem reduzir segurança, confiabilidade, qualidade ou autoridade documental.

## Modelo operacional

O Mesa OS passa a usar Release Trains de duas a quatro capacidades consecutivas que formem uma única entrega vertical homologável.

Cada train possui:

- um Alignment Check integrado;
- um Definition Pack com Feature Specs e matriz de dependências;
- uma aprovação explícita do pacote;
- uma branch de construção;
- CI completo durante o desenvolvimento;
- migrations separadas e ordenadas;
- uma Pre-Release Review;
- um merge e um deploy de produção;
- uma homologação e um Post-Flight consolidados.

## Primeiro train

`RT-2.15 — Core Loop Completion` deve definir, sem implementar antes da aprovação:

1. Implementation Foundation.
2. Evidence Foundation.
3. Mission Transition.
4. Core-loop status e próxima ação.

O resultado homologável será aplicar a primeira Missão, registrar evidência legítima e avançar transacionalmente para a segunda Missão.

## Segurança preservada

- RLS e grants mínimos em toda tabela exposta.
- Funções privilegiadas com autenticação e autorização internas.
- Validação server-side de payloads e estados.
- Segredos somente em ambientes gerenciados.
- Testes unitários, componentes, banco, typecheck, lint e build.
- Migrations versionadas, aditivas e testadas antes da produção.
- Smoke test com rollback antes do fluxo real do owner.

## Controle de deploy

- `main` é a branch de produção.
- Branches de trabalho não publicam em produção.
- Alterações exclusivamente em `/docs`, governança ou metadados não executáveis não iniciam build do site.
- Mudanças de runtime, dependências ou configuração do site continuam disparando build.
- Commits acumulados entram em um único deploy após aprovação do PR.

## Limites

Fast Track não significa BUILD irrestrito. Qualquer conflito, mudança `FROZEN`, ação destrutiva ou decisão material não prevista interrompe o train e exige nova aprovação.

## Dependência administrativa

A proteção técnica de `main` e a imposição de deploy Git-only dependem de configurações administrativas das plataformas. Até serem ativadas, o protocolo proíbe operacionalmente push funcional direto e deploy manual de produção.
