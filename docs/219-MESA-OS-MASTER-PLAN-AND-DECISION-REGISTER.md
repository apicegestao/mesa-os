# Mesa OS — Plano Mestre e Registro Consolidado de Decisões

**Status:** CANÔNICO DE CONSOLIDAÇÃO — não substitui documentos de autoridade superior  
**Atualizado em:** 2026-08-14  
**Objetivo:** tornar visível, em um único lugar, o produto que está sendo construído, as decisões já tomadas, o que está em execução e o que ainda exige definição formal.

## 1. Como este documento deve ser usado

Este é o mapa de continuidade do Mesa OS. Ele existe para que nenhuma decisão importante dependa de memória, mensagens antigas ou interpretação livre.

Em caso de conflito, a ordem de autoridade é:

1. `00-CONSTITUTION.md`;
2. `02-V2-SCOPE.md`, ADRs e `09-CONSTRUCTION-PROTOCOL.md`;
3. `10-CURRENT-SCOPE.md` e Definition Pack aprovado;
4. este plano mestre;
5. conversa e sugestões novas.

A conversa **Mesa OS V2** (`6a7671ee-20b0-83e9-ba40-12c7b311f0b7`) é a baseline histórica oficial. Ela não autoriza código sozinha: toda decisão recuperada dela entra aqui como **confirmada**, **em definição** ou **futura**, e só entra em BUILD quando também estiver no escopo vigente.

## 2. Norte do produto

> **Mesa OS é uma plataforma de engenharia de transformação empresarial. A Mesa dos Donos é sua primeira metodologia.**

O sistema não vende consumo de conteúdo. Ele conduz transformação comprovável:

`Diagnóstico → Prioridade → Ciclo → Missão → Ferramenta → Implementação → Evidência → Evolução → nova reanálise`

Princípios que não podem ser perdidos:

- o membro sabe onde está, o que fazer agora e por que isso importa;
- uma ferramenta é um objeto estruturado e utilizável, não apenas um arquivo;
- evolução é implementação comprovada e impacto, não aula assistida;
- TutorIA é o centro operacional da experiência — não um chatbot genérico;
- complexidade da equipe interna não aparece para o membro;
- IA não muda regras críticas, metodologia ou acesso por conta própria;
- segurança, isolamento, rastreabilidade e privacidade não são negociáveis.

## 3. Metodologia Mesa dos Donos

### Mapa de desenvolvimento 4 × 4

| Pilar | T1 — Fundamentos | T2 — Controle | T3 — Previsibilidade | T4 — Autonomia |
|---|---|---|---|---|
| Financeiro e indicadores | DRE e painel mínimo | Orçamento e caixa | Metas e projeções | Decisão por indicadores |
| Equipe, cultura e liderança | Papéis e organograma | Rituais de liderança | Gestão de desempenho | Autonomia e sucessão |
| Marketing e vendas | Funil e proposta | Rotina comercial | Previsibilidade de vendas | Motor de crescimento |
| Processos internos | Mapa de processos | SOPs críticos | Indicadores de processo | Melhoria contínua |

Este mapa é a fonte metodológica para diagnóstico, ciclo, missões, ferramentas, conteúdo, evidências, métricas e contexto inicial do TutorIA. Ele deve ser versionado: uma evolução futura não reescreve a trajetória passada de um membro.

### Medidas distintas, que não podem ser confundidas

| Medida | O que representa |
|---|---|
| IME | maturidade da empresa e sua evolução nos pilares |
| Progresso do ciclo | execução do que é prioritário no trimestre |
| Health Score | saúde da jornada e risco de desengajamento; não é IME |
| Evidência | prova de implementação e uso real |
| Impacto | resultado operacional comprovado após a implementação |

## 4. Experiência do membro

### Arquitetura de informação desejada

- **Hoje:** ciclo atual, resultado/impacto, pendências prioritárias, próximas ações, pulso e direção do Lula/TutorIA. O Raio-X pendente aparece aqui como destaque; não como aba independente.
- **Jornada:** mapa trimestral, posição atual, entregas em implementação e conexão com o mapa 4 × 4.
- **Diagnósticos:** linha do tempo de entrada, pulsos, reanálises trimestrais e saída; a reanálise explica claramente o que será medido.
- **Evidências:** estatísticas, histórico por pilar e estados claros de aprovação, revisão e correção.
- **Evolução:** IME, comparação entrada × atual por dimensão, marcos comprovados e histórico dos ciclos.
- **Conta e segurança:** somente identidade, acesso, termos, privacidade e segurança do próprio membro. Não expõe governança de IA nem operação interna.

### Direção visual confirmada

