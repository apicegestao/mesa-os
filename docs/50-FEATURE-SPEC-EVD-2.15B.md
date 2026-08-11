# EVD-2.15B — Evidence Foundation

**Status:** PROPOSED — BUILD NOT AUTHORIZED

## Objetivo

Registrar uma evidência operacional legítima de que a implementação foi usada, sem confundir relato verificável com impacto ou Evolução.

## Escopo

- Uma evidência submetida por Missão neste primeiro fluxo.
- Tipos controlados: `decision_example`, `operational_record`, `meeting_routine` ou `observed_result`.
- Campos: tipo, descrição factual (20–1.000 caracteres) e data da ocorrência.
- Submissão explícita, imutável e auditável.

## Fora do escopo

- Upload, link externo, comentários, aprovação humana, IA, score e medição de impacto.
- Edição ou exclusão após submissão.

## Regras de negócio

1. Exige implementação `implemented` da mesma Missão e organização.
2. A ocorrência não pode ser futura nem anterior à data de implementação.
3. Somente owner ativo submete e lê.
4. Evidência é declaração operacional rastreável; não prova Evolução por si só.
5. A submissão integra a transição atômica definida em MTR-2.15C.

## Dados e eventos

- Tabela aditiva `mission_evidence` ligada à Missão e à implementação.
- Evento auditável `mission_evidence_submitted`.

## UX

O owner escolhe o tipo, descreve o fato observado e informa quando ocorreu. Antes da confirmação, a interface informa que a ação concluirá a Missão e liberará a próxima.

## Critérios de aceite

- Evidência válida é persistida uma única vez e não pode ser alterada.
- Tipos, limites, datas, owner e organização são validados no servidor.
- Nenhum arquivo ou URL é aceito neste incremento.
- Nenhum score, impacto ou Evolução é criado.

## Testes necessários

Unidade, componente, integração server-side, RLS/grants, rollback e casos de payload/data inválidos.

## Dependências

IMP-2.15A e MTR-2.15C.
