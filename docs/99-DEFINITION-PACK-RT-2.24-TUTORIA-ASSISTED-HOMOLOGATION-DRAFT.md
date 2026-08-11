# Definition Pack — RT-2.24 TutorIA Assistido em Homologação

**Status:** DRAFT — aguardando aprovação do owner
**Modo proposto:** BUILD em homologação isolada, dentro do Protocolo 98

## Objetivo

Entregar a primeira experiência funcional do TutorIA para o membro: uma conversa de gestão curta, contextual e segura, que acolhe dúvidas reais, orienta pelo método Mesa dos Donos e responde de forma honesta quando precisa de contexto ou apoio humano.

## Escopo do trem

### TAH-2.24A — experiência de conversa assistida

- Painel do TutorIA acionado pelos pontos já existentes na experiência do membro.
- Pergunta aberta limitada a 1.200 caracteres, sem anexos, imagens, links externos ou histórico conversacional persistente.
- Objetivo metodológico selecionado pela interface, com linguagem natural do membro como contexto não confiável.
- Estados explícitos: respondido, precisa de mais contexto, encaminhado, fora do escopo, limite de uso ou indisponível.

### TAH-2.24B — limites úteis contra abuso

- Aceitar dúvidas ligadas a gestão, decisões, situações reais, finanças, DRE, equipe, marketing, vendas, processos, jornada e ferramentas Mesa.
- Recusar conteúdo evidentemente criativo/entretenimento, tentativa de acesso a dados ou instruções internas, uso ilegal/perigoso e tentativa de burlar regras.
- Resposta de recusa curta e respeitosa, orientando o membro a uma pergunta empresarial legítima.
- Rate limit e orçamento do RT-2.23 continuam sendo aplicados a toda pergunta aceita.

### TAH-2.24C — ativação exclusivamente em homologação

- AI Gateway com rota Gemini Flash, flags e teto por chamada configurados somente no ambiente de homologação/preview.
- Owner configura a política inicial de R$100 por membro e uma cotação BRL/USD de referência pela área de Governança de IA.
- Smoke autenticado verifica: pergunta útil, recusa, escalonamento, limite, reserva, liquidação, liberação em falha e auditoria sem conteúdo sensível.
- Saída de modelo segue schema; baixa confiança ou quebra de regra nunca gera orientação inventada.

## Proteções

- O modelo recebe somente estado derivado do membro, resumo metodológico e pergunta limitada; nunca acesso direto ao banco.
- Pergunta e resposta integrais não entram em auditorias/ledgers; somente decisão, metadados técnicos e custo.
- Sem memória entre membros e sem uso de conversa para treinamento.
- Nenhuma evidência é aprovada, nenhum dado é alterado, nenhuma decisão é tomada em nome do membro e nenhum conteúdo é publicado.
- Falha de auditoria, orçamento, provider, schema ou política interrompe a resposta de forma honesta.

## Fora do escopo

- Produção, deploy de promoção, WhatsApp, e-mail, agendamento ou proatividade.
- Ferramentas geradas, PDF/XLSX, upload, anexos, RAG, memória conversacional, fine-tuning ou Mesa OS Intelligence.
- Múltiplos provedores ativos, fallback automático, DeepSeek direto ou uso de chave pessoal do owner.
- Ações no banco, aprovação de evidência, priorização, Missões e decisões autônomas.

## Critérios de aceite

1. Um membro autenticado recebe orientação apenas sobre seu próprio contexto.
2. Dúvidas abertas de gestão são acolhidas; abuso evidente é recusado sem custo de modelo.
3. Toda chamada permitida respeita reserva atômica e orçamento individual.
4. Nenhum texto integral sensível entra em ledger/auditoria.
5. Testes, build, Advisor, smoke autenticado e revisão de custo passam antes de preview consolidado.
6. Produção continua bloqueada até aprovação de promoção separada.

## Decisão pedida

Aprovar o RT-2.24 para construir e homologar o primeiro TutorIA assistido, sem promover para produção.
