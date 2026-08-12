# Post-Flight — Release Train 1: smoke de homologação

**Data:** 2026-08-12  
**Ambiente:** homologação `tqpxqevlhfyqnjdrhlhd`  
**Produção:** não alterada

## Conta e isolamento

O smoke utilizou exclusivamente uma identidade sintética e uma organização QA isolada. Nenhum membro, organização, sessão ou dado real foi copiado para homologação.

## Caminho comprovado

1. A identidade sintética autenticou-se na aplicação de homologação.
2. O gate de Termos v1 foi exibido antes da área autenticada.
3. O aceite foi registrado e ativou a política de contexto longitudinal da organização QA.
4. A área autenticada foi liberada após o aceite.
5. A página **Conta e segurança** exibiu o recibo da versão exata aceita, incluindo data, versão e hash.
6. O link privado de recibo PDF foi montado com o identificador do próprio recibo.

## Proteções verificadas

- `anon` não executa as implementações privadas de aceite ou recibo;
- `authenticated` só pode usá-las pela sessão autenticada, com filtro de `auth.uid()` e vínculo organizacional ativo;
- Security Advisor da homologação não reporta alertas;
- não houve alteração em produção.

## Regressão

- typecheck: aprovado;
- testes: 34 arquivos, 96 testes aprovados;
- lint: aprovado sem avisos;
- build: aprovado.

## Limites desta evidência

O teste automatizado do gerador PDF passou e a interface autenticada exibiu o link privado. A inspeção visual do arquivo baixado continua parte do smoke pós-promoção, pois o navegador de teste bloqueou a abertura automática de um endpoint de download. Isso não autoriza promoção por si só.

## Gate de produção

O Release Train permanece bloqueado para produção até que, em pacote único aprovado explicitamente pelo owner, sejam tratados: a paridade ordenada das migrations RT-2.20–RT-2.27A, os alertas legados de RPC na produção, a proteção contra senhas vazadas, a configuração de variáveis e o smoke pós-release com rollback disponível.
