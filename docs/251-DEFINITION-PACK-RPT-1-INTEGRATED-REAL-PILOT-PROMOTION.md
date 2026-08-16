# Definition Pack RPT-1 — Promoção integrada do piloto real

**Status:** DRAFT — preparação autorizada; promoção exige pre-flight final  
**Data:** 16 de agosto de 2026  
**Decisão do owner:** promover o sistema integrado para experiência real, com
Gemini como primeiro provedor pago, mantendo segurança e ativação externa gradual.

## Objetivo

Levar para produção a versão integrada já homologada, eliminando a divergência entre
aplicação e schema. O primeiro piloto terá três a cinco organizações, observação
próxima e um único deploy. A amplitude técnica não significa liberação irrestrita:
RBAC, flags e ausência deliberada de segredos mantêm cada capacidade no seu limite.

## Incluído no train

- IAM OTP, matrículas, segregação membro/equipe e papéis internos;
- experiência completa do membro, ferramentas T1, documentos, termos, memória e
  conversa TutorIA;
- CRM, carteira, suporte, financeiro, Intelligence e editorial como superfícies
  internas restritas pelos seus papéis e tabelas/RPCs com RLS;
- migrations homologadas de evidência assistida e suporte humano, sem ativar modelo
  de evidência em produção;
- Gemini direto exclusivamente para `tutoria_orientation`, após smoke com segredo
  de runtime e orçamento configurado.

## Ativações deliberadamente desligadas

| Capacidade | Estado em produção no RPT-1 |
|---|---|
| Checkout/Asaas e cobrança real | desligados; rotas atuais são Sandbox/homologação |
| WhatsApp, Instagram e proatividade | sem segredo/configuração e sem ativação |
| IA de Evidência e DRE especializada | não habilitadas |
| Intelligence com modelo | não habilitada; somente dados governados internos |
| Gemini orientação TutorIA | habilitar somente depois do smoke técnico |
| CRM/Financeiro/Intelligence | acesso somente interno e auditado |

## Migrations a promover

Produção possui as 53 migrations-base. Aplicar, pelos nomes lógicos e SQL
versionado, as 47 migrations já homologadas a seguir; cada banco registra seu
próprio identificador temporal.

1. IAM: `iam_2_28_controlled_onboarding`,
   `iam_2_28_enrollment_advisor_hardening`, `iam_2_29_segregated_access`,
   `iam_2_29_rpc_privileges_hardening`.
2. Operação: `ops_3_0a_crm_foundation`, `ops_3_0a_crm_handoff_controls`,
   `crm_kanban_client_workspace`, `ops_3_0b_mentor_role`,
   `ops_3_0b_portfolio_core`, `ops_3_0c_global_mentor_view`,
   `ops_3_0d_member_support`, `ops_3_0d_support_assignment`,
   `crm_concierge_capacity_allocation_retry`, `crm_concierge_capacity_rpc`,
   `rpc_privilege_reconciliation`, `internal_staff_enrollment`.
3. Financeiro Sandbox: `fin_3_1a_revenue_foundation`, `fin_3_1a_revenue_core`,
   `fin_3_1a_payment_guard`, `fin_3_1b_asaas_checkout_reconciliation`,
   `fin_3_1b_reconcile_privilege_hardening`, `repair_email_validation`,
   `prevent_duplicate_finance_proposals`, `repair_checkout_email_validation`,
   `repair_asaas_checkout_contract_reference`, `repair_asaas_checkout_record_aliases`,
   `repair_asaas_checkout_returning_alias`, `fin_3_1b_asaas_card_reissue`,
   `fin_3_1c_checkout_session_reconciliation`,
   `fin_3_1c_automatic_access_provisioning`, `fin_3_1c_conflict_guard_order`.
4. Intelligence e contexto: `int_3_2a_governed_aggregation`,
   `tutoria_conversation_longitudinal_memory`.
5. Evidência: `evd_ai_3_3a_submission_foundation`,
   `evd_ai_3_3a_private_decision_writer`, `evd_ai_3_3a_server_decision_wrapper`,
   `evd_ai_3_3b_escalation_support_queue`,
   `evd_ai_3_3b_human_escalation_resolution`,
   `evd_ai_3_3b_rpc_privilege_hardening`.
6. Editorial e correções: `mth_3_4a_editorial_curriculum_foundation`,
   `mth_3_4a_editorial_rls_denial`, `mth_3_4c_editorial_release_gate`,
   `mth_3_4e_editorial_guide_sync`, `mth_3_4c_editorial_workspace_rpc_grant`,
   `mth_3_4c_editorial_publish_rpc_grant`,
   `rpc_active_member_private_grants`, `gem_3_5_direct_provider_audit`.

## Sequência de promoção

1. conferir o histórico de migrations e Security Advisor em produção;
2. aplicar as migrations na ordem homologada, interrompendo na primeira falha;
3. confirmar schema, RLS/RPCs e advisors;
4. merge único da branch homologada em `main` e deploy Netlify único;
5. configurar `GEMINI_API_KEY` no cofre runtime; manter flag de orientação desligada;
6. executar smoke de organização de demonstração;
7. habilitar a flag de orientação e executar uma única chamada Gemini controlada;
8. convidar a primeira coorte apenas após sucesso completo.

## Critérios de parada

Backup/restauração indisponível, divergência não explicada, migration falha, alerta
novo de segurança, build/deploy falho, OTP/termos/RLS quebrado, segredo exposto,
orçamento não reservado ou falha de Gemini interrompem o train antes de convite real.

## Recuperação

Migrations não são revertidas destrutivamente. Em incidente: interromper convites e
flags, bloquear a superfície afetada, preservar auditoria e restaurar somente pelo
ponto confirmado quando a integridade justificar. O Post-Flight registra a decisão.
