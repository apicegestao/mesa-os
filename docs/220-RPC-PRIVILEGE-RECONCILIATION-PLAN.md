# Plano de reconciliação — privilégios de RPC

**Status:** BLOCKER DE PROMOÇÃO — homologação somente  
**Data da verificação:** 2026-08-14  
**Origem:** Security Advisor e inspeção de catálogo da homologação `pjkfifjcaezspwessaem`.

## Achado objetivo

- 40 funções `SECURITY DEFINER` no schema `public` podem ser executadas por `authenticated`.
- 3 funções `SECURITY DEFINER` no schema `private` ainda possuem permissão ampla herdada: `allocate_available_concierge`, `allocate_concierge_after_enrollment` e `can_staff_access_support`.

As funções públicas possuem verificações de identidade/capability em seu corpo. Isso reduz o risco, mas não satisfaz a fronteira de privilégio definida para o Mesa OS: uma função privilegiada não deve ser a porta pública do Data API.

## Decisão de correção

Aplicar em homologação uma migração aditiva e revisável que:

1. revoga `EXECUTE` de `PUBLIC` e `anon` para **todas** as funções `private`;
2. mantém o domínio privilegiado em `private`, com `search_path` seguro e validação de capability dentro da função;
3. transforma cada porta pública necessária em wrapper `SECURITY INVOKER` de assinatura compatível;
4. concede `EXECUTE` a `authenticated` apenas nos wrappers públicos estritamente necessários;
5. restringe funções de serviço/webhook para chamada server-side, sem porta pública de browser;
6. confirma que chamadas anônimas e chamadas autenticadas sem capability falham, enquanto o papel autorizado continua funcionando;
7. repete o Security Advisor até não restar alerta de função pública `SECURITY DEFINER` executável.

## Superfícies abrangidas

- CRM e handoff;
- acesso interno, papéis e carteiras;
- suporte ao membro;
- Financeiro e Asaas Sandbox;
- Intelligence interna;
- capacidade e alocação de Concierge;
- endpoints de leitura internos.

## Limites

- não altera regras de negócio, dados, pagamentos, metodologia ou papéis;
- não altera produção;
- não cria capacidade nova para membros ou equipe;
- não inclui modelo de IA, comunicação externa ou qualquer novo acesso.

## Verificação obrigatória

1. catálogo: zero `SECURITY DEFINER` em `public` com `EXECUTE` para `authenticated`;
2. catálogo: zero função `private` executável por `PUBLIC` ou `anon`;
3. Advisor de segurança: sem alertas desse tipo;
4. testes de papel: anônimo negado, autenticado sem capability negado, papel autorizado permitido;
5. lint, typecheck, testes e build;
6. Post-Flight anexado ao checkpoint consolidado.

## Relação com o plano mestre

Este é o primeiro gate do **Bloco A — Consolidação de homologação**. Até ele ser concluído, não há promoção, deploy de produção nem smoke financeiro final.
