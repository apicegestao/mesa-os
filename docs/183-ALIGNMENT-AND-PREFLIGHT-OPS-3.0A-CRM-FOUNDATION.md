# Alignment Check & Pre-Flight — OPS-3.0A R2

**Status:** PASS — BUILD em homologação autorizado
**Data:** 2026-08-14

## Item e fonte recuperada

Construir o primeiro CRM interno e o handoff Comercial → Concierge, com entrada simples para a equipe já fornecida pelo IAM-2.29. A conversa fonte `Mesa OS V2` requer operação interna segregada, comunicação futura governada e TutorIA central sem acesso direto a dados ou execução autônoma.

## Autoridades consultadas

Constitution, V2 Scope, ADR-036/037/039, Construction Protocol, Current Scope atualizado pelo CR-182, Definition Pack OPS-3.0A R2, Operating Model R2, IAM-2.29 e revisão oficial atual de RLS/funções do Supabase.

## Escopo de BUILD

1. Capabilities internas para `admin`, `commercial` e `concierge`, sempre sobre a identidade já marcada como `internal_operator`.
2. CRM comercial: contas, contatos, leads/oportunidades, atividades, tarefas, atribuições e handoff de onboarding.
3. Concierge: fila atribuída de handoff e matrícula/revogação previamente autorizadas, sem contexto metodológico.
4. Interface `/ops` segregada por capability e ações server-side validadas.
5. Migrations aditivas, RLS deny-by-default, funções com grants mínimos, auditoria, testes e smoke de homologação.

## Fora do escopo

Financeiro, checkout, cobrança, pagamento, entitlement, Intelligence, Mentor, WhatsApp, Instagram, e-mail, webhook, automação, dados de membros, dados TutorIA, MFA/SSO, produção e promoção.

## Arquivos previstos

- uma migration versionada criada pela CLI Supabase para RBAC/CRM;
- testes SQL de RLS, grants e negação;
- `src/modules/internal-access/*` e `src/modules/crm/*`;
- rotas/ações `/ops` e testes de UI/servidor correspondentes;
- documentação de Post-Flight e runbook de homologação.

## Riscos e controles

| Risco | Controle |
| --- | --- |
| acesso excessivo | capability + carteira + RLS + auditoria, sem grant direto às tabelas |
| BOLA/IDOR por URL/API | autorização server-side em cada ação e testes de negação |
| RPC privilegiado exposto | schema privado quando possível, `auth.uid()` obrigatório, `revoke ... from public/anon`, grant mínimo a `authenticated` |
| vazamento de dados de membros | modelo CRM não referencia metodologia; handoff guarda somente checklist mínimo |
| regressão do onboarding | preservar IAM-2.29 e testar matrícula pelo Concierge |

## Verificações exigidas antes de encerrar

- lint, typecheck, testes unitários e build;
- teste SQL de RLS/grants e Security Advisor em homologação;
- smoke de Admin, Comercial, Concierge e negação de identidade sem capability;
- revisão de migration, secrets e diff; nenhuma mudança em produção.

## Condição de parada

Parar e abrir novo pack diante de dado de membro, função de Mentor, comunicação externa, configuração de provedor, MFA/SSO, custo novo, uso de Intelligence ou qualquer decisão que altere metodologia.