- Arial em toda a aplicação;
- cor institucional principal `#101D37`;
- linguagem sóbria, elegante, compacta e consistente;
- cartões apenas quando resumem uma decisão, métrica ou ação; não como decoração;
- barras de progresso coloridas, dinâmicas e semanticamente explicáveis;
- hierarquia direta, sem telas longas ou poluídas;
- Lula como orientação contextual curta e, quando cabível, material externo relevante;
- TutorIA como botão flutuante persistente que abre conversa moderna e contextual — não como card fixo, menu rígido ou formulário antiquado.

**Estado atual:** a fundação visual e várias telas foram construídas, mas a fidelidade integral a esta direção ainda exige uma consolidação visual posterior. Nenhuma diferença visual deve ser interpretada como mudança da decisão acima.

## 5. TutorIA

### Papel acordado

TutorIA é o agente de transformação do membro. Deve compreender profundamente a metodologia, ferramentas, métricas, ciclo, evidências, trajetória e contexto permitido do próprio membro para orientar decisões reais, execução e aprendizado — inclusive DRE, RACI, SWOT e demais ferramentas — com padrão alto de qualidade.

Ele não é um assistente de entretenimento, mas também não pode bloquear dúvidas empresariais legítimas, pessoais ou situacionais. A proteção contra abuso deve restringir pedidos evidentemente fora da proposta ou abusivos, mantendo uma resposta útil e redirecionadora quando possível.

### Regras técnicas e de dados

- não acessa o banco diretamente; usa contratos de contexto permitidos;
- contexto é isolado por organização, finalidade e política de acesso;
- não usa informação de um membro para orientar outro;
- memória longitudinal é estruturada, versionada, auditável, corrigível e não equivale a guardar chat bruto;
- fatos automáticos só entram quando permitidos por termo vigente e proveniência rastreável;
- termos únicos no primeiro acesso cobrem o contexto longitudinal; atualização gera novo aceite, recibo temporal e PDF privado;
- qualquer ação que altere dados, ciclo, evidência, regra ou comunicação externa exige ferramenta autorizada e trilha de auditoria.

### Custo e qualidade

- orçamento mensal padrão aprovado: **R$ 100 por membro**;
- orçamento mensal interno da equipe Mesa dos Donos: **R$ 500 total**, separado dos membros e configurável por Admin sem alteração de código;
- orçamento controla custo e abuso, não reduz artificialmente o nível de análise; respostas complexas podem usar roteamento de modelo e limites operacionais apropriados;
- provedor/modelo é chamado somente no servidor; Gemini e DeepSeek podem ser configurados. OpenAI e outros entram por adaptadores quando houver chave e aprovação;
- custo por membro, resolução, modelo e operação interna é métrica administrativa.

### Ainda requer incremento próprio

- validação de evidência por IA com confiança, regra e escalonamento humano quando necessário;
- comunicação proativa por WhatsApp oficial Meta, com consentimento, horário silencioso, limites, opt-out e orquestração para não gerar excesso de mensagens;
- autonomia de execução além dos contratos já aprovados;
- qualquer regra de desempate automatizado: há conflito documental a resolver, pois foi solicitado que TutorIA escolha a alternativa mais lógica sem intervenção humana, enquanto o escopo vigente ainda veda autonomia/desempate automático. Isso precisa de Change Request antes de BUILD.

## 6. Ferramentas e documentos

O sistema deve suportar ferramentas estruturadas, assistidas pelo TutorIA, com dados persistidos, versões e contexto do ciclo. Exemplos: DRE, RACI, SWOT, mapas, rotinas e modelos futuros autorizados pelo mapa metodológico.

Quando autorizado para uma ferramenta, o membro poderá gerar e baixar PDF e XLSX com identidade Mesa dos Donos, mantendo o histórico privado e podendo baixar novamente a versão correspondente ou gerar uma versão atualizada. Arquivo não substitui o objeto estruturado do sistema.

## 7. Acessos e papéis

### Membro

Usa acesso por e-mail previamente autorizado e código temporário. Sem senha, link mágico ou login social no modelo atual. Vê apenas sua organização, sua jornada, seus documentos, seus termos e seu contexto autorizado.

### Equipe interna

O acesso interno usa o mesmo princípio simples de e-mail + código, mas é segregado do ambiente do membro e liberado somente por atribuição operacional ativa.

