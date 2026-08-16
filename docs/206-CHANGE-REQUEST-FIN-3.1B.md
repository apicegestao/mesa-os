# Change Request — FIN-3.1B Checkout, Entitlement e Entrada sem Senha

**Status:** APPROVED — owner autorizou o pack e o Asaas Sandbox em 2026-08-14.

## Mudança

Autoriza, exclusivamente em homologação, o adaptador inicial Asaas para checkout hospedado, registro idempotente de eventos recebidos, reconciliação para os fatos financeiros canônicos e elegibilidade de acesso.

## Preservado

- O domínio financeiro continua independente do Asaas por uma fronteira de adaptador.
- A URL de retorno do checkout não concede acesso.
- O membro somente entra com o e-mail previamente confirmado no pagamento e uma matrícula elegível.
- Produção, cartão, PIX, dados bancários, estorno automático, e-mail transacional e comunicação externa continuam fora deste incremento.

## Risco e controle

O endpoint de webhook valida o token próprio do provedor antes de processar o evento; eventos repetidos são idempotentes; payload bruto não é persistido; o processamento não usa segredos no navegador nem em logs.
