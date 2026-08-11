# Source Recovery — Mesa OS V2

**Incremento:** GOV-2.16R  
**Status:** COMPLETE — DOMAIN RECOVERY CONTINUES BY RELEASE  
**Natureza:** recuperação documental; não autoriza BUILD  
**Fonte principal:** conversa `Mesa OS V2`, id `6a7671ee-20b0-83e9-ba40-12c7b311f0b7`

## Objetivo

Recuperar as decisões de produto, metodologia, UX, TutorIA, automações, WhatsApp, segurança e arquitetura que foram aprovadas na conversa fonte, mas chegaram ao Governance Pack de forma resumida ou incompleta.

Este trabalho não redesenha o sistema. Ele restaura rastreabilidade.

## Constatação

O Governance Pack atual preserva corretamente que:

- TutorIA é agente de transformação, não chatbot genérico;
- TutorIA não acessa o banco diretamente;
- IA não possui autorização implícita para regras críticas;
- WhatsApp somente poderá usar API oficial;
- contexto, segurança e auditoria são obrigatórios.

Entretanto, não preserva suficientemente a arquitetura funcional e experiencial já aprovada para TutorIA, automações, canais, memória, ferramentas e jornada.

## Decisões já recuperadas

### Papel central do TutorIA

- TutorIA é agente de transformação e parte central da condução do membro.
- Não se limita a responder perguntas: diagnostica, ensina, provoca, acompanha, navega e escala quando necessário.
- Deve saber a próxima missão, ferramenta ou conteúdo relevante ao contexto.
- Deve acompanhar compromissos e agir proativamente quando a jornada estagnar.
- Deve reconhecer situações em que uma decisão precisa de concierge ou mentor.

### Arquitetura cognitiva

Arquitetura aprovada na fonte:

`Contexto + Conhecimento + Memória → Reasoning → Policy/Guardrails → Tool Layer → Action Engine → Chat/WhatsApp/Mesa OS`.

- Contexto representa o que importa agora.
- Memória registra conhecimento longitudinal estruturado do membro, empresa, jornada, decisões e compromissos.
- Conhecimento representa a metodologia e as heurísticas da Mesa e dos mentores.
- Histórico de chat não é tratado como memória por si só.
- Memórias possuem fonte, confiança, temporalidade e possibilidade de atualização ou invalidação.
- O Member Context Engine entrega somente os dados necessários e autorizados para a ação corrente.

### Presença na experiência

Foram definidos três níveis complementares:

1. orientação contextual dentro da tela;
2. painel lateral no desktop ou drawer no mobile;
3. workspace completo para conversas e decisões mais profundas.

Entradas rápidas previstas incluem:

- ajudar na missão atual;
- revisar uma ferramenta;
- apoiar uma decisão;
- explicar evolução;
- acompanhar compromissos.

### Ferramentas

- Ferramentas são workspaces estruturados e versionados, não simples downloads ou formulários livres.
- TutorIA orienta o preenchimento, encontra lacunas e inconsistências e ajuda a transformar respostas em artefatos de gestão.
- Ferramenta salva não equivale a implementação, transformação ou impacto.
- Tool Layer executa capacidades autorizadas; TutorIA não recebe acesso genérico ao banco.
- Ferramentas nativas podem exportar artefatos utilizáveis em PDF, XLSX, CSV ou outros formatos adequados.
- Tool Instances preservam dados estruturados que podem alimentar métricas, diagnósticos, evidências e evolução.
- Outputs semanticamente declarados permitem que TutorIA cruze diferentes fontes, como Raio-X, SWOT, RACI e DRE.

### Metodologia programável e AI Tool Factory

- O Tool Schema Engine interpreta definições e renderiza ferramentas sem uma página programada para cada instrumento.
- A equipe poderá criar ferramentas em linguagem natural com auxílio do TutorIA.
- O fluxo aprovado é `Ideia → desenho assistido → schema → preview → testes → revisão metodológica → publicação`.
- TutorIA pode criar e propor, mas não publica diretamente na metodologia oficial.
- Definições publicadas são versionadas e não são sobrescritas silenciosamente.
- Cada ferramenta pode declarar objetivo, instruções, perguntas, regras, fórmulas, outputs, métricas, evidências, exportações e comportamento contextual do TutorIA.
- No-code Tool Builder e AI Tool Builder são capacidades complementares.
- O sistema deve permitir converter ativos existentes em candidatos a ferramentas nativas sem publicação automática.
- Uso, conclusão, abandono, dificuldade e relação com evolução poderão alimentar analytics metodológico.

### Jornada e proatividade