| Papel | Responsabilidade e limite principal |
|---|---|
| Donos / Admin | governança, configuração, aprovações e visões administrativas autorizadas |
| Concierge (operador) | onboarding, carteira, suporte e intervenções; carteira atribuída |
| Mentor | visão metodológica de todos os membros, sem acesso indiscriminado a conteúdo bruto ou financeiro |
| Comercial | CRM, oportunidades e handoff comercial |
| Financeiro | contratos, cobranças, pagamentos, elegibilidade e auditoria financeira |
| Metodologia / Conteúdo | propõe e mantém versões autorizadas de método e ferramentas |
| Intelligence | produz e analisa propostas internas agregadas; não publica nem altera o sistema sozinha |
| TI / Plataforma | operação técnica, segurança, integração e observabilidade sob menor privilégio |

Concierge também exerce a função operacional; não é necessário um cargo paralelo chamado “operador”.

## 8. Backoffice, CRM e financeiro

### CRM

- tela comercial centrada em **Kanban**, uma oportunidade por empresa e detalhe progressivo dentro do cartão;
- botão claro para nova oportunidade;
- abaixo: fluxo comercial da Mesa dos Donos e análise agregada de gargalos, oportunidades, ameaças e SWOT determinística;
- CRM pronto para futuras integrações oficiais com WhatsApp e Instagram, sem ativá-las antecipadamente;
- a comercial converte, o pagamento confirma, o acesso é provisionado e a Concierge recebe o onboarding de forma auditável.

### Capacidade e handoff

- capacidade padrão aprovada: **100 membros ativos por Concierge**, configurável por Admin;
- distribuição automática usa Concierge elegível de menor ocupação; empates técnicos são determinísticos e auditáveis;
- sem vaga, cria fila operacional explícita — nunca atribuição silenciosa;
- a decisão de distribuição não altera pagamento, acesso, metodologia ou ciclo.

### Financeiro e checkout

- domínio financeiro canônico e portável: catálogo/preço, proposta, contrato, cobrança, pagamento, entitlement e auditoria;
- Asaas Sandbox é adaptador atual: checkout hospedado, webhook idempotente e reconciliação; cartão e PIX não passam pelo Mesa OS;
- pagamento confirmado pode vincular a conta CRM à organização e preparar a matrícula `owner` por e-mail/OTP; conflitos seguem para Concierge;
- cancelamento, inadimplência, estorno, bloqueio/restrição de acesso e produção financeira exigem o próximo pacote formal e teste integrado.

## 9. Mesa OS Intelligence

Mesa OS Intelligence é uma capacidade interna, não uma tela de membro e nem um “piloto automático”. Sua função é ajudar a Mesa a evoluir método, ferramentas, ciclos, encontros, suporte, comercial e operação a partir de padrões agregados.

Pode apoiar Admin, Metodologia, Mentor e Concierge com sinais e propostas. Não pode:

- expor dados identificáveis de uma organização a outra;
- usar chats brutos como base indiscriminada;
- publicar conteúdo, mudar metodologia, alterar regra ou tomar ação automática;
- substituir a decisão humana responsável.

O desenho atual usa coortes agregadas e suprime grupos pequenos. A evolução desejada é:

`dados governados → insight explicável → proposta versionada → revisão humana → aprovação → publicação controlada`

**O que Intelligence poderá atualizar sem código, após a base editorial autorizada:** conteúdos, materiais externos, parâmetros, versões de ferramentas, critérios e ciclos previamente modelados.  
**O que continuará exigindo código:** novos tipos de dado, novos fluxos de permissão, integrações, cálculo inédito, automação de efeitos, novas superfícies de produto e mudanças de segurança.

## 10. Segurança, portabilidade e operação

- aplicação greenfield: legado excluído e jamais usado como base de código;
- modular monolith em Next.js/React + TypeScript; PostgreSQL/Supabase com migrations versionadas;
- RLS, validação server-side, auditoria e menor privilégio;
- dev, homologação e produção separados; produção não é laboratório;
- segredos somente em cofres de ambiente, nunca cliente ou Git;
- adaptadores isolam Supabase, Netlify, Asaas e provedores de IA para permitir troca futura sem reescrever o domínio;
- GitHub guarda código e histórico; não é dependência de execução;
- documentação, testes, lint, typecheck, build e Post-Flight são gates mínimos.

## 11. Estado de execução consolidado

