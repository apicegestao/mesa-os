# Pre-Flight — GOV-2.4D Diagnostic Foundation Definition & Alignment

**Data:** 2026-08-11  
**Mode:** DEFINITION

## Alignment Check

- O IAM-2.3 foi validado em produção e fornece o pré-requisito de identidade e pertencimento.
- O core loop `Diagnóstico → Prioridade → Ciclo → Missão → Ferramenta → Implementação → Evidência → Evolução` torna Diagnóstico o próximo domínio lógico.
- O Governance Pack não contém regras suficientes para implementar Diagnóstico sem inventar produto.
- A metodologia deve permanecer versionada e separada do código.
- Não há conflito com decisões `FROZEN` desde que esta etapa permaneça documental.

## Item

GOV-2.4D — definir e alinhar a proposta DIA-2.5 — Diagnostic Foundation.

## Documentos consultados

- `00-CONSTITUTION.md`
- `01-BLUEPRINT.md`
- `02-V2-SCOPE.md`
- `03-ROADMAP.md`
- `05-UX-ARCHITECTURE.md`
- `06-BACKLOG-MASTER.md`
- `07-TRACEABILITY-MATRIX.md`
- `08-ADR-DECISION-LOG.md`
- `09-CONSTRUCTION-PROTOCOL.md`
- `10-CURRENT-SCOPE.md`
- `19-POST-FLIGHT-IAM-2.3.md`

## Escopo

- Encerrar a divergência documental do IAM-2.3.
- Criar Feature Spec preliminar do primeiro domínio do core loop.
- Explicitar decisões que bloqueiam BUILD.
- Atualizar os documentos operacionais de governança.

## Fora do escopo

- Código, schema, migrations, deploy ou configuração externa.
- Questionário real, conteúdo metodológico, score, recomendação ou relatório.
- Prioridade e demais etapas do core loop.
- Qualquer capacidade já marcada como não autorizada.

## Arquivos previstos

- Alteração: roadmap, backlog, rastreabilidade, Current Scope e Post-Flight IAM.
- Criação: este Pre-Flight, Feature Spec preliminar e Post-Flight GOV-2.4D.

## Migrations

Nenhuma.

## Riscos

- Codificar metodologia na aplicação.
- Confundir diagnóstico com formulário genérico ou dashboard.
- Produzir score ou recomendação sem regra aprovada.
- Antecipar Prioridade ou outras etapas do core loop.

## Verificação

- Revisão de consistência documental.
- Confirmação de que nenhum arquivo de aplicação, banco ou infraestrutura foi alterado.

## Conflitos

Nenhum identificado. O BUILD de DIA-2.5 permanece bloqueado até aprovação explícita.
