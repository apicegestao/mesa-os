# Definition Pack — OPS-3.0D: Suporte ao membro e escalonamento humano

**Status:** DRAFT — requer aprovação explícita para BUILD somente em homologação.

## Decisão de produto recuperada

O membro precisa pedir ajuda quando tiver dúvida sobre uma ferramenta, o uso do sistema ou uma situação de gestão. Concierge e Mentor devem poder orientar sem que o membro navegue pela estrutura interna, sem expor conversa bruta do TutorIA e sem transformar o suporte em canal externo não governado.

## Objetivo

Criar um fluxo simples, dentro do Mesa OS, de **pedido de apoio → triagem → responsável → resposta/encerramento**, com uma única conversa de suporte estruturada por solicitação e rastreabilidade mínima.

## Escopo proposto

- membro abre solicitação pela interface flutuante de TutorIA ou por CTA contextual, escolhendo: `ferramenta`, `uso_do_sistema`, `decisão_de_gestão` ou `outro`;
- a solicitação recebe status (`aberta`, `em_triagem`, `em_atendimento`, `aguardando_membro`, `resolvida`, `encerrada`) e prioridade operacional;
- Concierge faz a triagem e atende solicitações de sua carteira; pode encaminhar para Mentor;
- Mentor pode atender solicitações metodológicas dentro do envelope global já aprovado, sem ganhar poderes de alterar registros do membro;
- Admin vê fila e exceções; toda atribuição, mudança de estado e mensagem é auditada;
- membro vê apenas suas próprias solicitações, responsável atual, estado e mensagens daquele atendimento.

## Limites de dados

- mensagem tem limite de tamanho e é tratada como conteúdo de suporte, não como memória do TutorIA;
- nenhuma mensagem é enviada a provedor de IA, e-mail, WhatsApp, Instagram ou outro canal externo;
- nenhum conteúdo de ferramenta, evidência, chat bruto do TutorIA, recibo jurídico, financeiro ou CRM é copiado automaticamente para a solicitação;
- o encaminhamento só referencia o contexto mínimo já permitido: organização, categoria, ciclo atual e próxima ação derivada, quando existirem;
- retenção, exportação e busca ampla de mensagens ficam fora deste bloco.

## RBAC e isolamento

| Papel | Pode fazer | Não pode fazer |
| --- | --- | --- |
| Membro | abrir, responder e acompanhar as próprias solicitações | ver fila, carteira ou solicitação alheia |
| Concierge | triar e atender a carteira atribuída; encaminhar | ver comunidade inteira ou editar metodologia |
| Mentor | atender demanda metodológica no envelope global aprovado | alterar ciclo, Missão, evidência, prioridade ou acesso |
| Admin | supervisionar, atribuir exceções e auditar | publicar metodologia ou acessar memória/chats do TutorIA por este fluxo |

## Fora do escopo

- WhatsApp, e-mail, Instagram, notificações, automação ou SLA automático;
- IA ativa, resumo automático, classificação automática, resposta autônoma ou uso do conteúdo para treinamento;
- chat do TutorIA, memória longitudinal, RAG, anexos, upload, gravação de chamadas ou dados sensíveis;
- alteração de metodologia, ferramenta, ciclo, cobrança, entitlement ou acesso;
- produção.

## Critérios de aceite

1. Uma organização não acessa nem infere solicitações de outra.
2. Concierge sem carteira não acessa a solicitação; Mentor só recebe o envelope autorizado.
3. Toda alteração de responsável e estado possui trilha de auditoria sem duplicar conteúdo.
4. O membro consegue abrir e retomar apoio sem conhecer papéis internos.
5. RLS, grants, validação server-side, testes de isolamento, lint, typecheck, build e Security Advisor passam em homologação.

## Decisão solicitada ao owner

**“Aprovo o Definition Pack OPS-3.0D”** autoriza Change Request, Pre-Flight e BUILD do suporte interno somente em homologação. Não autoriza canais externos, IA sobre mensagens, automação, anexos, dados sensíveis ou produção.
