# Governance Checkpoints — Mesa OS V2

**Status:** ACTIVE  
**Owner:** Rafael Portela Martins  
**Baseline:** conversa `Mesa OS V2` (`6a7671ee-20b0-83e9-ba40-12c7b311f0b7`)

## Como funciona

Este registro dá visibilidade ao owner sem transformar cada commit em uma aprovação manual. Cada checkpoint informa onde estamos, o que foi conferido e o próximo recorte seguro. Um checkpoint de escopo, custo, risco ou promoção solicita decisão explícita; os demais permitem BUILD contínuo dentro do pacote aprovado.

## CP-01 — RT-2.25: Base factual da DRE

**Estado:** PASS — 2026-08-12  
**Objetivo:** dar à TutorIA uma base financeira verificável antes de qualquer explicação generativa.

**Autoridades reconciliadas:** ADR-035 (conversa fonte), ADR-036 (TutorIA central), ADR-038 (Mapa de Desenvolvimento), ADR-039 (isolamento), Current Scope TWR-2.25A/B/D e Definition Pack RT-2.25.

**Construído:** workbench DRE versionado, rascunho isolado por organização, validação server-side, escopo de leitura `read_workbench_tool` auditável e leitura determinística que separa cálculos, alertas e dados ausentes.

**Fora do escopo preservado:** nenhum acesso direto da IA ao banco, nenhuma escrita pela IA, nenhuma aprovação de evidência, documento final, memória de chat, WhatsApp, automação ou promoção para produção.

**Evidência de validação:** migration aplicada somente no projeto Supabase de homologação; Security Advisor sem alertas; 27 testes específicos e typecheck passaram.

**Próximo recorte autorizado:** converter a base factual em explicação especializada governada, com orçamento, auditoria, schema de resposta e escalonamento por baixa confiança. Antes de habilitar inferência em preview, executar checkpoint de ativação e smoke autenticado.

## CP-02 — RT-2.25: Explicação especializada da DRE

**Estado:** PASS — PRONTO PARA ATIVAÇÃO CONTROLADA — 2026-08-12
**Objetivo:** permitir que a TutorIA aprofunde a leitura factual da DRE sem poder alterá-la ou apresentar fatos financeiros inventados.

**Autoridades reconciliadas:** CP-01, ADR-036 (TutorIA central), ADR-039 (isolamento e aprendizagem governada), Current Scope TWR-2.25A/B/D e Definition Pack RT-2.25.

**Construído:** contrato de prompt limitado à camada factual, schema de saída de entrega especializada, bloqueio de fatos/cálculos não idênticos aos já calculados, teto de custo próprio, rate limit, reserva/liquidação atômica de orçamento, uso auditável e tabela de auditoria sem prompt, resposta ou valores financeiros.

**Fora do escopo preservado:** a IA não escreve na DRE, não acessa o banco diretamente, não armazena conversa, não aprova evidência, não gera documento final, não decide pelo membro e não é ativada em produção.

**Evidência de validação:** migration aplicada somente no Supabase de homologação; RLS ativo e leitura anônima bloqueada; Security Advisor sem alertas; lint, typecheck e 80 testes passaram.

**Condição de ativação:** configurar exclusivamente no preview/homologação a flag da capacidade e um teto por chamada suficiente; executar smoke autenticado com dados de teste e conferir auditoria/custo. Isso exige checkpoint de ativação, não promoção de produção.

## CP-03 — RT-2.25: Ativação controlada em preview

**Estado:** IN PROGRESS — 2026-08-12
**Objetivo:** habilitar a explicação especializada apenas na homologação, sob o custo e isolamento aprovados.

**Ações concluídas:** a branch de homologação recebeu o trem consolidado; `TUTORIA_DRE_ANALYSIS_ENABLED=true` e teto de `2790` micros de dólar por chamada foram configurados exclusivamente em `deploy-preview`, com escopo de função/runtime. Produção não recebeu estas variáveis.

**Pendente e obrigatório:** o preview deve concluir o build e receber smoke autenticado com DRE de teste. A validação confirmará retorno útil ou escalonamento seguro, auditoria sem conteúdo e reserva/liquidação de custo. Sem esse smoke, o checkpoint não é aprovado e não há promoção.

**Tentativa de smoke:** o preview abriu e confirmou a proteção de acesso da equipe, mas não havia sessão autenticada disponível. Nenhuma credencial foi enviada ou alterada; o smoke funcional permanece pendente.

## CP-04 — TutorIA: qualidade acima de compressão artificial

**Estado:** PASS — 2026-08-12

**Decisão:** o teto por chamada controla consumo excepcional, não a qualidade da resposta. Cada capacidade terá perfil de profundidade, piso de qualidade, orçamento e estratégia explícita para falta de contexto. A TutorIA não pode cortar rigor, ocultar limitação ou inventar dados para caber no limite.

**Aplicação inicial:** a análise especializada de DRE passa a suportar até 1.200 tokens de saída, com custo máximo estimado de US$ 0,00372 por chamada em homologação. Quando a profundidade necessária superar a capacidade autorizada, a resposta deve preservar a camada factual, pedir contexto, oferecer aprofundamento posterior ou escalar — nunca improvisar uma conclusão.

**Proteções preservadas:** o orçamento mensal do membro continua sendo a principal barreira; rate limit continua voltado a abuso/uso massivo; pedidos empresariais legítimos não são bloqueados por conteúdo.
