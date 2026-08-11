# IMP-2.15A — Implementation Foundation

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11, como parte do Definition Pack RT-2.15.

## Objetivo

Permitir que o owner registre que o Mapa de Papéis e Decisões saiu do rascunho e foi efetivamente colocado em uso na empresa.

## Escopo

- Uma implementação por Missão e organização.
- Estados `draft` e `implemented`.
- Campos: resumo da aplicação (20–1.000 caracteres) e data de aplicação.
- Salvamento de rascunho e confirmação explícita e irreversível.
- Autoria, timestamps e revisão da Ferramenta preservados.

## Fora do escopo

- Tarefas, responsáveis, cronogramas, aprovação de terceiros ou gestão de projetos.
- Evidência, impacto, score, Evolução, anexos e comentários.

## Regras de negócio

1. Exige Missão `available` e Ferramenta válida já salva.
2. Somente owner ativo da organização pode ler, salvar ou confirmar.
3. Confirmar não conclui a Missão nem libera a próxima.
4. Uma implementação confirmada é imutável.
5. A data não pode ser futura nem anterior ao início do ciclo.

## Dados e eventos

- Tabela aditiva `mission_implementations` ligada à Missão e à instância da Ferramenta.
- Eventos auditáveis `implementation_draft_saved` e `implementation_confirmed`.

## UX

Após salvar a Ferramenta, o owner descreve como ela foi aplicada e confirma “Marcar como implementado”. A interface explica que ainda falta registrar Evidência.

## Critérios de aceite

- Rascunho retomável e confirmação explícita funcionam para owner.
- Anônimo, member e outra organização não acessam.
- Payload, datas e transições inválidas são rejeitados no servidor.
- A Missão continua `available` após confirmação.

## Testes necessários

Unidade, componente, integração server-side, RLS/grants, transação, typecheck, lint e build.

## Dependências

TOL-2.13 e migration própria anterior à Evidence Foundation.
