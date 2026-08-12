# ADR / Decision Log

## ADR-001 — Modular Monolith

**Status:** FROZEN  
O sistema começa como monólito modular. Distribuição prematura não é autorizada.

## ADR-002 — Next.js, TypeScript e PostgreSQL

**Status:** FROZEN  
Next.js/React + TypeScript strict e PostgreSQL/Supabase formam a base técnica.

## ADR-003 — Ambientes separados

**Status:** FROZEN  
Development, staging e production têm configuração e credenciais próprias.

## ADR-004 — Schema e segurança

**Status:** ACCEPTED  
Alterações de banco usam migrations versionadas. Schemas expostos exigem grants explícitos e RLS por tabela. Secret/service-role keys nunca vão para clientes ou Git.

## ADR-025 — Legacy Abandonment

**Status:** FROZEN  
O código da tentativa anterior foi rejeitado como base de produção por problemas de qualidade, UX, funcionalidade e confiabilidade. O Mesa OS V2 será reconstruído do zero sob o Governance Pack. Nenhuma linha do legado será copiada.

## ADR-026 — Supabase modern key model

**Status:** ACCEPTED  
O frontend usa somente publishable key. Chaves secret/service-role ficam exclusivamente em runtime server-side quando houver necessidade autorizada.

## ADR-027 — IAM initial access model

**Status:** ACCEPTED

- Autenticação inicial por magic link via Supabase Auth e sessão SSR/PKCE.
- Entrada somente por convite; cadastro público não é autorizado.
- Papéis iniciais: `owner` e `member`; somente `owner` administra acessos.
- Uma identidade pertence a no máximo uma organização no primeiro release.
- A primeira organização e seu primeiro vínculo `owner` são provisionados administrativamente.
- Convites expiram em 72 horas.
- Staging exige projeto Supabase separado antes de homologação persistente.

## ADR-028 — Diagnostic definitions are versioned data

**Status:** ACCEPTED

- Perguntas, opções, ordem, pesos, fórmulas interpretáveis e textos do diagnóstico são dados versionados, não constantes de interface.
- Uma execução concluída preserva a revisão metodológica utilizada e não pode ser sobrescrita.
- O primeiro release implementa somente `Mês 0`; reaplicação e evolução longitudinal exigem incremento próprio.
- A primeira definição é provisionada por seed idempotente e versionado, sem interface administrativa.

## ADR-029 — Priority tie handling

**Status:** ACCEPTED

- Sem empate no menor score, o owner confirma a prioridade com justificativa curta.
- Em empate no menor score, nenhuma escolha humana é aceita; o estado permanece aguardando futuro desempate TutorIA.
- TutorIA não será improvisado no PRI-2.7, não acessará o banco diretamente e exigirá Feature Spec própria antes de decidir.
- Confirmar prioridade não cria Ciclo, Missão, prazo, meta ou plano de ação.

## ADR-030 — First cycle lifecycle

**Status:** ACCEPTED

- O primeiro ciclo começa imediatamente após comando explícito do owner e dura 90 dias corridos.
- Título e data final são derivados da prioridade e da data inicial; não são editáveis neste incremento.
- Existe no máximo um ciclo por organização e por prioridade.
- O ciclo permanece ativo após a data final até que um incremento futuro defina a transição de estado.
- Ciclo não cria Missões, metas, tarefas, ferramentas ou progresso.

## ADR-031 — Initial mission methodology and lifecycle

**Status:** ACCEPTED

- Missões são dados metodológicos versionados e suas instâncias preservam um snapshot imutável.
- A revisão inicial atende somente `Liderança & Equipe` com três Missões ordenadas: clareza de papéis, ritmo de gestão e delegação responsável.
- Somente a primeira Missão nasce `available`; as demais nascem `locked`.
- Existe no máximo uma Missão disponível por ciclo.
- Não há conclusão, desbloqueio, edição, reordenação ou substituição neste incremento.
- Missão não antecipa Ferramenta, Implementação, Evidência, Evolução ou TutorIA.

## ADR-032 — Structured tool definitions and drafts

**Status:** ACCEPTED

- Ferramentas são definições metodológicas versionadas com schema publicado, nunca campos codificados diretamente na interface.
- A primeira Ferramenta é o `Mapa de Papéis e Decisões`, vinculada somente à primeira Missão de `Liderança & Equipe`.
- Existe no máximo um rascunho por Missão; o payload é validado integralmente no servidor.
- O rascunho contém de 1 a 20 entradas e permanece editável após a data final do ciclo.
- Salvar não submete, aprova, conclui ou desbloqueia Missão e não representa Implementação, Evidência ou Evolução.

## ADR-033 — Cloud-first secure release trains

**Status:** ACCEPTED

