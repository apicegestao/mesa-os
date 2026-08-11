# TutorIA — Canonical Product Architecture

**Fonte:** SRC-001 — Mesa OS V2  
**Status:** CANONICAL PRODUCT DEFINITION  
**Autorização de BUILD:** nenhuma; exige Definition Pack próprio

## Definição

TutorIA é o agente operacional central da metodologia Mesa dos Donos. Ele conduz o membro ao longo da transformação empresarial conectando contexto, metodologia, ferramentas, compromissos, evidências, evolução e acompanhamento humano.

TutorIA não é:

- chatbot genérico;
- página isolada de perguntas e respostas;
- modelo com acesso direto ao banco;
- autoridade irrestrita sobre metodologia ou dados críticos;
- substituto universal de mentor ou concierge.

## Papéis funcionais

1. **Diagnosticador:** investiga respostas e identifica lacunas ou contradições.
2. **Professor:** explica conceitos no contexto da ação atual.
3. **Construtor:** ajuda a produzir ferramentas e artefatos utilizáveis.
4. **Provocador:** questiona raciocínio superficial e centralização do dono.
5. **Acompanhador:** lembra compromissos, identifica estagnação e cobra execução com contexto.
6. **Navegador:** recomenda missão, conteúdo, ferramenta ou próxima ação apropriada.
7. **Escalador:** reconhece baixa confiança, risco ou necessidade de intervenção humana.

## Arquitetura

```text
Knowledge + Context + Memory
             ↓
Reasoning / Orchestration
             ↓
Policy / Guardrails
             ↓
Typed Tool Layer
             ↓
Action Engine
             ↓
Mesa OS | In-app | WhatsApp | Human escalation
```

### Knowledge

Metodologia, versões, pilares, ciclos, missões, ferramentas, conteúdos, playbooks, cases, FAQs e heurísticas autorizadas dos mentores, todos com origem e metadados.

### Context

Pacote mínimo necessário para a ação atual: organização, membro, diagnóstico, prioridade, ciclo, missão, ferramenta, métricas, compromissos e interações pertinentes. A montagem respeita identidade, organização e finalidade.

### Memory

Memória estruturada por perfil, empresa, jornada, decisões e compromissos. Cada item possui fonte, confiança, temporalidade, validade e histórico. Chat bruto não é memória canônica.

### Reasoning / Orchestration

Interpreta objetivo, contexto e metodologia; escolhe estratégia, pergunta, conhecimento ou tool apropriada. O modelo de linguagem é substituível e não representa sozinho o produto TutorIA.

### Policy / Guardrails

Verifica permissão, risco, confiança, consentimento, canal, frequência, dados sensíveis, ação crítica e necessidade de confirmação ou escalonamento.

### Typed Tool Layer

Contratos específicos de leitura e ação. Não existe acesso arbitrário ao banco. Toda tool recebe contexto autorizado, valida entrada, aplica regras de domínio e produz resultado auditável.

### Action Engine

Executa somente capacidades autorizadas: preparar rascunho, registrar ação confirmada, agendar acompanhamento, iniciar comunicação permitida, criar intervenção ou encaminhar caso humano.

## Presença na experiência

- **Contextual:** insight ou CTA junto da missão, diagnóstico, evidência ou ferramenta.
- **Painel:** execução conjunta sem abandonar o workspace atual.
- **Workspace completo:** decisões, revisão, exploração, histórico e compromissos.
- **Proativa:** iniciativa originada por evento ou tempo, mediada pelo Automation Engine.

## Modelo de autonomia

Autonomia é determinada por política e capacidade, não por uma lista genérica de “IA pode/não pode”. Cada ação declara:

- ator e organização;
- dados necessários;
- risco;
- nível mínimo de confiança;
- necessidade de confirmação;
- possibilidade de reversão;
- auditoria;
- fallback e escalonamento.

Uma ação de baixo risco pode ser autônoma. Uma ação crítica pode exigir confirmação, revisão ou ator humano conforme a decisão já aprovada para aquele domínio.

## Proatividade e WhatsApp

TutorIA não dispara mensagens diretamente. Eventos e Scheduler alimentam o Automation Engine; o Communication Orchestrator avalia prioridade, consentimento, canal, cooldown, frequency cap, mensagens concorrentes e escalonamento. O WhatsApp usa somente integração oficial.

## Ferramentas TutorIA-native

TutorIA conduz perguntas, transforma respostas em estrutura, identifica lacunas, sugere melhorias e prepara o artefato. O sistema renderiza e versiona dados; a conversa não é o único repositório do resultado.

## Observabilidade e auditoria

Devem ser registráveis, respeitando privacidade:

- contexto e versão da política utilizados;
- modelo/rota e versão de prompt quando aplicável;
- tools solicitadas e executadas;
- decisões, confiança e escalonamentos;
- confirmações do usuário;
- custo, latência, falhas e fallback;
- avaliação de qualidade e incidentes.

## Sequenciamento mínimo

1. contratos de contexto, permissão, auditoria e tool gateway;
2. TutorIA contextual de leitura e orientação;
3. condução assistida de missão e ferramenta;
4. memória e compromissos estruturados;
5. Automation Engine e proatividade in-app;
6. Communication Orchestrator e WhatsApp oficial;
7. criação assistida de ferramentas e capacidades avançadas.

Este sequenciamento reduz risco técnico, mas TutorIA permanece central desde a primeira experiência em que for introduzido.