| Frente | Estado honesto |
|---|---|
| Fundação técnica, migrations, CI e governança | construída e em evolução controlada |
| Metodologia 4 × 4, ciclos, métricas e evolução | autorizada/construída em homologação; exige revisão consolidada antes de promoção |
| Aplicação do membro e direção visual | parcialmente construída; requer reconciliação visual final com a referência aprovada |
| TutorIA foundation, contexto e orçamento | fundação construída em homologação; capacidades autônomas e validação de evidências ainda não ativas |
| Login OTP membro/equipe | fluxo homologado; precisa permanecer no smoke consolidado, não em ciclos de teste dispersos |
| CRM, suporte e carteira | construídos em homologação; CRM visual/arquitetura ainda em consolidação |
| Capacidade e distribuição Concierge | implementada em homologação, com configuração Admin e fila auditável |
| Financeiro/Asaas Sandbox | adaptador e vínculo pós-pagamento preparados; falta smoke externo consolidado de webhook/entitlement |
| Intelligence | fundação agregada e proposta interna; sem modelo ativo e sem ação automática |
| Produção | permanece protegida; nenhuma promoção automática |

## 12. Ordem de trabalho daqui em diante

### Bloco A — Consolidação de homologação (prioridade imediata)

1. validar migrations, RLS/RPC, variáveis de ambiente, login OTP, papéis e dados de demonstração;
2. fazer um único smoke consolidado: membro, equipe, CRM, checkout sandbox, pagamento/webhook, matrícula, carteira e suporte;
3. registrar Post-Flight e gaps reais; não promover produção sem decisão explícita.

### Bloco B — Experiência interna coerente

1. separar no backoffice as superfícies CRM, suporte/carteira, financeiro, Intelligence e administração, sem uma página única poluída;
2. concluir a experiência CRM Kanban aprovada e o detalhe de empresa;
3. manter a inteligência comercial agregada e explicável.

### Bloco C — Experiência do membro e fidelidade visual

1. consolidar Hoje, Jornada, Diagnósticos, Evidências e Evolução no padrão visual aprovado;
2. preservar cards adaptáveis, métricas rastreáveis e estados honestos quando não houver dados;
3. tornar TutorIA a presença flutuante persistente conforme a decisão visual.

### Bloco D — Próximas definições antes de BUILD

- FIN: ciclo financeiro completo (inadimplência, cancelamento, reembolso, acesso e produção);
- EVD-AI: avaliação de evidências com confiança e escalonamento humano;
- TUTORIA: ativação de modelos, ferramentas e ações além da fundação homologada;
- INT: Intelligence ativa, propostas editoriais e governança de publicação;
- COM: WhatsApp/Instagram oficiais, consentimentos e orquestração;
- MTH: editor e governança de metodologia/ferramentas versionadas.

## 13. Regras para não nos perdermos novamente

1. Toda ideia nova recebe uma destas etiquetas: **decisão confirmada**, **proposta**, **em definição**, **futura** ou **fora de escopo**.
2. Nenhuma ideia vira código diretamente pela conversa.
3. Cada bloco de BUILD começa com Alignment Check + Pre-Flight e termina com testes + Post-Flight.
4. Mudança em decisão FROZEN ou conflito de fontes exige Change Request.
5. Um checkpoint consolidado substitui vários testes/deploys isolados; riscos de segurança, pagamento, acesso, RLS, privacidade e segredo nunca são adiados.
6. Produção só recebe uma versão madura, validada e explicitamente aprovada pelo owner.

## 14. Pontos de reconciliação já identificados

Estes itens não devem ser “resolvidos por interpretação”:

1. `10-CURRENT-SCOPE.md` contém autorizações posteriores e também proibições antigas contraditórias (por exemplo, Mentor, Tools, Financeiro e Intelligence). A próxima manutenção documental deve normalizá-lo sem alterar o Constitution.
2. A regra solicitada para que TutorIA resolva empates com a alternativa mais lógica conflita com a vedação atual de autonomia/desempate automático. Exige Change Request e critérios verificáveis.
3. A visão de TutorIA autônomo, proativo e integrado ao WhatsApp continua produto futuro até existir pacote de comunicação, política de consentimento e integração oficial Meta.
4. O design alvo foi aprovado, mas a implementação ainda precisa de um passe de fidelidade e organização de rotas/superfícies antes de ser considerada encerrada.

## 15. Referências primárias

- `00-CONSTITUTION.md`
- `02-V2-SCOPE.md`
- `08-ADR-DECISION-LOG.md`
- `09-CONSTRUCTION-PROTOCOL.md`
- `10-CURRENT-SCOPE.md`
- `63-SOURCE-RECOVERY-MESA-OS-V2.md`
- `98-ACCELERATED-DELIVERY-PROTOCOL.md`
- `104-GOVERNANCE-CHECKPOINTS.md`
- `181-OPERATING-MODEL-TEAM-CRM-INTELLIGENCE.md`
- `212-ACCELERATED-HOMOLOGATION-CHECKPOINT.md`
- `217-DEFINITION-PACK-CRM-EXPERIENCE-CONCIERGE-ALLOCATION.md`

