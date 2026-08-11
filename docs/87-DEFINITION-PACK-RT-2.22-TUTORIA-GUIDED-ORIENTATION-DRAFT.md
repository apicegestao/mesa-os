# Definition Pack — RT-2.22 TutorIA Guided Orientation

**Status:** DRAFT — aguardando aprovação do owner  
**Modo proposto:** BUILD em homologação isolada  
**Não autoriza:** configuração de segredo, consumo de IA, deploy, promoção ou produção.

## Objetivo

Ativar a primeira orientação contextual do TutorIA, estritamente de leitura e baixo risco: responder sobre o próximo passo da jornada e explicar o mapa metodológico vigente, usando somente o contexto mínimo já protegido pelo RT-2.21.

O TutorIA continua sem poder alterar dados, aprovar evidências, escolher prioridades, criar Missões, gerar ferramentas, enviar mensagens ou falar em nome da Mesa dos Donos.

## Decisão de provedor proposta

**Recomendação:** iniciar a homologação com **Netlify AI Gateway + Gemini 2.5 Flash** em uma função server-side dedicada e limitada.

Motivos:

- o Gateway suporta Google Gemini e OpenAI sob um controle único de credenciais, uso e rate limiting;
- a primeira capacidade é orientação curta e estruturada, compatível com um modelo rápido e de menor custo;
- mantém o provedor substituível: OpenAI poderá ser habilitado depois pelo mesmo contrato, sem reescrever o TutorIA;
- as chaves pessoais do owner para Gemini e DeepSeek **não serão solicitadas, recebidas ou colocadas no repositório** neste incremento.

**DeepSeek:** não entra neste Release Train. Ele não está no conjunto coberto pelo AI Gateway atual e exigiria uma integração direta, segredo próprio, avaliação de privacidade, observabilidade e política de fallback separados.

**OpenAI/ChatGPT:** fica como rota futura opcional via AI Gateway quando o produto e o orçamento justificarem. Não depende de o owner nos enviar uma chave no chat.

## Capacidade autorizada, se aprovada

### TGO-2.22A — orientação contextual de leitura

- Entrada: objetivo escolhido pelo membro (`entender_proximo_passo` ou `entender_metodologia`), identidade autenticada e organização ativa.
- Contexto: exclusivamente os dois contratos RT-2.21 (`read_member_state` e `read_methodology_map`), códigos de ausência e versão de política.
- Saída: orientação curta estruturada em português, com `resumo`, `proxima_acao`, `justificativa_metodologica`, `confidence_band` e `escalation_required`.
- Não há texto de evidência, respostas livres de ferramenta, conteúdo de outras organizações, dados financeiros brutos ou histórico conversacional.

### TGO-2.22B — gateway de modelo seguro

- Função server-side; nenhuma chamada a modelo no navegador.
- Rate limit por identidade e organização; orçamento e máximo de tokens por chamada definidos no ambiente de homologação.
- Modelo, versão de prompt, latência, faixa de confiança, recusa e custo aproximado entram na auditoria sem guardar prompt integral ou resposta integral.
- Falha de provedor, contexto ausente, policy `deny`/`escalate`, baixa confiança ou saída fora do esquema resultam em resposta honesta de indisponibilidade e encaminhamento humano — jamais em orientação inventada.

### TGO-2.22C — interface honesta

- A CTA já existente passa a abrir um painel contextual somente após a capacidade server-side aprovada.
- A interface informa que a resposta é orientação assistida, apresenta a fonte metodológica resumida e oferece encaminhamento humano quando necessário.
- Não há simulação de autonomia, validação de evidência ou promessa de acompanhamento por WhatsApp.

## Proteções obrigatórias

- RLS e gateway RT-2.21 continuam sendo a única origem de contexto; o modelo não acessa Supabase diretamente.
- Nenhuma chave de provedor aparece em `NEXT_PUBLIC_*`, logs, Git, documentação ou chat.
- Sem persistência de prompt/resposta integral; retenção e memória continuam fora do escopo.
- Testes de schema de saída, política, rate limit, isolamento organizacional, falha de provedor e não-exposição de segredo.
- Limites iniciais só em homologação, com relatório de consumo antes de qualquer promoção.

## Fora do escopo

- DeepSeek direto, múltiplos provedores ativos, roteamento dinâmico ou fallback automático entre provedores.
- Memória conversacional, RAG, embeddings, aprendizado coletivo ou perfil comportamental.
- Evidência, desempate, priorização, Missão, ferramenta, documento PDF/XLSX, ação de banco ou automação.
- WhatsApp, e-mail, scheduler, proatividade, webhooks, anexos e comunicação externa.
- Produção, merge ou deploy sem Post-Flight e aprovação explícita de promoção.

## Critérios de aceite

1. Uma orientação só é produzida para identidade autenticada com vínculo organizacional ativo.
2. O modelo recebe somente o contrato mínimo tipado e não consegue chamar banco ou tools livres.
3. A saída inválida, incerta ou indisponível escala de modo honesto, sem recomendação fabricada.
4. Auditoria registra a operação sem conteúdo sensível, segredo, prompt ou resposta integral.
5. Testes, Advisor, limite de custo e homologação autenticada passam antes de qualquer promoção.

## Decisão pedida

Aprovar ou ajustar este pacote para que a orientação contextual do TutorIA seja construída **somente em homologação**, usando o AI Gateway com Gemini 2.5 Flash como rota inicial proposta.
