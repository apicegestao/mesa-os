# Protocolo de Entrega Acelerada — Mesa OS V2

**Status:** ACTIVE — owner direction, 2026-08-11
**Objetivo:** aumentar velocidade de construção sem reduzir segurança, rastreabilidade ou qualidade.

## Regra principal

O trabalho deixa de ser entregue item a item e passa a ser organizado em **trens de entrega**: grupos pequenos de capacidades relacionadas, construídos completos em branch/homologação e promovidos somente depois de uma revisão consolidada.

## Cadência

1. **Definição curta:** um pacote com objetivo, limites, dados, riscos e critérios de aceite.
2. **Construção contínua:** código, migration, testes e documentação do lote são feitos sem deploy intermediário.
3. **Verificações locais:** lint, typecheck, testes, build e revisão de migração em cada checkpoint técnico.
4. **Homologação consolidada:** migrations são aplicadas apenas na branch de teste; Advisor e smoke funcional são executados ao fim do lote.
5. **Um preview por lote:** somente quando houver um conjunto coerente para revisão visual e autenticada.
6. **Promoção separada:** produção exige Post-Flight, aprovação explícita e smoke da release; não é consequência automática do preview.

## O que acelera

- Um único Definition Pack pode cobrir uma fatia coesa de interface, dados e regras, desde que mantenha limites claros.
- Trabalho local e testes automatizados ocorrem continuamente, sem custo de deploy Netlify.
- Migrations relacionadas são agrupadas e revisadas em homologação antes do preview.
- Ajustes visuais de uma mesma tela entram no mesmo lote, em vez de gerar várias versões publicadas.
- Feature flags mantêm capacidades incompletas ou com custo variável desligadas até o gate correto.
- O fluxo prioriza o caminho crítico do membro: diagnóstico → prioridade → ciclo → missão → ferramenta → implementação → evidência → evolução.

## O que não muda

- Produção não recebe deploy automático.
- Segredos nunca entram em código, chat, browser ou variáveis públicas.
- RLS, validação server-side, auditoria, testes e revisão de segurança não são reduzidos.
- Dados de membros não são reutilizados entre organizações nem usados para treinamento implícito.
- Capacidades de IA, comunicação externa e mudanças de dados continuam sob gate específico.

## Limites operacionais

- Um trem não mistura mudanças metodológicas não aprovadas com ajustes meramente visuais.
- Um erro crítico interrompe somente o lote afetado; o restante do sistema permanece protegido.
- O owner recebe atualização por marco: início, checkpoint de homologação e entrega para revisão — não por microalteração.

## Primeiro trem acelerado recomendado

**RT-2.24 — TutorIA Assistido em Homologação**

1. Conversa de gestão com limites aprovados na Nota 93.
2. Interface de orientação e estados de recusa/escalonamento honestos.
3. Orçamento do RT-2.23 conectado e smoke autenticado.
4. Telemetria técnica e revisão de custo, sem ativação em produção.

Esse trem não autoriza WhatsApp, automação externa, memória conversacional, geração de documentos, Mesa OS Intelligence ou produção.
