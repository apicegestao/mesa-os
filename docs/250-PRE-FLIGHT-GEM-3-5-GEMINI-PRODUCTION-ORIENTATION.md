# Pre-Flight GEM-3.5 — Gemini direto para orientação TutorIA

**Status:** GO para BUILD em branch; promoção permanece condicionada ao Release Train integrado

## Autoridades consultadas

Constitution (princípios 5, 6, 8 e 9), Scope Lock, ADR-004, ADR-036, ADR-039,
ADR-040, Current Scope, PP-1/PP integrado e decisão explícita do owner de usar
Gemini como primeiro provedor pago.

## Alterações previstas

- substituir dependência de base URL/gateway por `GEMINI_API_KEY` server-side;
- distinguir `gemini_direct` na auditoria, via migration de restrição controlada;
- testar habilitação, ausência de segredo, custo e provider;
- documentar configuração sem registrar o valor da chave.

## Não será alterado

- escopo de contexto, RLS, política de leitura, Terms, memória e orçamento canônicos;
- capacidades de Evidência, DRE, especialistas, Thor e automações externas;
- qualquer chave ou configuração de produção durante o BUILD em branch.

## Riscos e controles

| Risco | Controle |
|---|---|
| chave exposta | segredo runtime, sem variável pública, sem log e sem Git |
| custo indevido | reserva antes da chamada, máximo por chamada, rate limit e kill switch |
| resposta incorreta | JSON tipado, confidence band, escalonamento e timeout |
| mistura entre membros | matrícula/organização/policy gateway antes do contexto |
| migração permissiva | alteração mínima de constraint, revisão e Security Advisor |

## Validação

lint, typecheck, testes direcionados e totais, build; revisão SQL; em produção,
Security Advisor e uma única chamada de demonstração após configuração secreta.
