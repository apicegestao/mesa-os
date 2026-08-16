# Post-Flight — OPS-3.0A CRM Kanban por Cliente

**Ambiente:** homologação `pjkfifjcaezspwessaem` somente  
**Produção:** inalterada  
**Data:** 2026-08-14

## Resultado

O CRM interno passou da lista de oportunidades para uma projeção Kanban centrada na conta. Cada empresa possui um cartão de relacionamento; o cartão seleciona a oportunidade ativa mais avançada e informa as negociações adicionais. O painel lateral expõe apenas dados comerciais autorizados: contato, oportunidade, próximas ações, tarefas e atividades recentes.

## Segurança e isolamento

- Nenhuma tabela nova, dado de membro, organização Mesa OS, ciclo, evidência ou TutorIA foi incorporado.
- A migration somente substitui a projeção `get_my_crm_workspace`, mantendo RLS deny-by-default nas tabelas canônicas.
- Verificação no banco: `anon` não pode executar a função; `PUBLIC` não pode executá-la; `authenticated` pode invocá-la, mas a função exige `auth.uid()` e capability/carteira autorizada antes de retornar dados.
- O Security Advisor mantém os alertas previamente documentados para RPCs `SECURITY DEFINER` deliberadamente expostos a `authenticated`. Não surgiu nova classe de alerta. A exceção permanece condicionada à revisão formal em `docs/184-SECURITY-REVIEW-OPS-3.0A-PRIVILEGED-RPCS.md`.

## Validações executadas

- lint: aprovado;
- typecheck: aprovado;
- testes: 42 arquivos, 114 testes aprovados;
- build de produção: aprovado;
- migration `crm_kanban_client_workspace`: aplicada e registrada somente em homologação;
- grants da nova projeção: verificados.

## Gate remanescente

Ainda é necessário o smoke operacional com identidades reais e previamente autorizadas de Admin, Comercial e Concierge. Ele valida a experiência visual, o recorte de carteira e a passagem Comercial → Concierge; não autoriza produção por si só.

## Próximos passos permitidos

1. concluir smoke por papel no ambiente de homologação;
2. registrar o encerramento do OPS-3.0A;
3. abrir o próximo Definition Pack em ordem de roadmap, sem antecipar Financeiro, Intelligence, canais externos ou dados de membros.
