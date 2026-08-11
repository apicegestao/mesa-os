# TOL-2.16B — Ritmo de Gestão da Equipe

**Status:** PROPOSED — BUILD NOT AUTHORIZED

## Objetivo

Permitir que o owner desenhe uma cadência mínima e explícita para acompanhar prioridades, decisões e responsabilidades da equipe.

## Ferramenta

Definição versionada `Ritmo de Gestão da Equipe`, ligada somente à Missão 2 de `Liderança & Equipe`.

Cada um dos 1 a 12 rituais possui seis campos obrigatórios:

1. `ritual_name` — nome, máximo 100 caracteres.
2. `purpose` — propósito, máximo 300.
3. `cadence` — frequência e duração, máximo 80.
4. `participants` — participantes necessários, máximo 300.
5. `agenda` — pauta mínima, máximo 1.000.
6. `expected_output` — decisão ou saída esperada, máximo 500.

## Regras

- Uma instância por Missão, rascunho explícito e retomável.
- Owner-only, schema publicado, RLS e grants mínimos.
- Adicionar, remover e reordenar antes da confirmação de Implementação.
- Após confirmação, a Ferramenta fica somente leitura.
- Salvar não representa Implementação ou Evidência.

## Fora do escopo

Agenda/calendário, convite, notificação, ata, tarefa, integração externa, template por IA ou acompanhamento automático.

## Critérios de aceite

- A UI é renderizada integralmente pelo schema.
- Missão 1 não recebe a nova definição e Missão 2 recebe exatamente uma.
- Payload inválido é rejeitado no servidor.
- Nenhum calendário, tarefa ou evento externo é criado.
