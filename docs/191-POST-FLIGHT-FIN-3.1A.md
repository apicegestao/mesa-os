# Post-Flight — FIN-3.1A Fundação de Receita

**Ambiente:** homologação `pjkfifjcaezspwessaem` somente  
**Produção:** inalterada  
**Data:** 2026-08-14

## Implementado

- papel interno Financeiro e capabilities mínimas;
- oferta e preço versionados;
- proposta vinculada a oportunidade comercial autorizada;
- contrato, cobrança, confirmação manual e entitlement canônicos;
- auditoria financeira e proteção de confirmação duplicada;
- interface interna mínima para oferta, proposta e confirmação controlada;
- RLS deny-by-default nas oito tabelas financeiras e grants explícitos para as RPCs necessárias.

## Deliberadamente não implementado

Checkout, provedor, cartão, PIX, webhook, dado sensível de pagamento, comunicação, automação, fiscal, produção e alteração automática de acesso do membro.

## Validações

- lint, typecheck, 114 testes e build aprovados;
- três migrations aplicadas e registradas somente em homologação;
- as oito tabelas financeiras confirmadas com RLS ativo;
- `anon` não executa RPC financeira e `authenticated` não lê faturas diretamente;
- confirmação manual tem guarda contra pagamento repetido para a mesma proposta e contra referência externa duplicada.
- smoke visual com sessão Admin na prévia consolidada: Kanban, atribuição de função Financeiro e área FIN-3.1A renderizaram corretamente, sem criação de dado financeiro.

## Segurança

O Security Advisor continua reportando as RPCs internas `SECURITY DEFINER` acessíveis a `authenticated`. A exposição é deliberada: todas exigem `auth.uid()`, capability interna no banco, escopo de recurso e grants revogados para `PUBLIC`/`anon`. A exceção permanece sob revisão formal; não há dados de pagamento sensíveis no domínio.

## Gate remanescente

Smoke funcional com identidades reais de Comercial, Financeiro e Concierge em homologação. A visualização Admin foi verificada; ainda não foram criados dados de demonstração nem alteradas atribuições durante o smoke. A conclusão do smoke não promove produção; FIN-3.1B continua exigindo pack próprio para escolher provedor, segredos, webhook e rollback.
