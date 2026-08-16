# Post-Flight — FIN-3.1B Asaas Sandbox

**Ambiente alterado:** homologação Supabase `pjkfifjcaezspwessaem` e Asaas Sandbox somente. Produção não foi alterada.

## Implementado

- intenção de checkout portável e Checkout Adapter Asaas Sandbox;
- checkout hospedado criado exclusivamente por rota interna autenticada;
- referência externa canônica e eventos de provedor idempotentes, sem persistir payload bruto;
- reconciliador service-only: confirmação de pagamento atualiza contrato, cobrança e entitlement; URL de retorno não concede acesso;
- Edge Function `asaas-webhook`, sem JWT público, protegida por token próprio obrigatório e falha fechada sem o segredo;
- tela financeira interna ganha ação explícita para gerar o checkout Sandbox.

## Segurança verificada

- tabelas novas usam RLS deny-by-default e não têm acesso direto de `anon`/`authenticated`;
- o reconciliador retorna `authenticated_can_execute = false`, `anon_can_execute = false`, `service_can_execute = true`;
- o endpoint de webhook, sem token configurado, respondeu `503 webhook_not_configured` — comportamento esperado antes da configuração;
- os alertas preexistentes de funções `SECURITY DEFINER` do backoffice permanecem documentados; as novas rotinas autenticadas preservam capability interna e `search_path` vazio.

## Verificações

- `pnpm check`: aprovado — lint, typecheck, 116 testes e build;
- migration FIN-3.1B e hardening aplicadas apenas em homologação;
- Edge Function publicada apenas em homologação.
- segredo `ASAAS_WEBHOOK_TOKEN` cadastrado somente na Edge Function de homologação;
- webhook `Mesa OS - Sandbox` configurado no Asaas Sandbox para o endpoint de homologação, com API v3, entrega sequencial, fila ativa e os eventos `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED` e `PAYMENT_DELETED`;
- painel do Asaas confirma o webhook como **Ativado**, sem eventos penalizados.

## Deliberadamente não implementado

Produção, chave de produção, pagamento real, dados de cartão/PIX, e-mail transacional, estorno automatizado, múltiplos provedores e promoção automática.

## Próximo gate

Criar uma proposta de demonstração em homologação, gerar o checkout Sandbox e executar um pagamento de teste. Depois, verificar a conciliação ponta a ponta — evento idempotente, fatos financeiros canônicos, entitlement e acesso por OTP — antes de qualquer definição de promoção.

`https://pjkfifjcaezspwessaem.supabase.co/functions/v1/asaas-webhook`
