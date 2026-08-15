# MTH-3.4D — Guias editoriais internos do T1

**Status:** APPROVED FOR BUILD — interno, sem publicação

Este documento é a fonte editorial de trabalho para a primeira turma. Ele não é uma aula longa nem deve aparecer integralmente ao membro: o sistema oferece somente a parte contextual necessária para a próxima ação.

## Padrão comum de condução

1. TutorIA explica a transformação em linguagem simples e pergunta pelo fato atual;
2. membro preenche a ferramenta com dados reais, mesmo incompletos;
3. TutorIA identifica lacunas e organiza uma menor próxima ação; não inventa dados;
4. membro aplica em uma rotina ou decisão real;
5. Evidência prova o uso; não basta prometer que usará;
6. impacto só entra em Evolução quando há fonte, período e comparação suficientes.

## Unidade 1 — Financeiro e indicadores

**Código:** `t1_finance_dre_dashboard`  
**Ferramenta primária:** `dre_management_v1`  
**Transformação:** decidir com resultado, caixa e indicadores essenciais — não pelo saldo bancário isolado.

### Explicação essencial

- faturamento é entrada de vendas; não é lucro;
- margem mostra o quanto permanece após custos diretamente ligados à venda;
- lucro considera custos e despesas do período;
- caixa mostra disponibilidade financeira; pode divergir do lucro;
- a primeira DRE deve fechar um mês real, com premissas explícitas quando faltar dado.

### Exemplo didático fictício

Uma empresa faturou R$ 100 mil. Custos variáveis foram R$ 45 mil, despesas fixas R$ 25 mil e despesas operacionais R$ 15 mil. A margem de contribuição é R$ 55 mil e o resultado operacional antes de itens financeiros é R$ 15 mil. O TutorIA deve perguntar se receitas, custos e despesas se referem ao mesmo período antes de comparar.

### Checklist de qualidade

- período de referência definido;
- receita líquida separada de custos variáveis;
- despesas fixas e operacionais não duplicadas;
- valores têm fonte declarada;
- calendário de fechamento e responsável definidos;
- uma decisão tomada a partir da leitura foi registrada.

### Implementação, Evidência e métricas

| Camada | Critério |
|---|---|
| Implementação | DRE de mês real fechada e ritual de leitura semanal/mensal iniciado |
| Evidência | DRE + registro de uma decisão baseada nela |
| Métricas | dias para fechamento, margem de contribuição, saldo de caixa |

### Roteiro do TutorIA

Pergunta inicial: “Qual mês real podemos fechar primeiro e onde estão esses números?”  
Limites: não inventar números, não dar aconselhamento contábil/fiscal e não prometer resultado financeiro.

## Unidade 2 — Equipe, cultura e liderança

**Código:** `t1_leadership_roles_org_chart`  
**Ferramenta primária:** `raci_roles_decisions_v1`  
**Transformação:** tornar explícito quem decide, executa e responde pelos resultados essenciais.

### Explicação essencial

- cargo é posição; papel é responsabilidade prática; decisão é direito de agir;
- cada resultado essencial precisa de um responsável final claro;
- autonomia tem limites conhecidos, não abandono;
- organograma essencial mostra relações de reporte e posições críticas, sem burocracia artificial.

### Exemplo didático fictício

No processo de compras, o coordenador executa cotações, o financeiro confere orçamento e o dono aprova somente exceções acima de um limite definido. Isso reduz decisões rotineiras concentradas no dono.

### Checklist de qualidade

- papéis essenciais mapeados;
- resultado esperado por papel explícito;
- responsabilidades sem duplicidade relevante;
- decisões que não precisam escalar identificadas;
- mapa discutido em uma reunião real;
- uma decisão/ritual já usa o mapa.

### Implementação, Evidência e métricas

| Camada | Critério |
|---|---|
| Implementação | mapa discutido e aplicado em decisão ou ritual real |
| Evidência | ata, decisão ou rotina que demonstre o papel em uso |
| Métricas | decisões concentradas no dono, responsabilidades sem responsável, frequência de rituais |

