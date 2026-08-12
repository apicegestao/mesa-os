# Post-Flight — HOTFIX-TMS-02: recibos de termos

## Objetivo

Restabelecer a leitura autenticada do histórico e do comprovante individual de aceite dos Termos Mesa OS.

## Causa confirmada

As funções públicas de recibos são `security invoker` e encaminham a chamada para implementações privadas com escopo de identidade. As implementações privadas estavam corretamente revogadas para `authenticated`, o que também impedia o encaminhamento público autenticado.

## Correção

- Concedido `EXECUTE` apenas ao papel `authenticated` nas duas implementações privadas de recibo.
- Nenhuma permissão foi concedida a `anon` ou `public`.
- As funções preservam o filtro por `auth.uid()` e associação ativa à organização.

## Validações exigidas

- o membro autenticado visualiza exclusivamente seus próprios recibos;
- o download do recibo individual retorna somente um recibo pertencente ao membro;
- `anon` continua sem execução;
- Security Advisor permanece sem alertas novos na homologação.

## Escopo

Homologação somente. Produção permanece inalterada até aprovação explícita de promoção.
