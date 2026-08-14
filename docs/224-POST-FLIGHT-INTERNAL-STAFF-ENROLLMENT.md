# Post-Flight — matrícula controlada da equipe interna

**Ambiente:** homologação (pjkfifjcaezspwessaem)  
**Data:** 2026-08-14  
**Status:** aprovado tecnicamente para inclusão no pacote de homologação; sem publicação e sem promoção para produção.

## Entrega

- Admin pode criar um acesso interno por e-mail, escolhendo papel e organização de demonstração;
- o fluxo reutiliza o provedor existente de identidade e autenticação por código OTP;
- o provisionamento cria a identidade, a matrícula de demonstração e, somente então, ativa o acesso operacional e o papel interno;
- não há senha, link mágico, cadastro público, papel implícito ou acesso a organização real de membro;
- criação e provisionamento são registrados em auditoria.

## Controles confirmados

- a tabela de apoio está com RLS e política de negação para acesso direto;
- a função exposta é SECURITY INVOKER;
- o trigger privilegiado permanece em private e sem execução por clientes;
- execução anônima da função pública: **0**;
- funções SECURITY DEFINER expostas em public para esse fluxo: **0**;
- trigger de provisionamento: **1**;
- política RLS de negação: **1**.

## Verificação

- lint: aprovado;
- typecheck: aprovado;
- testes: **126** aprovados;
- build de produção: aprovado;
- simulação transacional da migration: aprovada;
- Security Advisor: somente o alerta pré-existente de proteção contra senhas vazadas. O Mesa OS usa OTP sem senha; o alerta permanece registrado como endurecimento de plataforma antes da produção.

## Próximo passo permitido

No próximo deploy consolidado de homologação, o Admin existente cria mesadosdonos@gmail.com como **Admin** em uma organização de demonstração. Esse será o único e-mail necessário para revisão multiângulo, sem personificar membros reais.
