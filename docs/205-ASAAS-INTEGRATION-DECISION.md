# Decisão de Integração — Asaas no FIN‑3.1B

**Status:** APPROVED — owner autorizou em 2026-08-14.

## Escolha

Asaas será o primeiro adaptador de checkout da Mesa dos Donos, exclusivamente em sandbox/homologação na primeira ativação.

## Motivos

- checkout hospedado para Pix e cartão;
- recorrência e parcelamento quando aprovados pela política;
- `externalReference` para conectar checkout ao contrato canônico;
- webhooks para confirmação assíncrona; retorno do navegador permanece apenas experiência visual;
- operação voltada ao Brasil.

## Segredos requeridos por ambiente

- token de API sandbox;
- token/segredo de autenticação do webhook, conforme configuração do Asaas;
- URL pública de webhook da homologação.

Nenhum segredo será enviado por chat, commitado, colocado em variável pública ou usado em produção. A primeira configuração deve ser feita diretamente no cofre de variáveis do ambiente de homologação.
