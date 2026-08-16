# Definition Pack THR-4.0 — Thor e Time de Especialistas

**Status:** DECISÃO ARQUITETURAL ACEITA; BUILD NÃO AUTORIZADO  
**Data:** 16 de agosto de 2026  
**Origem recuperada:** conversa-fonte `Mesa OS V2`, visão aprovada de TutorIA como
centro do produto, contexto longitudinal, ferramentas estruturadas e Intelligence
interna governada; alinhamento complementar do owner em 16 de agosto de 2026.

## 1. Objetivo

Oferecer uma única experiência conversacional chamada **Thor**, capaz de encaminhar
uma demanda ao TutorIA ou a uma capacidade especialista, sem fragmentar o contexto,
a metodologia, a segurança ou a experiência do membro.

## 2. Decisões vinculantes

| Elemento | Decisão |
|---|---|
| Thor | É a interface única e o orquestrador de intenção. Não substitui TutorIA. |
| TutorIA | É a autoridade metodológica: Jornada, diagnóstico, ciclo, missões, ferramentas, evidências, evolução e próximo melhor passo. |
| Especialistas | Capacidades de execução por domínio, inicialmente candidatas para financeiro, marketing/vendas, processos, liderança e conteúdo. |
| Ações críticas | Não são decididas por especialistas. Exigem contratos de ferramenta, validação, escopo e auditoria. |
| Memória | Conversa e memória estruturada são distintas. Memória canônica possui fonte, confiança, escopo, validade e possibilidade de correção. |
| Intelligence | Recebe sinais governados e agregados; gera propostas explicáveis para revisão humana. |

## 3. Fluxo lógico futuro

`mensagem do membro → Thor identifica intenção e risco → TutorIA ou especialista → resposta/artefato → contexto longitudinal qualificado → sinal agregado para Intelligence quando permitido`.

O roteamento deve preferir TutorIA quando a solicitação disser respeito a método,
prioridade, ciclo, evidência, ferramentas Mesa ou evolução. Um especialista pode
executar uma demanda, mas não reinterpreta a metodologia.

## 4. Conhecimento, prompts e ferramentas

Não haverá treinamento de modelo com dados brutos de membros como ponto de partida.
A evolução será feita por artefatos governados:

1. base metodológica e referências aprovadas;
2. instruções versionadas por papel e domínio;
3. ferramentas estruturadas, com contratos e schemas;
4. conjunto de avaliações com casos sintéticos e/ou desidentificados;
5. revisão, aprovação, publicação controlada, métricas e reversão.

Atualizações de conteúdo e parâmetros previamente modelados podem ser editoriais.
Novo tipo de dado, integração, fluxo de acesso, cálculo material ou ação automática
continua exigindo código, segurança e Definition Pack.

## 5. Privacidade, isolamento e aprendizado interno

- contexto e recuperação são sempre escopados por organização e finalidade;
- conversas de uma empresa jamais orientam outra empresa;
- chat bruto não é usado como corpus coletivo;
- insights internos usam agregação, desidentificação, supressão de coortes pequenas
  e aprovação humana;
- não há publicação automática de conteúdo, prompt ou metodologia a partir de
  Intelligence;
- custo, uso, qualidade, recusas e escalonamentos são observáveis por capacidade,
  sem expor conteúdo indevidamente.

## 6. Fases de implantação propostas

| Fase | Entrega | Condição de saída |
|---|---|---|
| THR-4.0A | Contrato de intenção, contexto, proveniência e roteamento sem modelo novo | isolamento, auditoria e testes de política aprovados |
| THR-4.0B | Um especialista piloto, apenas leitura/orientação e geração de rascunho | avaliação de qualidade, custo e segurança aprovada |
| THR-4.0C | Ferramentas estruturadas e artefatos exportáveis autorizados | contratos transacionais, revisão e rastreabilidade aprovados |
| THR-4.0D | Sinais governados para Intelligence | agregação, privacidade e revisão humana verificadas |

Nenhuma fase desbloqueia automaticamente a seguinte.

## 7. Fora de escopo

- substituir TutorIA por um conjunto de chats isolados;
- autonomia para aprovar evidência, mudar ciclo, alterar metodologia ou conceder acesso;
- treinamento coletivo a partir de chats identificáveis;
- uso de WhatsApp/Instagram, proatividade externa ou integrações não aprovadas;
- ativar modelos pagos, fornecedores, novos custos ou segredos sem pacote próprio;
- expandir o piloto de produção T1 definido em CP-03.

## 8. Próximo gate

Antes de qualquer BUILD de THR, preparar um Change/Definition Pack de fase única,
com: provedor e custo, categorias de intenção, política de roteamento,
contratos de contexto e tools, retenção/memória, avaliações, critérios de confiança,
escalonamento humano, RLS/auditoria, migrations, testes e plano de reversão.
