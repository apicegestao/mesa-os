# Homologação — Modelo de e-mail OTP — IAM-2.29

**Status:** aplicado em homologação  
**Data:** 2026-08-13  
**Ambiente:** `homologation-onboarding-iam-228`  
**Produção:** não alterada

## Decisão

O acesso sem senha usa código temporário de seis dígitos enviado por e-mail.
O modelo `Magic link or OTP` do Supabase deve conter `{{ .Token }}` e não
deve conter `{{ .ConfirmationURL }}`. Assim, o pedido de acesso gera um
código para digitação no Mesa OS, sem redirecionamento por link.

## Modelo canônico

**Assunto:** `Seu código de acesso ao Mesa OS`

```html
<h2>Seu código de acesso</h2>
<p>Use o código abaixo para entrar no Mesa OS:</p>
<p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">{{ .Token }}</p>
<p>Ele expira em breve e só pode ser usado uma vez.</p>
<p>Se você não solicitou este acesso, ignore esta mensagem.</p>
```

## Controles preservados

- A interface usa `shouldCreateUser: false`; solicitar um código não cria
  contas novas.
- A validação ocorre com e-mail + código no Supabase Auth.
- As mensagens da interface permanecem neutras, sem confirmar matrícula ou
  perfil de acesso.
- O modelo foi alterado exclusivamente na homologação.

## Verificação pendente

No próximo pedido de acesso, o e-mail deverá trazer o código de seis dígitos.
O código não deve ser compartilhado em chat, registro técnico ou documento.
