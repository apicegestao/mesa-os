# Alignment Check e Pre-Flight — Release Train 1

**Status:** READY FOR INTEGRATED REVIEW — promoção bloqueada  
**Data:** 2026-08-12

## Objetivo

Consolidar a preparação do primeiro Release Train que reúne a fundação metodológica RT-2.20, TutorIA governado RT-2.21–RT-2.26 e Evolução confiável RT-2.27A, sem alterar produção nesta etapa.

## Autoridades consultadas

- `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md` e `10-CURRENT-SCOPE.md`.
- Conversa-fonte `Mesa OS V2`, recuperada no Source Register.
- `82-PRE-RELEASE-REVIEW-RT-2.20.md`, `98-ACCELERATED-DELIVERY-PROTOCOL.md` e `104-GOVERNANCE-CHECKPOINTS.md`.

## Escopo deste bloco

- Revisar a diferença entre homologação e produção, migrations, segurança, regressão e requisitos de smoke.
- Registrar os gates necessários para uma promoção única e reversível.
- Definir uma conta-fixture isolada como único caminho aceitável para smoke autenticado, sem dados reais de membros.

## Fora do escopo

- Merge, deploy, promoção de branch Supabase ou alteração de produção.
- Criação de fixture, convite, segredo, usuário real ou alteração de configuração Auth.
- Nova funcionalidade de negócio, mudança metodológica, IA ativa, WhatsApp ou backoffice.

## Riscos e critérios de parada

- A promoção para se houver qualquer alerta de segurança, migration ausente, segredo exposto ou smoke autenticado incompleto.
- Não são copiados dados, identidades ou sessões reais para homologação.
- Alterações de Auth e proteção de senha exigem decisão operacional explícita, pois são configuração do ambiente produtivo.

## Validação planejada

1. Conferir migrations e Security Advisor nos dois ambientes.
2. Executar o conjunto completo de regressão local.
3. Revisar diffs, variáveis e rota de smoke.
4. Solicitar aprovação específica apenas quando todos os gates estiverem verdes.
