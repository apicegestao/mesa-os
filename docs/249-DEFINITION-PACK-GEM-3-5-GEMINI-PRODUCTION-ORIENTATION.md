# Definition Pack GEM-3.5 — Gemini direto para orientação TutorIA

**Status:** APROVADO PARA BUILD E INCLUSÃO NO RELEASE TRAIN INTEGRADO  
**Data:** 16 de agosto de 2026  
**Decisão do owner:** Gemini será o primeiro provedor pago do TutorIA no piloto real.

## Objetivo

Ativar a orientação contextual do TutorIA com `gemini-2.5-flash`, mantendo o
contrato já existente: entrada tipada, contexto isolado por organização, memória
autorizada, resposta JSON validada, orçamento por membro, limite por chamada, rate
limit, auditoria e escalonamento honesto quando a confiança for baixa.

## Escopo autorizado

- chamada server-side pelo SDK oficial `@google/genai`, com `GEMINI_API_KEY` em
  segredo de produção;
- capacidade `tutoria_orientation` somente para membro autenticado e ativo;
- modelo estável `gemini-2.5-flash`;
- orçamento já aprovado de R$ 100 por membro/mês e reserva/baixa atômica existente;
- timeout, máximo de tokens, temperatura conservadora e schema JSON;
- auditoria de provider/modelo, tokens estimados, custo, duração e resultado, sem
  chave, prompt ou conversa bruta;
- kill switch `TUTORIA_ORIENTATION_ENABLED=false`.

## Fora de escopo

- validação de Evidência por IA em produção;
- DRE especializada paga em produção;
- Thor, especialistas, function calling, ações que alteram dados, autonomia de
  ciclo/missão, WhatsApp ou comunicação externa;
- segundo provedor, fallback automático, RAG, embeddings ou treinamento com dados
  de membros;
- ativação por cliente, navegador ou variável `NEXT_PUBLIC_`.

## Segurança e dados

- a chave é cadastrada exclusivamente no cofre de produção do Netlify, com escopo
  de Functions/runtime; não entra em Git, navegador, logs ou banco;
- o SDK recebe a chave explicitamente no runtime; não depende de gateway ou URL
  pública configurável;
- cada chamada reconfirma identidade, matrícula ativa, organização e política de
  leitura antes de gerar contexto;
- baixa confiança, saída inválida, timeout, orçamento indisponível ou falha do
  provedor resultam em resposta honesta/escalonada, nunca em conteúdo inventado;
- a mudança de auditoria é migration versionada, com privilégios mínimos e sem
  exposição nova de tabela/RPC.

## Variáveis de produção

| Variável | Tipo | Regra |
|---|---|---|
| `GEMINI_API_KEY` | segredo | valor da chave do owner; Functions/runtime; nunca pública |
| `TUTORIA_ORIENTATION_ENABLED` | configuração | `true` somente depois do smoke técnico |
| `TUTORIA_ORIENTATION_MAX_COST_USD_MICROS_PER_REQUEST` | configuração | mínimo igual ao teto calculado da chamada; permite desligar por orçamento |

## Critérios de aceite

1. sem `GEMINI_API_KEY` ou com kill switch desligado, nenhuma chamada externa é feita;
2. com credencial válida, uma orientação autorizada retorna JSON válido ou escalona;
3. a chave não aparece em bundle, log, resposta, banco ou teste;
4. orçamento é reservado antes da chamada e liquidado uma vez;
5. auditoria identifica `gemini_direct` e o modelo, sem conteúdo sensível;
6. membro de outra organização ou sem matrícula não alcança o provedor;
7. lint, tipos, testes, build, revisão de migration e Security Advisor passam.

## Promoção

GEM-3.5 entra no Release Train integrado, mas sua chave só será cadastrada após a
promoção de schema/código estar pronta para smoke. O primeiro teste usa uma
organização de demonstração e uma única solicitação controlada. Convites reais só
ocorrem após confirmação de custo, resposta, persistência e auditoria.
