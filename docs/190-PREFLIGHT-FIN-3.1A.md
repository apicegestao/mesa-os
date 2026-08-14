# Pre-Flight — FIN-3.1A Fundação de Receita

**Ambiente:** homologação `pjkfifjcaezspwessaem` somente

## Autoridades e alinhamento

Constitution 1.1; Construction Protocol 1.2; ADR-002/003/004/033/035/040; Operating Model R2; Definition Pack 187; Alignment Check 188; Change Request 189; Current Scope atualizado.

## BUILD previsto

- migrations aditivas de receita, entitlement, auditoria e capability Financeiro;
- módulo `finance`, RPCs/rotas server-side e tela interna mínima;
- validação de estados, transições, escopo comercial e auditoria;
- RLS deny-by-default, grants mínimos, testes, lint, typecheck e build.

## Fora do BUILD

Checkout, provedor, dados de pagamento, webhook, pagamento real, automação, e-mail, canais externos, fiscal, Intelligence, TutorIA, dados metodológicos e produção.

## Riscos e controles

Dados financeiros sensíveis não entram no banco. Qualquer status de pagamento é uma confirmação interna controlada, não integração externa. Entitlement não altera vínculo de membro neste incremento; ele apenas registra elegibilidade canônica para futuro fluxo autorizado. Toda RPC `SECURITY DEFINER` terá `auth.uid()`, capability explícita, `search_path` vazio, grants revogados de `PUBLIC`/`anon` e revisão no Security Advisor.

## Condições de parada

Parar antes de qualquer segredo, provedor, webhook, pagamento real, alteração automática de acesso de membro, novo custo ou necessidade de dados sensíveis.
