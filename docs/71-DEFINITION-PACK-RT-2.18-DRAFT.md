# Definition Pack — RT-2.18 Experience Recomposition

**Status:** APPROVED FOR BUILD  
**Owner:** Rafael Portela Martins  
**Deploy target:** um deploy consolidado após aprovação, BUILD, CI e revisão

**Aprovação explícita:** “Aprovo o Definition Pack RT-2.18”, registrada pelo owner em 2026-08-11.

## Product outcome

O membro acessa uma experiência compacta, elegante e orientada à próxima ação, reconhece sua jornada e seu ciclo, trabalha a Missão atual em um workspace organizado e entende que TutorIA é o centro de orientação do sistema — sem perder nenhuma funcionalidade ou dado existente e sem receber uma simulação de IA.

## Source Decisions Consulted

- SRC-001 — conversa `Mesa OS V2`, especialmente UX Architecture, Journey Engine, Tools e TutorIA.
- SRC-002 — protótipo visual, usado somente como referência.
- SRC-003 — mapa metodológico 4 × 4.
- ADR-025 — nenhuma linha do legado será copiada.
- ADR-035 — fonte histórica oficial.
- ADR-036 — arquitetura TutorIA-centered.

## Increment 1 — DSX-2.18A Design System & Responsive App Shell

### Scope

- tokens inspirados no protótipo: navy, blue, paper, muted, green, gold e estados semânticos;
- tipografia serif para títulos editoriais e sans para operação;
- sidebar desktop e navegação compacta mobile;
- topbar com organização, contexto e logout;
- primitives reutilizáveis de card, badge, progress bar, button, section e empty state;
- foco visível, contraste, reduced motion e breakpoints responsivos;
- isolamento visual entre login e aplicação autenticada.

### Acceptance

- shell funciona em desktop e mobile sem overflow horizontal;
- navegação por teclado alcança todos os controles;
- nenhuma ação existente muda de contrato;
- sem nova biblioteca visual obrigatória.

## Increment 2 — IAX-2.18B Member Information Architecture & Next Action

### Scope

- dividir a experiência em `Hoje`, `Jornada`, `Diagnóstico` e `Meu sistema de gestão`;
- `Hoje` prioriza uma única Próxima Melhor Ação derivada do estado canônico;
- resumo compacto de ciclo, Missão e últimos marcos existentes;
- progressive disclosure para diagnóstico e respostas detalhadas;
- navegação sem criar novos estados de negócio;
- preservar acesso aos dados atuais sem página monolítica.

### State mapping

| Estado canônico | Próxima ação apresentada |
|---|---|
| diagnóstico em rascunho | continuar Raio-X |
| diagnóstico concluído sem prioridade | revisar e confirmar prioridade, ou aguardar TutorIA no empate |
| prioridade sem ciclo | iniciar ciclo |
| ciclo sem Missões | provisionar Missões conforme regra atual |
| Missão disponível sem Ferramenta salva | construir Ferramenta |
| Ferramenta salva sem Implementação | registrar aplicação real |
| Implementação sem Evidência | registrar evidência |
| Missão concluída | abrir próxima Missão disponível |

### Acceptance

- nenhuma porcentagem nova é persistida ou inventada;
- todos os estados atuais continuam alcançáveis;
- usuário não autorizado continua sem acessar dados do owner;
- URLs e navegação não expõem conteúdo bloqueado.

## Increment 3 — WUX-2.18C Guided Mission and Tool Workspace

### Scope

- substituir a apresentação de caixa de texto extensa por etapas visuais guiadas;
- manter o mesmo schema, payload, validação server-side e server actions;
- agrupar `Entender → Construir → Aplicar → Evidenciar` no workspace;
- mostrar critérios, exemplos e ajuda contextual somente quando existirem em dados aprovados;
- autosave não será introduzido neste train;
- preservar read-only depois da implementação conforme regra atual.

### Acceptance

- payload persistido permanece compatível com TOL-2.13;
- validações de 1–20 entradas e campos obrigatórios permanecem;
- nenhuma evidência ou implementação é perdida na navegação;
- erro, sucesso, loading e read-only são visualmente claros;
- testes existentes continuam passando e novos testes cobrem a recomposição.

## Increment 4 — TPX-2.18D TutorIA Presence & Methodology Projection Foundation

