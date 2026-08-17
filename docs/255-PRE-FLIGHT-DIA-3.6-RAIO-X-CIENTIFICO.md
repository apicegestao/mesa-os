# Pre-Flight DIA-3.6 — Raio-X Científico

**Status:** GO FOR BUILD

## Alinhamento

Consulta realizada à conversa-fonte Mesa OS V2, Constitution, Scope Lock,
ADR-028 (definições versionadas), ADR-038 (mapa 4 × 4) e CR-DIA-3.6. A alteração
é uma nova revisão metodológica, não uma edição de resultado ou uma nova feature
fora da Jornada.

## Alterações previstas

- migration aditiva que retira v1 apenas da seleção para novas entradas e publica
  v2 com quatro pilares e 32 perguntas;
- carregamento do diagnóstico preserva a revisão já iniciada/concluída da própria
  organização; organizações sem execução recebem a revisão publicada mais recente;
- interface usa contagem dinâmica, apresenta a escala comportamental e duração
  estimada atualizada;
- testes de preservação de histórico e regras de pontuação.

## Riscos e controles

| Risco | Controle |
|---|---|
| perda de trajetória anterior | v1 é aposentada, não apagada; execuções e snapshots não são alterados |
| alegação excessiva de ciência | documentação diferencia base científica de validação psicométrica futura |
| questionário cansativo | quatro blocos de oito, salvamento e retomada; estimativa transparente |
| quebra de prioridade/ciclo existente | loader prioriza a execução própria já existente |
| exposição de respostas | RLS/RPCs existentes, sem logs de conteúdo |

## Validação prevista

testes de domínio e interface, lint, typecheck, build, aplicação da migration,
consulta de revisão publicada e Security Advisor.
