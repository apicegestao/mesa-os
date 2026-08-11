# Mesa OS V2 — Scope Lock

## Direção aprovada para a release

O V2 estabelece o núcleo operacional do Mesa OS. A aprovação de uma capacidade para a release não a autoriza no sprint atual.

A baseline funcional completa da visão V2 está na conversa fonte `Mesa OS V2`. O Source Register e a matriz de reconciliação preservam essa origem; o Current Scope continua sendo o único autorizador de BUILD.

## Restrições permanentes

- A metodologia não deve ficar codificada diretamente na aplicação.
- TutorIA não acessa o banco diretamente.
- TutorIA é central à condução da jornada; sua entrega pode ser incremental, mas não pode ser reinterpretada como chatbot periférico.
- WhatsApp, quando autorizado, usa somente API oficial.
- Automações externas passam por consentimento, políticas, orquestração de comunicação e auditoria.
- Ferramentas são schema-driven.
- Ferramentas são TutorIA-native, versionadas e capazes de produzir dados estruturados e artefatos exportáveis.
- Ambientes são separados.
- O protótipo/legado não é base de produção.
- A arquitetura inicial é um monólito modular em Next.js/TypeScript com PostgreSQL.

## Controle de release versus sprint

Uma capacidade pode estar aprovada para V2 e continuar `NOT AUTHORIZED FOR CURRENT SPRINT`. O arquivo `10-CURRENT-SCOPE.md` é o Scope Guard operacional.
