# Definition Pack — FIN‑3.1B Checkout, Entitlement e Entrada sem Senha

**Status:** APPROVED — owner aprovou BUILD e Asaas como primeiro provedor em 2026-08-14.

## Objetivo

Conectar o domínio financeiro canônico ao primeiro checkout oficial sem tornar o Mesa OS dependente dele. Pagamento confirmado por evento assinado cria ou atualiza o entitlement; o e‑mail normalizado do checkout autoriza a matrícula e a entrada por código temporário.

## Experiência do membro

1. A pessoa compra e informa e-mail no checkout.
2. O provedor confirma o pagamento por webhook assinado.
3. O reconciliador idempotente atualiza contrato, cobrança, pagamento e entitlement.
4. O sistema cria matrícula autorizada para o e-mail normalizado, sem criar acesso a partir do retorno do navegador.
5. A pessoa informa o mesmo e-mail no Mesa OS, recebe OTP e entra se existir entitlement elegível.

## Arquitetura portátil

- interface `CheckoutAdapter`: cria checkout, verifica assinatura, normaliza evento e consulta estado mínimo;
- `WebhookReceiver`: valida assinatura, data, anti-replay e idempotência antes de registrar evento;
- `Reconciliador`: converte evento válido em fatos canônicos; não depende da página de sucesso do checkout;
- `EntitlementPolicy`: define ativo, período de tolerância, restrito, suspenso, reativado ou encerrado;
- `AccessProvisioner`: cria ou atualiza matrícula pelo e-mail, preservando organização/histórico existentes;
- nenhum cartão, dado bancário, chave PIX ou segredo do provedor é gravado no navegador, Git, logs ou banco operacional.

## Regras de vínculo

- e-mail é normalizado antes da comparação; não é usado como autorização isolada;
- entitlement ativo e matrícula autorizada são exigidos para acesso;
- novo e-mail, conflito, compra para terceiro/equipe ou múltiplo vínculo entram em fila Concierge auditada;
- renovação preserva identidade e histórico; não recria a organização;
- suspensão/revogação remove autorização em leituras futuras, sem apagar história;
- webhook repetido não cria segunda cobrança, segundo pagamento, segundo entitlement ou segunda matrícula.

## Escopo do futuro BUILD

- escolher **um** provedor com API, webhook assinado e suporte adequado ao Brasil;
- armazenar segredo por ambiente e configurar endpoint de webhook;
- implementar adaptador, evento idempotente, reconciliação e política explícita de acesso;
- suportar pagamento confirmado, pendente, falho, reembolso/cancelamento e reativação somente pelos estados autorizados;
- backoffice de exceções Financeiro/Concierge, sem expor dados sensíveis;
- testes de assinatura, replay, idempotência, colisão de e-mail, expiração, bloqueio e reativação.

## Fora do escopo

- múltiplos provedores no primeiro lançamento, dados de cartão/PIX, fiscal, contabilidade, desconto/estorno automático, comunicação externa, IA, produção e promoção automática;
- login por senha, login social ou liberação por retorno de navegador;
- criação pública de vínculo sem pagamento/entitlement autorizado.

## Provedor inicial: Asaas

Asaas é o primeiro adaptador por oferecer checkout hospedado, Pix, cartão, recorrência, `externalReference` e webhooks. O contrato do Mesa OS continua independente por meio do adaptador; uma troca futura não altera os fatos canônicos.

## Critérios de aceite

1. Evento assinado e idempotente é a única fonte de confirmação automática.
2. Mesmo e-mail no checkout e login permite entrada OTP sem intervenção manual quando não há exceção.
3. Retorno visual de checkout, URL ou captura não libera acesso.
4. Bloqueio, tolerância e reativação seguem entitlement versionado e auditado.
5. Dados sensíveis não entram no Mesa OS; testes, RLS, segurança, lint, typecheck e build passam em homologação.

## Decisão solicitada ao owner

**“Aprovo o Definition Pack FIN‑3.1B”** autoriza Change Request, Pre‑Flight e BUILD somente em homologação após a escolha explícita do provedor inicial. Não autoriza produção, múltiplos provedores, dados sensíveis de pagamento ou automações externas fora do webhook de reconciliação.
