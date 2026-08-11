# Hotfix — Evidence Validation Feedback

**Data:** 2026-08-11
**Status:** IN PROGRESS

## Incidente

A interface permitia acionar a submissão com descrição inferior a 20 caracteres. O banco rejeitava corretamente o payload, mas a aplicação retornava mensagem genérica.

## Evidência de segurança

- Missão 1 permaneceu `available`.
- Implementação permaneceu `implemented`.
- Nenhuma Evidência foi criada.
- Missões 2 e 3 permaneceram `locked`.
- Reprodução com payload válido em transação com rollback concluiu corretamente e não persistiu dados.

## Correção

- Validação explícita de tipo, descrição e data na Server Action.
- Botão desabilitado enquanto descrição/data forem inválidas.
- Contador e mínimo visíveis.
- Mensagens específicas sem expor detalhes do banco.

## Fora do escopo

Nenhuma migration, alteração de dados, transição de Missão ou mudança metodológica.
