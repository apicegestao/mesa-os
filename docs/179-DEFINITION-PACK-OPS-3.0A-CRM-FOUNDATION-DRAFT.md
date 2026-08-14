# Definition Pack — OPS-3.0A Fundação de Backoffice e CRM

**Status:** DRAFT R2 — requer aprovação explícita da revisão para BUILD em homologação

## Decisão de fatiamento

O CRM não será construído junto com WhatsApp, Instagram, Mentor, Financeiro, Intelligence e automações. O primeiro bloco cria uma base interna segura e útil para Comercial e Concierge, sem acesso automático a dados metodológicos dos membros e sem canal externo ativo.

Essa fatia reduz risco e custo: valida o modelo de acesso, a auditoria e o núcleo comercial antes de conectar fornecedores, webhooks, mensagens ou dados de acompanhamento.

## Objetivo

Disponibilizar, exclusivamente em homologação, um backoffice segregado com RBAC mínimo e um CRM comercial de leads e oportunidades. A equipe interna poderá registrar e acompanhar relacionamento pré-matrícula, atribuir responsáveis e manter próximas ações auditáveis. Concierge substitui o antigo papel técnico de Operações para matrícula e onboarding controlados. O modelo operacional completo de funções, receita, handoffs e fronteiras está em `docs/181-BACKOFFICE-FINANCE-INTELLIGENCE-OPERATING-MODEL-R2.md` e é parte integrante deste pack.

## Fonte e autoridades

- Constitution: princípios de simplicidade para o membro, TutorIA central porém controlado, menor privilégio e rastreabilidade.
- V2 Scope Lock e ADR-036/037/039.
- Definition Pack 177 e Alignment Check 178.
- IAM-2.29: sessão por código de e-mail, `/ops` segregado, `internal_operator` como base técnica e ausência de acesso global implícito.

## Escopo proposto

### 1. RBAC interno de menor privilégio

O `internal_operator` existente continua sendo somente a porta técnica para `/ops`. Este bloco acrescenta atribuições internas, versionadas e auditáveis, com as seguintes capacidades iniciais:

| Capability | Donos/Admins | Comercial | Concierge | Mentor | TI/Plataforma |
| --- | --- | --- | --- | --- | --- | --- |
| consultar leads sob escopo | sim | carteira atribuída | somente handoff atribuído | não | não |
| criar/editar oportunidades | sim | carteira atribuída | não | não | não |
| registrar atividades e próximas ações | sim | carteira atribuída | onboarding atribuído | não | não |
| atribuir responsável comercial | sim | não | não | não | não |
| aceitar handoff e registrar onboarding | sim | solicita | própria fila atribuída | não | não |
| administrar matrículas existentes | sim | não | conforme handoff aprovado | não | não |
| consultar saúde técnica sem dados de negócio | sim | não | não | não | sim |

Concierge entra neste bloco somente para receber handoff, registrar pendências de onboarding e executar matrícula/revogação previamente autorizadas. Mentor continua como papel reservado, sem tela nem acesso aos dados neste bloco. A carteira de Mentor exige Definition Pack específico de finalidade, envelope de dados, visibilidade, handoff e auditoria. Donos/Admins também não terão acesso irrestrito: cada capability será conferida no servidor e pelo banco, e toda leitura/alteração sensível terá ator e temporalidade.

### 2. CRM comercial canônico

O CRM conterá apenas relações pré-matrícula ou comerciais:

- **Lead:** pessoa/empresa potencial, origem, estado, responsável e dados mínimos de contato.
- **Oportunidade:** etapa, valor opcional, previsão, motivo de ganho/perda e próxima ação.
- **Atividade:** nota comercial, tarefa, ligação/reunião registrada e resultado.
- **Atribuição:** responsável, data, motivo e histórico de transferência.
- **Handoff de onboarding:** checklist comercial aprovado, responsável Concierge, pendências e estado; sem copiar dados metodológicos.

Nenhuma entidade é automaticamente ligada a uma organização Mesa OS, membership, diagnóstico, ciclo, evidência, conversa TutorIA ou contexto longitudinal. A conversão de lead em membro continuará passando pelo fluxo de matrícula controlada existente e por um incremento próprio de handoff comercial.

### 3. Experiência interna inicial

`/ops` evoluirá de ferramenta técnica de matrículas para uma navegação interna enxuta, mas segregada:

- **Comercial:** minha carteira, oportunidades, próximas ações e histórico.
- **Concierge:** fila de handoff, onboarding, pendências e matrículas/revogações previamente autorizadas.
- **Administração:** atribuições de acesso e configurações estritamente previstas.