- Journey Engine conecta diagnóstico, prioridades, ciclos, missões, ferramentas, conteúdos, evidências, métricas e TutorIA.
- A home e as telas principais são orientadas à Próxima Melhor Ação.
- Estagnação, atraso, bloqueio e mudança de risco podem iniciar análise e intervenção.
- A jornada é adaptável e não deve ser apresentada como biblioteca de aulas.

### Automation Engine

- A arquitetura é orientada a eventos e também possui Scheduler.
- Eventos passam por regras, contexto, elegibilidade, escolha de ator, canal e medição do resultado.
- Uma automação pode resultar em TutorIA, mensagem in-app, WhatsApp, e-mail, tarefa para concierge, intervenção, alerta, atualização de score ou nenhuma ação.
- Inatividade não implica automaticamente envio de mensagem; contexto e histórico determinam a abordagem.
- Regras possuem trigger, condições, ação, canal, cooldown, escalonamento e versão.

### WhatsApp e comunicação

- Somente infraestrutura oficial Meta/WhatsApp é aceita.
- A comunicação é bidirecional por gateway e webhooks controlados.
- Opt-in, origem e data do consentimento e opt-out são rastreáveis.
- O Communication Orchestrator coordena canais e evita mensagens concorrentes ou excessivas.
- Mensagens possuem prioridade e frequency cap.
- Templates oficiais são administrados e versionados quando exigidos pelo canal.
- Cooldown, consolidação de assuntos e escalonamento humano integram a regra de comunicação.

### Segurança e governança

- Toda ação relevante exige identidade, permissão, escopo, auditoria e possibilidade de investigação.
- Isolamento por organização também se aplica ao contexto e às tools do TutorIA.
- Não existe tool genérica de leitura arbitrária do banco.
- Consentimentos incluem, entre outros, comunicação por WhatsApp e processamento por IA.
- Ações destrutivas ou críticas possuem barreiras, justificativa, versionamento ou aprovação conforme o risco.

### Perfis e escalonamento

- TutorIA possui permissões próprias como ator do sistema, sem equivaler a usuário humano.
- Membro, concierge, operação, mentor/admin, super admin e TI possuem experiências e escopos distintos.
- Concierge acompanha e intervém operacionalmente, mas não altera metodologia ou jornada unilateralmente.
- TutorIA encaminha casos de baixa confiança, risco ou natureza inadequada para decisão humana.
- A decisão sobre quem pode executar cada ação pertence à camada de autorização, não à interface ou ao modelo de IA.

### Evolução por releases

- V2.0 foi definida para provar a cadeia completa com TutorIA útil e contextual, sem exigir autonomia avançada.
- V2.1 foi associada a memória mais profunda, revisão de ferramentas, proatividade, WhatsApp e escala operacional.
- V2.2 foi associada à metodologia programável, builders e AI Tool Factory.
- V2.3 foi associada a inteligência proprietária, benchmarks, predição e autonomia mais avançada.
- A alocação por release organiza dependências; não reduz a centralidade permanente do TutorIA no produto.

## Referências complementares recebidas

- Protótipo `mesa-dos-donos-ultima-versao(1).html`: referência de UX e linguagem visual; não é base de código.
- Mapa de desenvolvimento: quatro pilares distribuídos em T1 Fundamentos, T2 Controle, T3 Previsibilidade e T4 Autonomia.

## Lacunas já identificadas no Governance Pack

- centralidade do TutorIA aparece de forma insuficiente no Blueprint e na UX Architecture;
- arquitetura cognitiva, memória, contexto, tools e Action Engine não estão documentados;
- Event-Driven Journey, Automation Engine e Communication Orchestrator não estão documentados;
- presença contextual do TutorIA e integração com ferramentas não estão documentadas;
- metodologia longitudinal de quatro pilares por quatro trimestres ainda não está reconciliada;
- backlog e roadmap atuais não representam a profundidade da visão aprovada;
- proibições de sprint foram repetidas de forma que podem ser confundidas com decisões permanentes de produto.

## Regra de reconciliação

Cada decisão recuperada receberá:

1. fonte e contexto;
2. formulação canônica;
3. documento de destino;
4. dependências técnicas e metodológicas;
5. release alvo;
6. critérios de segurança;
7. status `RECOVERED`, `CONFLICT`, `SUPERSEDED` ou `NEEDS CONFIRMATION`.

Nenhum item `RECOVERED` autoriza implementação automaticamente.

## Próximos artefatos do GOV-2.16R

1. inventário mestre das decisões da conversa fonte;
2. matriz de reconciliação e cobertura;
3. Change Request para Constituição, Blueprint, Scope, ADRs e UX Architecture;
4. arquitetura canônica do TutorIA;
5. arquitetura canônica de automações e comunicação;
6. reconciliação da metodologia 4 × 4 com ciclos, missões e IME;
7. mapa de releases atualizado;
8. Post-Flight documental, sem deploy.
