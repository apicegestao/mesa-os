# Change Request — Product Source Baseline

**ID:** CR-GOV-2.16R-01  
**Status:** APPROVED  
**Aprovação:** instrução explícita do owner em 2026-08-11  
**Escopo:** documentação e governança; nenhum BUILD

## Solicitação do owner

Usar a conversa `Mesa OS V2` como base permanente do desenvolvimento porque nela foi desenhado e aprovado o sistema completo, evitando perda de decisões por resumos posteriores.

## Problema

O Governance Pack v1.0 preservou princípios gerais, mas comprimiu decisões importantes sobre TutorIA, Journey, Tools, AI Tool Factory, automações, WhatsApp, UX, atores, segurança e evolução. Restrições temporárias de sprint passaram a dominar a documentação e podem ser interpretadas incorretamente como redução permanente da visão.

## Mudança aprovada

- elevar a conversa fonte a baseline histórica oficial;
- exigir Source Recovery antes da definição de domínios relevantes;
- declarar TutorIA como agente operacional central;
- preservar o Current Scope como único autorizador de implementação;
- registrar origem e cobertura de cada requisito recuperado;
- impedir tanto descarte silencioso quanto implementação direta de conteúdo conversacional não canonizado.

## Documentos afetados

- `00-CONSTITUTION.md` → v1.1;
- `01-BLUEPRINT.md`;
- `02-V2-SCOPE.md`;
- `05-UX-ARCHITECTURE.md`;
- `08-ADR-DECISION-LOG.md`;
- `09-CONSTRUCTION-PROTOCOL.md` → v1.2;
- `10-CURRENT-SCOPE.md`;
- Source Register e matriz de reconciliação novos.

## Segurança

Esta mudança não concede permissões ao TutorIA, não escolhe provedor/modelo, não cria secrets, não habilita WhatsApp e não altera produção. Cada capacidade continua dependente de Definition Pack, autorização, testes e deploy governado.
