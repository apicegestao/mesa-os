# MTR-2.15C — Mission Transition

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11, como parte do Definition Pack RT-2.15.

## Objetivo

Concluir a Missão disponível e liberar exatamente a próxima Missão após implementação e evidência legítimas.

## Escopo

- Acrescentar estado `completed` às Missões.
- Função server-side transacional para submeter evidência, concluir a Missão atual e liberar a próxima por posição.
- Preservar no máximo uma Missão `available` por ciclo.
- Registrar ator e horário da conclusão.

## Fora do escopo

- Pular, reordenar, reabrir, cancelar, substituir ou concluir manualmente.
- Encerrar ciclo ou avançar Evolução.
- Criar Ferramenta para a Missão 2.

## Regras de negócio

1. Somente a Missão `available` pode avançar.
2. Exige Ferramenta salva, Implementação `implemented` e Evidência válida no mesmo contexto.
3. A próxima Missão é a `locked` de menor posição superior; não existe escolha humana.
4. Evidência, conclusão e desbloqueio são atômicos e idempotentes.
5. Falha em qualquer validação reverte tudo.
6. Após o prazo do ciclo, a transição continua permitida enquanto o ciclo estiver `active`.

## Dados e eventos

- Alteração aditiva do constraint de status e colunas `completed_at`, `completed_by`.
- Evento auditável `mission_completed`; a liberação seguinte é derivável pela mudança de estado.

## UX

Após confirmação da evidência, a interface mostra a Missão concluída e apresenta a Missão 2 como nova próxima ação, sem revelar conteúdo das demais bloqueadas.

## Critérios de aceite

- Duplo envio não cria evidência duplicada nem duas Missões disponíveis.
- Transição inválida faz rollback integral.
- A primeira Missão termina `completed`; a segunda passa de `locked` para `available`; a terceira permanece `locked`.
- Ciclo, prioridade e diagnóstico não são alterados.

## Testes necessários

pgTAP, concorrência/idempotência, RLS/grants, rollback, integração e regressão completa.

## Dependências

IMP-2.15A e EVD-2.15B; migration separada e ordenada.
