# Alignment Check — RT-2.22 TutorIA Guided Orientation

**Status:** PASS — 2026-08-11

## Autoridade

- Owner aprovou o Definition Pack RT-2.22 em conversa, após ler a rota proposta de Gemini via AI Gateway.
- A fonte de produto permanece SRC-001 / `Mesa OS V2`; `docs/67-TUTORIA-CANONICAL-ARCHITECTURE.md` e `docs/80-TUTORIA-CONTEXT-ISOLATION-AND-MEMORY.md` continuam canônicos.
- RT-2.21 permanece a fronteira obrigatória de contexto, policy, RLS e auditoria.

## Decisões alinhadas

- O primeiro modelo será um componente substituível, server-side e de leitura; não é o sistema nem possui acesso direto ao banco.
- A rota inicial será Gemini 2.5 Flash pelo Netlify AI Gateway, sem receber a chave pessoal do owner.
- OpenAI é compatível com o mesmo gateway em incremento futuro; DeepSeek direto continua fora do RT-2.22.
- Não será consumida inferência até existir flag de ambiente de homologação, limite de custo e verificação de configuração.

## Exclusões confirmadas

- Nenhuma memória conversacional, RAG, autonomia, evidência, desempate, documento, ferramenta, WhatsApp ou comunicação externa.
- Nenhuma configuração de segredo, alteração de produção, merge ou deploy nesta fase de build.