- Incrementos consecutivos podem ser definidos e aprovados em lote quando compõem uma entrega vertical coerente.
- Governança, migrations, RLS, testes e rastreabilidade continuam obrigatórios por incremento.
- Desenvolvimento ocorre em branch e chega à produção por um único merge em `main` após CI completo.
- Produção recebe um deploy por Release Train; alterações exclusivamente documentais são ignoradas pelo build do Netlify.
- Nenhuma instalação local no computador do owner é exigida; GitHub, CI, Netlify e Supabase são os planos de controle em nuvem.
- Proteção administrativa de `main` e imposição Git-only devem ser ativadas nas plataformas quando seus conectores expuserem essa configuração ou pelo painel do owner.

## ADR-034 — Implementation, evidence and mission transition

**Status:** ACCEPTED

- Ferramenta salva é preparação; Implementação exige confirmação explícita de uso real.
- Evidência é um registro operacional factual, imutável e distinto de impacto ou Evolução.
- A Missão somente conclui quando Ferramenta, Implementação e Evidência válidas coexistem.
- Evidência, conclusão da Missão e desbloqueio da próxima ocorrem em uma transação server-side.
- A próxima Missão é determinada pela posição metodológica, sem escolha, pulo ou reordenação.
- Estado e próxima ação do core loop são derivados dos registros canônicos, sem percentual duplicado.

## ADR-035 — Approved product source baseline

**Status:** ACCEPTED

- A conversa `Mesa OS V2`, id `6a7671ee-20b0-83e9-ba40-12c7b311f0b7`, é a baseline histórica oficial da visão e das decisões aprovadas do produto.
- O repositório permanece como contrato operacional para BUILD; a conversa fonte não substitui Feature Spec, testes ou Current Scope.
- Omissões documentais exigem recuperação e reconciliação, não descarte silencioso.
- Toda definição de domínio deve indicar quais decisões fonte foram consultadas.

## ADR-036 — TutorIA-centered product architecture

**Status:** ACCEPTED

- TutorIA é o agente operacional central da metodologia e da experiência, não um módulo periférico de chat.
- Sua arquitetura separa contexto, memória, conhecimento, raciocínio, políticas, tools e ações.
- TutorIA não acessa o banco diretamente; ações passam por contratos autorizados, validação, escopo e auditoria.
- Autonomia é graduada por risco, confiança e política, com escalonamento humano quando previsto.
- A experiência possui presença contextual, painel acoplado ao trabalho e workspace completo.

## ADR-037 — Event-driven communication and official WhatsApp

**Status:** ACCEPTED

- Proatividade nasce de eventos e Scheduler, não de disparos isolados implementados nas telas.
- Automation Engine avalia contexto, regras, ator, canal, cooldown, escalonamento e resultado.
- Communication Orchestrator coordena prioridades, frequência e consolidação de mensagens.
- WhatsApp usa apenas API oficial, gateway controlado, webhooks, consentimento e opt-out rastreáveis.

## ADR-038 — Development Map as methodological backbone

**Status:** ACCEPTED

- O Mapa de Desenvolvimento 4 × 4 é a espinha dorsal metodológica versionada da Jornada, não uma constante visual.
- Seus quatro pilares e quatro estágios organizam Raio-X, ciclos, conteúdos, treinamentos, Missões, Ferramentas, Evidências, métricas e o contexto metodológico inicial do TutorIA.
- Prioridade do ciclo, outcome ativo e outcomes de apoio permanecem conceitos distintos; o mapa não vira uma grade rígida de consumo de conteúdo.
- Toda ligação entre um recurso e o mapa é versionada e rastreável; conteúdo ou ferramenta não aprovados não serão inventados pela implementação.
- Execuções diagnósticas anteriores preservam integralmente sua revisão. Mudanças de taxonomia exigem mapa explícito de compatibilidade e nunca reescrevem scores históricos.
- TutorIA recebe contexto metodológico por contratos de leitura; autonomia, raciocínio e ações continuam sujeitos a incrementos próprios.

## ADR-039 — TutorIA context isolation and governed learning

**Status:** ACCEPTED

- TutorIA conhece profundamente a metodologia e o contexto autorizado da própria organização, sem acesso arbitrário ao banco.
- Toda memória, recuperação e tool call operacional é escopada por organização, finalidade e identidade autorizada; informações de um membro ou empresa não transitam para outro membro ou empresa.
- Chat bruto não constitui memória canônica. Memórias estruturadas preservam fonte, confiança, validade, escopo e histórico de correção.
- Qualquer aprendizado coletivo exige agregação, desidentificação e aprovação explícita de governança; conteúdo bruto de clientes não é reutilizado como base de outra organização.
- Proatividade e autonomia permanecem mediadas por política, consentimento, risco, confiança, canal e auditoria.

## ADR-040 — Governed delivery checkpoints

**Status:** ACCEPTED

- Todo incremento material passa por checkpoint registrado antes do BUILD, promoção ou decisão de escopo.
- O checkpoint reconcilia a conversa fonte `Mesa OS V2` com Constitution, Scope, ADRs, Definition Pack e estado real do repositório.
- Checkpoints de execução não criam aprovações artificiais; decisões de escopo, risco, custo ou promoção continuam exigindo autorização explícita do owner.
- Conflito, lacuna material, decisão `FROZEN` ou risco de isolamento interrompem o BUILD para reconciliação documentada.
