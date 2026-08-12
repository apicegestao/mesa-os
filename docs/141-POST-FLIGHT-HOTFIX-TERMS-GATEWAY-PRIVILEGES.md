# Post-Flight — HOTFIX-TMS-01 Termos e Privilégios

**Status:** BUILD / homologação  
**Produção:** não alterada

## Causa corrigida

Os gateways públicos de Termos usam `SECURITY INVOKER` e delegam a funções `private`. Aquelas implementações estavam revogadas também para `authenticated`, o que bloqueava a leitura do estado de Termos e deixava o aceite sem identificador de versão válido.

## Correção

Foram concedidas permissões de execução apenas ao papel `authenticated` nas quatro funções internas necessárias ao gateway. O schema `private` continua não exposto, os gateways públicos continuam `SECURITY INVOKER`, e as funções privilegiadas preservam `auth.uid()`, vínculo ativo e escopo organizacional.

## Validação prevista

- Recarregar a sessão sintética em homologação e confirmar que a versão publicada dos Termos é retornada.
- Registrar um aceite sintético e conferir recibo/política.
- Reexecutar Security Advisor antes da revisão do Release Train.
