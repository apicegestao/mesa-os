# Alignment Check — FIN-3.1A Fundação de Receita

**Status:** READY FOR OWNER DECISION

## Objetivo e requisito recuperado

Permitir que a Mesa dos Donos estruture receita e controle acesso contratado sem depender de um checkout específico e sem guardar dados de pagamento sensíveis.

## Alinhamento

- Conversa `Mesa OS V2`: receita, checkout e faturamento devem ser preparados com segurança e portabilidade.
- Operating Model R2: FIN-3.1A precede integração de checkout e separa cobrança de entitlement.
- Scope atual: FIN é explicitamente não autorizado; portanto este check não permite BUILD até Change Request e aprovação do owner.

## Alterações previstas após aprovação

- módulo financeiro separado do CRM;
- migrations aditivas para fatos de receita, entitlement, auditoria e RBAC Financeiro;
- rotas e telas internas mínimas;
- testes de autorização, transição de estados, isolamento e auditoria.

## Permanece fora

checkout, provedor, webhook, cartão, PIX, e-mail, WhatsApp, Instagram, fiscal, Inteligência, TutorIA, dados metodológicos e produção.

## Riscos e gate de parada

O BUILD para imediatamente se houver necessidade de segredo de provedor, dado financeiro sensível, automação de cobrança, mudança em autorização de membro, integração externa ou ambiguidade na regra de entitlement. Esses itens pertencem ao FIN-3.1B ou a packs próprios.
