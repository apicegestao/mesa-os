# Pre-Flight — DIA-2.5 Diagnostic Foundation

**Data:** 2026-08-11  
**Mode:** BUILD

## Item

DIA-2.5 — implementar o Raio-X do Empresário no Mês 0.

## Alignment Check

- O incremento inicia pelo primeiro passo do core loop canônico.
- A metodologia será dado versionado e separada do código.
- O IAM-2.3 fornece identidade, owner e organização necessários.
- O recorte não antecipa Prioridade, Evolução ou dashboard.
- Não altera decisão `FROZEN` e registra ADR-028 como decisão durável aceita.

## Autoridades consultadas

- Constitution, Blueprint, V2 Scope, ADR Log, Construction Protocol e Current Scope.
- Feature Spec DIA-2.5 e análise da fonte JSX.
- Documentação atual do Supabase sobre RLS, funções e segurança da Data API.

## Escopo

- Schema para definição/revisão, dimensões, perguntas, opções, execução e respostas.
- Seed metodológico idempotente.
- RLS por organização, escrita exclusiva de owner e grants mínimos.
- Rascunho, retomada, validação completa e submissão imutável.
- IME, faixa, resultado dimensional e detalhamento.
- UI responsiva e acessível integrada ao shell autenticado.
- Testes unitários, componentes, banco e quality gate completo.

## Fora do escopo

- Mês 3/6/9/12, evolução longitudinal, Prioridade e etapas posteriores.
- Dashboard, gráficos de terceiros, IA ou administração metodológica.
- Reabertura, sobrescrita, colaboração e exclusão pela aplicação.

## Arquivos previstos

- `src/modules/diagnostic/*`, rota autenticada e Design System foundation.
- Tipos Supabase.
- Migration e pgTAP.
- Documentos de governança, rastreabilidade e Post-Flight.

## Migration

Uma migration nova criada pela Supabase CLI, aditiva e sem operação destrutiva.

## Riscos e controles

- Isolamento multi-tenant: RLS, grants, índices e testes.
- Corrida na criação/submissão: constraints e função transacional restrita.
- Metodologia acoplada: seed versionado; UI consome dados.
- Resultado mutável: estado concluído protegido no banco.
- Dados em logs: registrar somente IDs técnicos e estado, nunca respostas.

## Testes previstos

- Fórmulas, faixas, validação e transições.
- Renderização, navegação, acessibilidade básica e estados.
- Estrutura, RLS, constraints e privilégios no banco.
- Lint, typecheck, Vitest e build.

## Conflitos

Nenhum identificado.
