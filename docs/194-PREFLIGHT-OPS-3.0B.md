# Pre-Flight — OPS-3.0B Carteira de Concierge e Mentor

**Ambiente:** homologação `pjkfifjcaezspwessaem` somente

## Autoridades e alinhamento

Constitution 1.1; Construction Protocol 1.2; ADR-002/003/004/033/035/039/040; Operating Model R2; Definition Pack 192; Change Request 193; Current Scope atualizado.

## BUILD previsto

- migration aditiva para papel Mentor, carteiras temporais, auditoria e capabilities mínimas;
- RPCs e rotas server-side com verificação de identidade, capability e escopo por atribuição ativa;
- interface interna para atribuir/revogar carteiras e visualizar somente o envelope aplicável;
- RLS deny-by-default, grants mínimos, testes de isolamento, lint, typecheck, build e Security Advisor.

## Envelope permitido

Concierge: organização atribuída, estado operacional de onboarding e pendências de matrícula. Mentor: organização atribuída, rótulo e período do ciclo ativo, próxima ação derivada e contagens/status aprovados. Ambos: nenhum conteúdo bruto de conversa, memória TutorIA, evidência, anexos, notas privadas, dados financeiros ou dados comerciais.

## Condições de parada

Parar antes de expor dados fora do envelope, alterar uma carteira real sem ação do Admin, criar comunicação externa, ativar IA/Intelligence, modificar metodologia ou promover produção.
