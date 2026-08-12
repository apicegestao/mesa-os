# Definition Pack — Release Train 1: promoção de produção

**Status:** DRAFT — requer aprovação explícita para execução

## Objetivo

Promover, uma única vez e em ordem, a base já validada em homologação: migrations RT-2.20 até RT-2.27A e os dois hotfixes de Termos. A promoção substitui os nove endpoints legados `SECURITY DEFINER` expostos por portas públicas `SECURITY INVOKER`, mantendo a lógica privilegiada no schema `private`.

## Autoridades

- `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md` e `10-CURRENT-SCOPE.md`.
- Conversa-fonte Mesa OS V2, pelo Source Register.
- `81-RPC-PRIVILEGE-BOUNDARY-REVIEW.md`, `137-ALIGNMENT-AND-PREFLIGHT-RELEASE-TRAIN-1.md`, `138-RELEASE-READINESS-REVIEW-TRAIN-1.md` e `143-POST-FLIGHT-RELEASE-TRAIN-1-HOMOLOGATION-SMOKE.md`.

## Escopo proposto

1. Aplicar em produção, sem pular ou reordenar, as migrations ainda ausentes a partir de `20260811203748_rt_2_20_methodology_graph.sql` até `20260812233500_hotfix_terms_receipt_gateway_privileges.sql`.
2. Aplicar a fronteira de privilégios `20260811212146_rt_2_20_rpc_privilege_boundary.sql`, que protege as nove funções alertadas pelo Advisor.
3. Habilitar a proteção contra senhas vazadas no Supabase Auth de produção.
4. Confirmar variáveis de produção por presença, sem expor seus valores.
5. Realizar um único deploy da aplicação após a paridade de banco e um smoke pós-release com rollback disponível.

## Fora de escopo

- Dados de negócio, convites, usuários, memberships, conteúdo metodológico ou reset de dados.
- Chaves de provedores de IA, IA ativa, WhatsApp, backoffice, novas telas ou novo módulo.
- Alteração silenciosa de Termos, política de contexto ou orçamento.

## Validações obrigatórias

- backup e ponto de restauração confirmados antes da primeira migration;
- migrations aplicadas em ordem e sem divergência;
- Security Advisor: nenhum alerta de função `SECURITY DEFINER` pública executável;
- proteção contra senhas vazadas habilitada;
- typecheck, testes, lint e build verdes no commit promovido;
- smoke com uma conta autorizada: login, Termos, jornada, evidências, evolução, recibo e logout;
- plano de rollback operacional revisado antes do deploy.

## Condições de parada

Parar imediatamente, sem deploy da aplicação, se houver migration ausente, erro de aplicação, alerta novo de segurança, variável não configurada, falha de smoke ou ausência de ponto de restauração.

## Decisão requerida

Este pack não autoriza alteração em produção. Após revisão, ele exige uma aprovação explícita do owner para executar banco, configuração Auth, deploy único e smoke pós-release como uma única janela controlada.
