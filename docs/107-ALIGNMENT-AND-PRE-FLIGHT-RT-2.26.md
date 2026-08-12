# Alignment & Pre-Flight — RT-2.26 Contexto Longitudinal do Membro

**Status:** PASS — 2026-08-12

## Alinhamento

- Definition Pack 106 foi aprovado pelo owner.
- A conversa fonte `Mesa OS V2`, ADR-036 e ADR-039 determinam contexto longitudinal estruturado, e rejeitam chat bruto como memória canônica.
- O histórico do sistema já possui fontes imutáveis e versionadas: diagnóstico, ciclos sequenciais, prioridades, Missões, ferramentas, evidências, métricas e documentos.
- Mesa OS Intelligence permanece um plano agregado e separado; este trem não concede acesso identificável à equipe interna nem reutilização entre organizações.

## Primeiro recorte de BUILD

1. Contrato de `memory record` isolado por organização, sujeito, origem, confiança, validade, estado e versão.
2. Criação somente por confirmação explícita do membro; nenhuma extração automática de chat.
3. Consulta mínima e auditável de memórias ativas da própria organização para finalidade declarada.
4. Interface de transparência para o owner revisar, contestar e invalidar suas próprias memórias.

## Retenção e condição de parada

Nenhuma regra de prazo é inventada. O primeiro recorte registra validade opcional, invalidação e origem, mas não ativa expurgo automático ou captura de conversa. Antes de ativar qualquer memória derivada de chat, automação ou exclusão definitiva, será necessário um subpack de retenção e direitos LGPD.

## Fora do escopo

Chat bruto persistente, RAG, embeddings, aprendizado coletivo, fine-tuning, WhatsApp, proatividade, RBAC interno/MFA, Mesa OS Intelligence operacional e produção.

## Validação prevista

Migration aditiva em homologação, RLS e Security Advisor sem alertas, testes de isolamento/correção/invalidação, lint, typecheck e build. Não haverá deploy ou promoção automática.
