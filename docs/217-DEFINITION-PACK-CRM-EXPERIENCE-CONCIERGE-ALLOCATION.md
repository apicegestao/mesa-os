# Definition Pack — CRM Experience & Concierge Allocation

**Status:** APPROVED — owner autorizou BUILD em homologação em 2026-08-14.

## Objetivo

Transformar o CRM em uma experiência Kanban limpa, com um card por empresa, detalhe progressivo e fluxo explícito de conversão. Automatizar a distribuição de onboarding para Concierge sem exceder a capacidade configurada individualmente.

## Escopo

- tela CRM: título, botão de nova oportunidade e Kanban como superfície principal;
- detalhe por empresa mantém oportunidades, contatos, tarefas e histórico sem poluir o quadro;
- card informativo do fluxo comercial Mesa dos Donos abaixo do Kanban;
- card de Intelligence comercial com métricas agregadas, gargalos, oportunidades e matriz SWOT determinística, contendo fonte, período, coorte, limitações e confiança;
- capacidade de Concierge configurável por Admin, padrão 100 membros ativos;
- ao pagamento confirmado e acesso preparado, alocação escolhe Concierge elegível de menor ocupação; empate é decidido por menor carga recente e, por fim, UUID estável;
- sem vaga, o membro permanece em fila operacional auditável; Admin pode reatribuir ou alterar capacidade.

## Regras e limites

- apenas Admin edita capacidade; Concierge não se autoatribui fora da carteira;
- distribuição automática não altera acesso, entitlement, pagamento, metodologia, ciclo ou dados do membro;
- Intelligence não usa mensagens, TutorIA, dados de pagamento, conteúdo bruto ou dados identificáveis; não chama modelo e não executa mudanças;
- canais externos, IA ativa, WhatsApp, Instagram, e-mail, exportação e produção continuam fora do escopo.

## Critérios de aceite

1. Kanban é a primeira e principal superfície de CRM.
2. Nenhuma capacidade configurada é excedida por alocação automática.
3. O algoritmo é determinístico, auditável e seguro contra concorrência.
4. Sem Concierge disponível, não existe atribuição silenciosa.
5. Intelligence comercial permanece agregada, honesta sobre dados insuficientes e sem recomendação individual.
6. RLS, migrations, testes, lint, typecheck, build e Security Advisor passam em homologação.
