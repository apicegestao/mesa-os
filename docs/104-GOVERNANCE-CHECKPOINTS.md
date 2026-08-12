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
