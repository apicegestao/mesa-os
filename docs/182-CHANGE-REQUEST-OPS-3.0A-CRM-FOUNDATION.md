# Change Request — OPS-3.0A R2 CRM e Concierge

**Status:** APPROVED — owner autorizou “vamos seguir” em 2026-08-14.

## Mudança

Adicionar ao Current Scope um primeiro bloco de backoffice em homologação: CRM comercial, RBAC interno por capability, handoff auditável e Concierge para onboarding/matrícula controlada. O antigo papel de Operações não será criado; sua rotina autorizada pertence a Concierge.

## Justificativa

O `/ops` técnico de IAM-2.29 resolve matrícula, mas não oferece o fluxo operacional necessário entre Comercial e entrada do membro. A mudança cria uma fundação útil sem abrir acesso aos dados metodológicos, canais externos, Financeiro ou Mesa OS Intelligence.

## Autoridades e limites

- Constitution, V2 Scope, ADR-036/037/039 e Construction Protocol foram reconciliados.
- Definition Pack OPS-3.0A R2 e Operating Model R2 são a especificação do bloco.
- Nenhuma decisão FROZEN é alterada.
- BUILD somente em homologação; produção, Meta, checkout, Financeiro, Intelligence e carteira de Mentor continuam fora do escopo.

## Impacto autorizado

- Migrations aditivas para domínio CRM, capabilities internas, auditoria e handoff.
- Módulos e rotas internas `/ops` necessários para Admin, Comercial e Concierge.
- RLS deny-by-default, RPCs/ações server-side, testes de isolamento e smoke de homologação.

## Impacto deliberadamente não autorizado

- Dados de metodologia, TutorIA, diagnóstico, ciclo, evidência, conversa ou contexto longitudinal no CRM.
- Qualquer mensagem, webhook, token, checkout, faturamento, pagamento, IA ativa de operação ou acesso de Mentor.
- Mudança de autenticação, contas de membro ou promoção de produção.
