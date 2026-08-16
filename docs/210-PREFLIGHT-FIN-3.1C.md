# Pre-Flight — FIN-3.1C Matrícula automática

**Autoridades:** Constitution 1.1; Scope Lock; ADR-004, ADR-026, ADR-033, ADR-035, ADR-040; Current Scope; FIN-3.1B; Definition Pack 209; aprovação do owner em 2026-08-14.

**BUILD em homologação:** migration aditiva para o vínculo único `crm_account → organization`, provisionamento exclusivo de serviço após evento Asaas já validado e auditoria de sucesso/conflito; adaptação do receptor para chamar a porta IAM sem expor e-mail ou segredo.

**Fora do escopo:** produção, cadastro público, retorno de checkout, múltiplas organizações, múltiplos usuários, alteração de e-mail, comunicação externa, dados de pagamento e qualquer acesso antes de confirmação.

**Riscos e controles:** só `service_role` executa a rotina; RLS deny-by-default, `search_path` vazio, transação/idempotência por contrato, conflito sem acesso parcial, testes de duplicidade/conflito e build completo. Parar diante de ambiguidade de vínculo existente ou falha de isolamento.
