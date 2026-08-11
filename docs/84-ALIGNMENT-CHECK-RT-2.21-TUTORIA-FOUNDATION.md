# Alignment Check — RT-2.21 TutorIA Foundation

**Status:** PASS — Definition Pack aprovado pelo owner em 2026-08-11.

## Alinhamento com a visão do produto

TutorIA é o centro operacional da Mesa dos Donos, não um chatbot periférico. A primeira entrega precisa, portanto, estabelecer os seus limites reais: contexto correto, isolamento organizacional, ferramentas tipadas, política de ação e auditoria. Ativar um modelo antes dessa fundação contrariaria a arquitetura canônica e comprometeria a confiança do membro.

## Continuidade metodológica

- O RT-2.20 já disponibiliza as fontes versionadas necessárias: metodologia 4 × 4, ciclos, episódios diagnósticos, métricas e histórico de evidências.
- O RT-2.21 não define conteúdo, não cria missões e não infere evolução; consome somente registros canônicos quando a política permitir.
- A presença visual do TutorIA continua coerente com o app shell aprovado, mas não apresenta inteligência fictícia durante este incremento.

## Riscos tratados

| Risco | Controle proposto |
| --- | --- |
| Vazamento entre organizações | contexto server-side, RLS, vínculo canônico e testes de negação |
| Ação de IA sem autorização | catálogo allow-list, policy engine e `deny`/`escalate` explícitos |
| Auditoria insuficiente | eventos estruturados sem conteúdo sensível ou segredos |
| Promessas de IA não implementada | CTA honesta, sem chat, texto gerado ou validação simulada |
| Acoplamento a fornecedor | nenhum modelo, SDK, credencial ou provedor neste train |

## Pre-Flight necessário após aprovação

- branch Supabase isolado e sem cópia de dados reais;
- desenho de schema, RLS/grants e migrações versionadas;
- matriz de contexto permitido por finalidade;
- contratos de tools, políticas e eventos de auditoria;
- testes de isolamento, negação, ausência honesta e regressão do fluxo atual;
- revisão de advisor, preview isolado e Post-Flight.

## Resultado

O RT-2.21 é a próxima etapa segura para tornar o TutorIA estruturalmente presente no sistema. Ele não autoriza IA ativa nem canais externos. O BUILD pode começar somente conforme o Definition Pack aprovado em `docs/83-DEFINITION-PACK-RT-2.21-TUTORIA-FOUNDATION-DRAFT.md`.
