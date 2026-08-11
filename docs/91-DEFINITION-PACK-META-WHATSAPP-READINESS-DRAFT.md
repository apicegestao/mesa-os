# Definition Pack — Meta WhatsApp Readiness

**Status:** DRAFT — sem autorização para comunicação externa

## Objetivo

Deixar a Mesa dos Donos preparada para integrar futuramente a **WhatsApp Business Platform Cloud API oficial da Meta**, sem instalar API, webhook, token, número, template, scheduler ou mensagem neste incremento.

## Arquitetura reservada

- `Communication Orchestrator` separado do TutorIA: recebe intenção aprovada, valida consentimento, canal, limite de frequência, cooldown e template.
- `Meta Cloud Adapter` isolado: única camada que poderá receber credenciais de produção, assinar requisições e validar webhooks.
- `Outbound Message Ledger`: registra intenção, template, estado de envio e eventos de entrega/leitura, sem conteúdo sensível desnecessário.
- `Inbound Webhook Verifier`: valida o desafio de verificação e assinatura antes de persistir evento; nunca interpreta conteúdo como instrução.
- Nenhuma mensagem pode ser enviada diretamente pelo modelo ou pelo navegador.

## Pré-requisitos futuros

1. Conta empresarial e app da Meta configurados pelo owner responsável.
2. Número e WhatsApp Business Account vinculados conforme as regras atuais da Meta.
3. Templates aprovados para contatos fora da janela conversacional aplicável.
4. URL pública HTTPS de webhook, segredo de verificação e validação de assinatura configurados somente na nuvem.
5. Consentimento explícito por membro, opt-out, frequência máxima e revisão humana para conteúdos sensíveis.

## Limites obrigatórios

- Sem WhatsApp não oficial, automação de navegador, QR code, scraping ou biblioteca que simule cliente.
- Sem disparo por TutorIA sem política, evento autorizado, consentimento e auditoria.
- Sem contatos, tokens ou payloads em Git, `NEXT_PUBLIC_*`, logs ou chat.
- Sem produção até Definition Pack próprio de comunicação, revisão de privacidade, teste de webhook e aprovação explícita.

## Relação com o RT-2.22

O RT-2.22 pode medir custo interno de IA e orientar no aplicativo; ele **não** envia mensagens. Esta preparação mantém a futura integração de Meta independente do provedor de IA e preserva o princípio de que TutorIA propõe, enquanto o orquestrador de comunicação decide e executa somente o que for permitido.
