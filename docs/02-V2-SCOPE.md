# Mesa OS V2 — Scope Lock

## Direção aprovada para a release

O V2 estabelece o núcleo operacional do Mesa OS. A aprovação de uma capacidade para a release não a autoriza no sprint atual.

## Restrições permanentes

- A metodologia não deve ficar codificada diretamente na aplicação.
- TutorIA não acessa o banco diretamente.
- WhatsApp, quando autorizado, usa somente API oficial.
- Ferramentas são schema-driven.
- Ambientes são separados.
- O protótipo/legado não é base de produção.
- A arquitetura inicial é um monólito modular em Next.js/TypeScript com PostgreSQL.

## Controle de release versus sprint

Uma capacidade pode estar aprovada para V2 e continuar `NOT AUTHORIZED FOR CURRENT SPRINT`. O arquivo `10-CURRENT-SCOPE.md` é o Scope Guard operacional.