### Scope

- componentes de presença contextual, painel e botão flutuante consistentes com a arquitetura canônica;
- CTAs interativos do TutorIA protegidos por capability flag server-side;
- em produção, nenhum CTA de conversa é exibido enquanto não existir backend de IA autorizado;
- espaço editorial para explicar o papel do TutorIA sem prometer resposta disponível;
- mapa 4 × 4 exibido como `Mapa da metodologia`, não como progresso pessoal;
- células futuras sem status de conclusão e sem números fictícios;
- dados do mapa definidos em estrutura metodológica versionável, nunca espalhados nos componentes;
- nenhum gateway, modelo, prompt, memória ou chamada externa neste train.

### Acceptance

- nenhum texto ou controle faz o usuário acreditar que IA real está ativa;
- feature flag não é controlável pelo cliente;
- mapa diferencia claramente metodologia de jornada individual;
- estrutura está preparada para o TutorIA Foundation Train sem acoplar provedor.

## Architecture and file direction

Proposta, sujeita ao Pre-Flight:

- `src/app/app/layout.tsx` e rotas filhas para o shell autenticado;
- `src/modules/member-experience` para composição de Hoje e navegação;
- `src/modules/design-system` para primitives locais;
- componentes atuais de diagnóstico, prioridade, ciclo, missão, ferramenta e core loop reutilizados ou compostos, não duplicados;
- dados continuam carregados server-side com o mesmo isolamento;
- sem migration por padrão; qualquer necessidade descoberta interrompe o train e exige adendo aprovado.

## Security

- sessão, membership, organização e owner-only permanecem server-side;
- nenhum dado adicional é enviado ao cliente sem necessidade;
- capability flags avaliadas no servidor;
- nenhum secret, SDK de IA ou endpoint externo;
- nenhuma interpolação de HTML do protótipo;
- proteção contra conteúdo bloqueado por rota e carregador, não apenas CSS.

## Accessibility and responsiveness

- WCAG AA como alvo para contraste e interação essencial;
- landmarks, headings e nomes acessíveis coerentes;
- focus order previsível;
- alvos de toque adequados;
- reduced motion respeitado;
- desktop, tablet e mobile cobertos por testes e inspeção visual.

## Test plan

- lint, typecheck, Vitest e build completos;
- regressão dos módulos existentes;
- testes de composição para cada estado da Próxima Melhor Ação;
- testes de navegação owner/member;
- testes de capability flag do TutorIA;
- testes do mapa como metodologia sem progresso inventado;
- inspeção visual local ou preview deploy antes de produção;
- smoke test de login, Raio-X, prioridade, ciclo, Missão, Ferramenta, Implementação e Evidência.

## Explicitly out of scope

- chamadas a modelos de IA;
- seleção de OpenAI, Anthropic ou Google;
- Netlify AI Gateway habilitado;
- chat, streaming, RAG, memória ou prompts;
- tools executadas por IA;
- desempate TutorIA;
- WhatsApp, automações ou notificações;
- novas entidades metodológicas em produção;
- progresso T1–T4, Evolução ou dashboards de negócio;
- alteração do diagnóstico, score, prioridade, ciclo ou regras de transição;
- cópia do HTML legado;
- reescrita destrutiva, mudança de auth ou migration.

## Rollback

- alterações restritas ao frontend e composição;
- nenhum dado novo necessário para rollback;
- branch única e PR revisável;
- revert do merge restaura apresentação anterior sem reverter banco;
- feature flags permanecem desligadas por padrão.

## Follow-up train — TutorIA Foundation

Após homologar a experiência, um Definition Pack separado deverá decidir:

- gateway e modelo suportado;
- orçamento, limites e telemetria;
- contrato de contexto mínimo;
- persistência e retenção das conversas;
- prompt/versionamento e avaliações;
- tool gateway read-only inicial;
- streaming, erros e fallback;
- privacidade, consentimento e incident response.

A orientação do Netlify AI Gateway foi consultada. Nenhum modelo foi escolhido neste pack porque isso exige decisão explícita de custo, qualidade e tratamento de dados.

## Approval gate

Aprovação deste pack autoriza somente o RT-2.18 descrito. Após aprovação, serão produzidos Pre-Flight integrado, branch de release e plano de arquivos final antes da primeira edição de runtime.