### Roteiro do TutorIA

Pergunta inicial: “Qual decisão ainda depende de você sem necessidade?”  
Limites: não decidir pessoas, não criar organograma fictício e escalar conflito humano persistente.

## Unidade 3 — Marketing e vendas

**Código:** `t1_marketing_sales_funnel_value`  
**Ferramenta primária:** `sales_funnel_value_v1`  
**Transformação:** enxergar oportunidades reais, critérios de etapa e a próxima ação que move cada negociação.

### Explicação essencial

- o funil começa por oportunidades reais, não por metas desejadas;
- cada etapa precisa de critério observável de entrada/saída;
- toda oportunidade aberta deve ter próximo passo, data e responsável;
- proposta de valor conecta público, problema, resultado pretendido e prova disponível;
- o primeiro funil é uma hipótese operacional, a ser ajustada com fatos.

### Exemplo didático fictício

Uma oportunidade entrou por indicação, está em diagnóstico porque houve reunião e necessidade confirmada, tem proposta marcada para sexta-feira e um responsável pela preparação. Sem próxima ação, ela não pode ser considerada oportunidade conduzida.

### Checklist de qualidade

- oportunidades reais registradas;
- origem e etapa observável preenchidas;
- valor estimado separado de valor contratado;
- próxima ação e responsável obrigatórios;
- proposta de valor testada em exemplo real;
- ritual semanal de revisão iniciado.

### Implementação, Evidência e métricas

| Camada | Critério |
|---|---|
| Implementação | funil atualizado e rotina comercial semanal iniciada |
| Evidência | funil + proposta ou decisão comercial registrada |
| Métricas | oportunidades por etapa, conversão, ticket estimado, ações sem próximo passo |

### Roteiro do TutorIA

Pergunta inicial: “Qual oportunidade real precisa de uma próxima ação agora?”  
Limites: não prometer venda, não contatar leads e não tratar hipótese como fato.

## Unidade 4 — Processos internos

**Código:** `t1_processes_map`  
**Ferramenta primária:** `critical_process_map_v1`  
**Transformação:** fazer um processo crítico deixar de depender de memória, com fluxo, responsável e controle.

### Explicação essencial

- escolher um processo de alto impacto e recorrência, não mapear a empresa inteira;
- definir gatilho, saída esperada, etapas, responsável e controle;
- registrar exceções relevantes, em vez de escondê-las;
- testar o fluxo em operação é mais valioso que um documento bonito.

### Exemplo didático fictício

No atendimento inicial, o gatilho é uma nova solicitação. A saída é uma proposta enviada com confirmação de recebimento. Cada etapa tem responsável, prazo e controle; exceções de urgência são registradas.

### Checklist de qualidade

- processo crítico escolhido por impacto;
- gatilho e saída verificáveis;
- etapas ordenadas e responsáveis definidos;
- ponto de controle em cada etapa sensível;
- risco/exceção conhecido registrado;
- fluxo testado pelo menos uma vez.

### Implementação, Evidência e métricas

| Camada | Critério |
|---|---|
| Implementação | processo mapeado, comunicado e testado em operação real |
| Evidência | registro de uso, checklist ou comparação verificável de falha/retrabalho |
| Métricas | tempo de ciclo, falhas/retrabalho, etapas sem responsável, aderência ao checklist |

### Roteiro do TutorIA

Pergunta inicial: “Qual processo gera mais retrabalho hoje?”  
Limites: não criar procedimento fictício, não afirmar ganho sem fonte e não ocultar exceções relevantes.

## Controle de versão e publicação

- este material deve ser comparado com a revisão editorial no banco antes de publicação;
- uma melhoria gera nova revisão, nunca reescreve a experiência já publicada;
- Intelligence pode sugerir melhoria futura com dados agregados elegíveis, mas não edita nem publica;
- Admin é responsável por publicar no gate de homologação após revisão metodológica.
