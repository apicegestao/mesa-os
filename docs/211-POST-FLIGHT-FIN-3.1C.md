# Post-Flight — FIN-3.1C: Provisionamento automático de acesso

**Status:** Pronto para homologação consolidada  
**Ambiente:** homologação exclusivamente (`pjkfifjcaezspwessaem`)  
**Produção:** não alterada

## Resultado entregue

- A confirmação canônica de pagamento prepara uma organização vinculada à conta CRM e uma matrícula de proprietário com validade de 72 horas.
- A Edge Function `provision-authorized-enrollment` cria ou reaproveita a identidade, ativa a matrícula e registra auditoria.
- Reentregas do provedor são idempotentes: não duplicam fatos financeiros, organização, matrícula ou acesso.
- Um conflito de identidade com outra organização não cria organização nova; é registrado para tratamento operacional.
- A Edge Function exige JWT de `service_role`; a chave continua configurada apenas nos Deploy Previews da homologação.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Typecheck | aprovado |
| Lint | aprovado |
| Testes automatizados | 124 aprovados |
| Build de produção | aprovado |
| Migration aplicada na homologação | aprovada |
| Edge Function v3 ativa, com JWT obrigatório | aprovada |
| Endpoint de webhook rejeita chamada externa sem token | aprovado (`401`) |
| Função de provisionamento rejeita chamada externa sem JWT | aprovado (`401`) |
| Pagamento sandbox já confirmado preservado | aprovado |
| Preparação de organização e matrícula de proprietário | aprovada |

## Controle externo consolidado

A entrega real do Asaas para o endpoint Netlify será executada no smoke consolidado da homologação, após o próximo lote coerente. O endpoint estável será:

`https://deploy-preview-13--mesa-os.netlify.app/api/webhooks/asaas`

Esse controle demonstra, sem nova cobrança, a última etapa integrada: evento do Asaas → conciliação → provisionamento da identidade → matrícula ativa. O adiamento reduz microdeploys e não libera produção: promoção continua bloqueada até essa confirmação e o Post-Flight consolidado.