O fluxo de autenticação permanece e-mail + código, sem senha, convite mágico, login social ou cadastro público. Antes de liberar funções de alto impacto ou dados de membros, haverá um incremento próprio de MFA/SSO e revisão de acesso.

## Dados e segurança propostos

1. Migrations aditivas e versionadas para atribuições internas, leads, oportunidades, atividades e auditoria.
2. RLS deny-by-default; leitura e escrita escopadas ao ator, carteira atribuída e capability ativa.
3. RPCs mutantes com validação server-side, autorização explícita, entradas validadas, idempotência quando aplicável e grants mínimos.
4. Histórico de etapa, atribuição e atividade imutável; correções criam novos fatos auditáveis.
5. Dados de contato minimizados, sem segredo, conteúdo TutorIA, código OTP, credencial ou dado metodológico de membro nos logs.
6. Regras de retenção, exportação e eliminação definidas antes de qualquer uso real em produção.
7. Auditoria registra ator, capability, recurso, ação, data e motivo quando a ação envolver transferência, exclusão lógica ou mudança de etapa.

## Comunicação e integrações: fronteira preservada

Este bloco não cria `Communication Orchestrator`, webhook, template, token, ledger de mensagens ou integração Meta. Ele só deixa o CRM independente desses fornecedores por meio de seus identificadores canônicos e uma linha do tempo de atividades neutra.

WhatsApp Business oficial e Instagram profissional permanecem para o próximo pack, que exigirá consentimento/política por canal, opt-out, verificação de webhook, segredo gerenciado, idempotência, testes de entrega e gate de privacidade.

## Fora do escopo

- WhatsApp, Instagram, e-mail transacional, campanhas, webhooks, automações externas ou mensagens proativas.
- CRM de membros ativos, ligação com ciclo/jornada/ferramentas/evidências, contexto TutorIA ou dados de IA.
- Carteira de mentor, notas de acompanhamento de membro, suporte com impersonação ou acesso global.
- Dashboard executivo, previsão avançada, IA para vendas, importação em massa, checkout e integração financeira.
- Login social, senha, cadastro público, MFA/SSO, nova identidade ou troca da infraestrutura de login.
- Produção, promoção, configuração de segredo ou custo de provedor.

## Critérios de aceite

1. Um Comercial vê e altera somente leads e oportunidades sob sua carteira atribuída.
2. Um Dono/Admin atribui carteira e consulta o necessário, sem atalhos de acesso não auditado.
3. Concierge recebe somente o handoff atribuído e mantém a capability de matrícula/revogação já autorizada, sem ganhar dados metodológicos.
4. Identidades sem capability ativa não conseguem inferir dados ou acessar rotas/RPCs internas.
5. A criação e a evolução de uma oportunidade produzem fatos auditáveis e preservam histórico.
6. Não há dados de membro, TutorIA, ciclo ou evidência nas tabelas, tela, resposta de API ou auditoria comercial.
7. Testes de RLS, autorização, isolamento de carteira, revogação, auditoria, rotas e validação server-side passam; lint, typecheck e build também.
8. Homologação realiza smoke de cada função ativa; produção permanece inalterada.

## Arquivos e áreas previstas para BUILD

- migrations novas para RBAC interno e domínio CRM;
- módulos `internal-access` e `crm`, com contratos de domínio e gateways separados;
- rotas e componentes de `/ops` estritamente necessários;
- políticas RLS, RPCs e testes de segurança/autorização;
- documentação de Pre-Flight, Post-Flight, migrações, auditoria e operação de homologação.

## Riscos e gates

| Risco | Controle antes/durante BUILD |
| --- | --- |
| acesso interno excessivo | capabilities atômicas, RLS, auditoria e smoke de negação |
| mistura de CRM com dados de membros | nenhum vínculo automático; contrato de handoff posterior |
| aumento de superfície de autenticação | reutilizar OTP já validado; sem novos provedores |
| expansão disfarçada para comunicação | proibição de tokens, webhooks e mensagens no diff/review |
| dados comerciais desnecessários | minimização, validação de campos e retenção decidida |

## Decisão solicitada ao owner

**“Aprovo o Definition Pack OPS-3.0A R2”** autoriza um Change Request do Current Scope, Alignment/Pre-Flight e BUILD exclusivamente em homologação. Não autoriza WhatsApp, Instagram, CRM de membros, dados TutorIA, automação, produção ou promoção automática.
