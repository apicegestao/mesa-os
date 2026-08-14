# Alignment Check — Backoffice, CRM e Canais Oficiais

**Status:** PASS FOR DEFINITION/DISCOVERY ONLY
**Data:** 2026-08-13
**Autorização do owner:** “siga”, após a apresentação do Definition Pack 177.

## Objetivo concreto

Preparar a especificação de uma operação interna segregada e de um CRM portátil, com possibilidade futura de integração oficial a WhatsApp e Instagram, preservando a experiência do membro, o isolamento organizacional e a fronteira central do TutorIA.

## Autoridades reconciliadas

- Constitution, princípios 2, 5, 7, 9, 10, 11 e 12.
- V2 Scope Lock: monólito modular, canais externos governados e WhatsApp somente oficial.
- ADR-036: TutorIA propõe; não ganha acesso direto a dados, credenciais ou ações críticas.
- ADR-037: eventos, políticas, orquestração, frequência, consentimento, opt-out e auditoria antecedem comunicação externa.
- ADR-039: identidade, finalidade e organização delimitam cada leitura, memória e ação.
- Current Scope: CRM, Concierge, WhatsApp, backoffice completo e RBAC ampliado continuam não autorizados para BUILD.
- Definition Pack 177 e a proposta anterior de Meta WhatsApp Readiness.

## Escopo autorizado neste checkpoint

- Detalhar o domínio e as fronteiras arquiteturais do futuro CRM.
- Fixar o princípio de núcleo canônico independente de canal e adaptadores isolados para provedores.
- Registrar as funções internas candidatas e a exigência de capabilities mínimas, auditoria e segregação.
- Consolidar condições de segurança, privacidade, observabilidade, custo e reversão a serem exigidas antes de BUILD.

## Fora do escopo preservado

- Código de runtime, migrations, tabelas, RLS, endpoints, telas ou deploy.
- Ativação de WhatsApp, Instagram, e-mail, webhook, scheduler, campanhas ou mensagens.
- Configuração de contas Meta, tokens, secrets ou variáveis de ambiente.
- CRM operacional, leitura de dados de membros, suporte com impersonação, TutorIA interno, Inteligência com dados identificáveis e automações proativas.
- Mudança dos papéis de negócio `owner` e `member`, ou expansão do `internal_operator` atual.

## Dados, segurança e custo

Nenhum dado, segredo, integração ou custo é criado nesta etapa documental. Para BUILD futuro, a equipe precisará decidir e revisar: base legal/finalidade, consentimentos e preferências, minimização/retencão, capabilities internas, MFA/SSO, RLS, auditoria, cofre de segredos, validação de webhook, idempotência, orçamento, rate limit, observabilidade e rollback por canal.

## Critérios de validação desta etapa

1. O Definition Pack 177 explicita que não há autorização de BUILD.
2. WhatsApp e Instagram ficam como adaptadores externos, sem dependência estrutural do CRM.
3. O modelo separa operação interna, membro, TutorIA e Intelligence.
4. Todo futuro envio depende de política e orquestração; nunca do navegador ou de uma resposta direta de IA.
5. O Current Scope permanece inalterado e continua impedindo implementação prematura.

## Condição de parada e próximo gate

Este checkpoint está concluído. O próximo artefato permitido é um **Definition Pack de BUILD em homologação**, acompanhado de Change Request para o Current Scope, matriz de capabilities, especificação de dados e Pre-Flight. Ele somente poderá iniciar após autorização explícita do owner para BUILD; promoção de produção será decisão posterior e independente.
