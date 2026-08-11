# Post-Flight — RT-2.23 AI Budget Governance

**Status:** guarded build checkpoint — 2026-08-11
**Ambiente:** branch Supabase de homologação `tqpxqevlhfyqnjdrhlhd`; produção inalterada.

## Entregue

- Revisões imutáveis de política por organização, com limite mensal em centavos BRL, taxa BRL/USD versionada e fuso de fechamento `America/Sao_Paulo`.
- Estrutura separada e sem acesso de membro para a verba interna global da Mesa dos Donos; valor inicial documentado de R$500/mês permanece sem interface e sem uso ativo.
- Reserva atômica por membro/período antes da inferência e liquidação pelo custo observado; reservas sem chamada bem-sucedida são liberadas.
- O gateway de orientação agora reserva o custo máximo antes de chamar o provedor, mas continua desligado por flags e por falta de configuração de orçamento.
- Tabelas internas sem grants diretos para membros; revisão de política de membro disponível somente ao owner e sempre por append.
- Funções privilegiadas movidas para schema privado. Os wrappers públicos são `SECURITY INVOKER`, sem acesso direto às tabelas internas.

## Verificações

- Advisor de segurança da branch: sem alertas.
- Reserva permitida com política válida: aprovada em transação revertida.
- Liquidação de custo observado: aprovada em transação revertida.
- Bloqueio com limite esgotado: aprovado em transação revertida.
- `pnpm check`: lint, typecheck, 61 testes e build aprovados.

## Não ativado

- Sem AI Gateway, chave, inferência, consumo, cobrança, preview, deploy, merge ou produção.
- Sem interface de Governança de IA, pois a capacidade permanece em homologação e requer smoke autenticado próprio.
- Sem implementação do Mesa OS Intelligence; o pacote 94 permanece em rascunho.

## Gates restantes

1. Implementar e testar a tela de Governança de IA para o owner, com confirmação e histórico.
2. Configurar somente em preview/homologação uma taxa BRL/USD e o limite inicial de R$100 por membro.
3. Habilitar a IA apenas em homologação, executar smoke autenticado e conferir reserva, consumo e liberação.
4. Realizar revisão de preview e obter aprovação explícita para promoção.
