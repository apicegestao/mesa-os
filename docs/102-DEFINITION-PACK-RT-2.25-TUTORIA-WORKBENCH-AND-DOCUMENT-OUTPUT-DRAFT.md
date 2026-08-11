# Definition Pack — RT-2.25 TutorIA Workbench e Saídas de Documento

**Status:** DRAFT — aguardando aprovação do owner
**Modo proposto:** BUILD em homologação isolada, após o smoke autenticado do RT-2.24

## Decisão de produto

TutorIA é o centro da experiência Mesa dos Donos. Ele acolhe perguntas abertas de gestão, ensina fundamentos, ajuda a estruturar decisões e conduz o membro pela metodologia. Limites existem para proteger dados, custos e integridade — não para transformar o TutorIA em um FAQ.

Pedidos claramente recreativos ou alheios ao propósito empresarial (por exemplo, imagens, figurinhas, memes e entretenimento) continuam recusados localmente. Dúvidas reais, inclusive iniciais, incompletas ou situacionais, continuam permitidas e recebem uma resposta, uma pergunta de esclarecimento ou encaminhamento honesto.

## Escopo proposto

### TWR-2.25A — conversa de gestão ampliada

- Conversa aberta orientada a decisões, finanças, pessoas, vendas, processos, estratégia, rotina do dono e metodologia Mesa.
- O TutorIA pode explicar conceitos, elaborar rascunhos, fazer perguntas de descoberta e propor uma estrutura de trabalho.
- Persistência de memória somente quando houver contrato explícito, finalidade, retenção e isolamento por organização aprovados. A conversa bruta não é reutilizada entre membros nem para treinamento.

### TWR-2.25B — workbench de ferramentas

- Fluxos assistidos para DRE, RACI, SWOT e demais ferramentas explicitamente publicadas no Mapa de Desenvolvimento.
- Cada saída nasce estruturada, revisável pelo membro e vinculada a ciclo, missão, pilar e versão metodológica quando aplicável.
- TutorIA prepara e explica; ele não aprova evidência, conclui Missão, altera indicador ou toma decisão em nome do membro.

### TWR-2.25C — documentos de identidade Mesa

- Geração de prévia e exportação de PDF e XLSX para ferramentas suportadas.
- Templates canônicos com identidade Mesa dos Donos, dados de origem, versão, data de geração e aviso de rascunho quando não houver validação.
- Exportação somente após confirmação do membro; arquivos isolados por organização, com autorização, retenção e trilha de auditoria.

### TWR-2.25D — roteamento de modelo governado

- Rota padrão: Gemini Flash para conversa rápida e econômica; Gemini Pro somente para tarefas aprovadas de maior complexidade.
- Rotas elegíveis: Gemini, OpenAI e Claude diretamente via Netlify AI Gateway; DeepSeek apenas via OpenRouter com Zero Data Retention confirmado no momento da chamada.
- Seleção é server-side, registrada por código de rota e custo, sem expor chave ou permitir escolha livre de provedor pelo membro.
- Nenhum fallback silencioso: indisponibilidade, baixa confiança ou orçamento insuficiente geram estado explícito e seguro.

## Proteções inegociáveis

- Contexto mínimo e derivado; nunca acesso direto do modelo ao banco.
- Isolamento estrito por organização e finalidade; nenhuma informação de um membro aparece para outro.
- Limites financeiros por membro e orçamento interno Mesa já aprovados continuam obrigatórios, com reserva antes da inferência e liquidação posterior.
- Rate limits protegem abuso sem bloquear perguntas empresariais legítimas.
- Auditoria registra decisão, rota, custo e metadados; não registra prompt ou resposta integrais.
- Validação de schema e revisão humana/escalonamento para baixa confiança ou ações de alto impacto.

## Fora do escopo deste incremento

- WhatsApp, e-mail, proatividade autônoma, agendamento, RAG amplo, fine-tuning e Mesa OS Intelligence operacional.
- Aprovação autônoma de evidência, conclusão de Missão, alteração de dados sem confirmação e decisões empresariais autônomas.
- Geração livre de imagens ou conteúdo de entretenimento.
- Promoção para produção sem aprovação separada, revisão de privacidade, teste autenticado e Post-Flight.

## Critérios de aceite propostos

1. O membro consegue fazer perguntas abertas de gestão sem bloqueio arbitrário.
2. Uma ferramenta aprovada é montada em estrutura editável, com fonte metodológica rastreável.
3. PDF e XLSX preservam identidade Mesa, dados corretos e escopo organizacional.
4. Cada chamada tem rota, custo, orçamento, auditoria e comportamento seguro em falha.
5. Nenhum modelo recebe dados de outra organização ou persiste conversa fora do contrato aprovado.

## Decisão pedida

Aprovar o RT-2.25 para detalhar o contrato de ferramentas/documentos e construir sua primeira fatia em homologação, sem promoção automática para produção.
