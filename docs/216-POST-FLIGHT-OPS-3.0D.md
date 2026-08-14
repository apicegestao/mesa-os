# Post-Flight — OPS-3.0D Suporte ao membro

**Ambiente alterado:** homologação somente. **Produção:** não alterada.

## Entregue

- Pedido e acompanhamento de apoio pelo próprio membro na área Hoje.
- Fila interna para Concierge, Mentor e Admin, limitada por carteira, papel e organização.
- Resposta interna, estado operacional e atribuição auditável.
- Tabelas privadas com RLS deny-by-default; todo acesso passa por RPC server-side.
- Nenhuma mensagem é enviada à IA, ao TutorIA, a provedor externo ou a canal de comunicação.

## Validação

- migrations `ops_3_0d_member_support` e `ops_3_0d_support_assignment` aplicadas na homologação;
- lint, typecheck, 124 testes e build aprovados;
- Security Advisor revisado: novas RPCs usam `SECURITY DEFINER` deliberado, mas exigem `auth.uid()`, capability e escopo antes de qualquer leitura/escrita. Os avisos existentes de funções privilegiadas e a proteção de senha vazada continuam pendências do Release Train, não autorização para produção.

## Deliberadamente não implementado

WhatsApp, e-mail, IA sobre mensagens, anexos, chat bruto do TutorIA, memória, automação, exportação, dados financeiros e produção.
