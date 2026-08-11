# SCH-2.16A — Schema-driven Validation Generalization

**Status:** PROPOSED — BUILD NOT AUTHORIZED

## Objetivo

Fazer a validação server-side interpretar o schema publicado da Ferramenta, sem codificar nomes de campos específicos.

## Escopo

- Interpretar `repeatable_object`, `minItems`, `maxItems` e campos string obrigatórios.
- Suportar controles `input` e `textarea`, rótulo, ajuda e `maxLength`.
- Rejeitar campos desconhecidos, ausentes, tipos inválidos, limites excedidos e payload total acima de 128 KiB.
- Manter o contrato e os dados da Ferramenta da Missão 1.

## Fora do escopo

Select, número, data, arquivo, condição, fórmula, nested objects ou editor administrativo.

## Regras

1. O schema publicado é a única autoridade dos campos.
2. Schemas fora do subconjunto suportado falham de modo seguro.
3. Validação continua dentro da função owner-only.
4. Ferramenta ligada a Implementação confirmada continua imutável.

## Critérios de aceite

- A Ferramenta existente continua salvando payloads válidos e rejeitando inválidos.
- A nova Ferramenta usa a mesma função sem branches por código/nome.
- Testes cobrem chaves extras, ausentes, tipos, itens e tamanhos.
