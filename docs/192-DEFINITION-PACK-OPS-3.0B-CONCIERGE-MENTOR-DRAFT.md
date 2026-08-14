# Definition Pack — OPS-3.0B Carteira de Concierge e Mentor

**Status:** APPROVED — owner aprovou BUILD em homologação em 2026-08-14

## Objetivo

Disponibilizar uma carteira interna de acompanhamento para Concierge e Mentor, com cada pessoa vendo somente os membros que lhe foram atribuídos e apenas o envelope mínimo necessário para sua finalidade.

## Autoridades consultadas

- Constitution: menor privilégio, TutorIA não acessa banco diretamente, rastreabilidade;
- ADR-036 e ADR-039: contexto isolado por organização/finalidade e ausência de acesso global implícito;
- Operating Model R2: Concierge recebe onboarding e pendências; Mentor apoia somente carteira atribuída;
- Current Scope: Mentor e dados metodológicos permanecem não autorizados para BUILD.

## Escopo proposto

- novo papel interno **Mentor** e atribuições temporais/auditáveis de carteira;
- Concierge vê handoff, estado de onboarding, pendências e elegibilidade mínima;
- Mentor vê identidade organizacional, ciclo atual, próxima ação derivada, pedido de apoio e marcos aprovados estritamente necessários;
- Admin atribui/revoga carteira, com motivo e data;
- histórico de encaminhamentos e escalonamentos, sem conteúdo bruto de conversa;
- rotas, RLS/RPCs e interface interna por capability, exclusivamente em homologação.

## Envelope explícito de dados

| Dado | Concierge | Mentor | Proibido |
| --- | --- | --- | --- |
| organização e contato operacional | onboarding atribuído | carteira atribuída, quando necessário | acesso global |
| handoff e pendências | sim | somente encaminhamento pertinente | dados comerciais desnecessários |
| ciclo/próxima ação derivados | não por padrão | sim, carteira atribuída | histórico bruto irrestrito |
| evidência aprovada/marco | somente status de onboarding | somente resumo aprovado e finalidade definida | anexos, notas privadas ou conteúdo bruto |
| conversa TutorIA/memória | não | não | sempre proibido neste bloco |

## Fora do escopo

- acesso global de Mentor/Concierge;
- chat bruto, memórias, TutorIA, IA para recomendação ou decisão de evolução;
- alteração de metodologia, ciclo, Missão, evidência, prioridade ou acesso do membro pelo Mentor;
- WhatsApp, e-mail, Instagram, automação, comunicação externa, Financeiro/checkout, Intelligence ou produção.

## Critérios de aceite

1. Sem atribuição ativa, Mentor e Concierge não inferem dados de membros.
2. Cada leitura e alteração é escopada por carteira e registrada em auditoria.
3. O painel não apresenta conversa, memória TutorIA, conteúdo bruto ou dados financeiros.
4. Revogação remove acesso imediatamente nas leituras futuras.
5. RLS, grants, autorização server-side, testes de isolamento, lint, typecheck e build passam.

## Decisão solicitada ao owner

**“Aprovo o Definition Pack OPS-3.0B”** autoriza Change Request, Pre-Flight e BUILD somente em homologação. Não autoriza acesso global, chat, IA, comunicação externa, Financeiro adicional, Intelligence ou produção.
