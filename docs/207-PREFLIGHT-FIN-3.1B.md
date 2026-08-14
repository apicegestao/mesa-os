# Pre-Flight — FIN-3.1B Asaas Sandbox

**Ambiente:** homologação somente (`pjkfifjcaezspwessaem` e Deploy Previews Netlify).

## Autoridades consultadas

Constitution 1.1; V2 Scope Lock; ADR/Current Scope; Construction Protocol 1.2; Definition Pack 204; decisão Asaas 205; Change Request 206; conversa fonte `Mesa OS V2` (checkout vinculado a acesso, sem dependência de provedor).

## BUILD

- migration aditiva para intenção de checkout, evento idempotente e reconciliação canônica;
- rota interna autenticada que cria checkout Sandbox pelo adaptador Asaas;
- Edge Function pública apenas para webhook, protegida por token de autenticação do Asaas armazenado como segredo do Supabase;
- testes de contrato do adaptador, bloqueio de produção, idempotência e ausência de segredo em respostas/logs.

## Fora do escopo

Produção, pagamento real, cartão/PIX no Mesa OS, retorno de navegador como autorização, múltiplos provedores, fiscal, estorno automático, mensagens e qualquer acesso antes de pagamento confirmado.

## Controles e condição de parada

`ASAAS_API_KEY` fica apenas nos Deploy Previews do Netlify; o token de webhook será segredo separado no Supabase. Se o token estiver ausente, a função falha fechada. Qualquer necessidade de segredo em cliente, dado bancário, mudança destrutiva ou promoção interrompe o BUILD.
