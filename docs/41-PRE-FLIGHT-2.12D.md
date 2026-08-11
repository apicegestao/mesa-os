# Pre-Flight — GOV-2.12D Tool Foundation Definition & Alignment

**Data:** 2026-08-11
**Modo:** DEFINITION
**Status:** GO

## Alignment Check

- O core loop posiciona Ferramenta depois de Missão.
- MIS-2.11 foi publicado e homologado com a primeira Missão disponível e as demais protegidas.
- Constitution determina que Ferramentas são objetos estruturados, não downloads.
- V2 Scope determina que Ferramentas são schema-driven e metodologia não fica codificada na aplicação.
- A fase atual autoriza somente definição e alinhamento.

## Escopo

- Definir o propósito e os limites da primeira Ferramenta.
- Propor schema, campos, rascunho, autoria, validação e vínculo com a Missão.
- Explicitar decisões obrigatórias antes do BUILD.
- Atualizar documentação canônica e encerrar a fase documental.

## Fora do escopo

- Código, banco, deploy ou Ferramenta real.
- Conclusão/desbloqueio de Missão.
- Implementação, Evidência, score, impacto ou Evolução.
- TutorIA, IA, anexos, exportação ou colaboração por `member`.

## Arquivos previstos

- `docs/03-ROADMAP.md`
- `docs/06-BACKLOG-MASTER.md`
- `docs/07-TRACEABILITY-MATRIX.md`
- `docs/10-CURRENT-SCOPE.md`
- `docs/41-PRE-FLIGHT-2.12D.md`
- `docs/42-FEATURE-SPEC-TOL-2.13-DRAFT.md`
- `docs/43-POST-FLIGHT-2.12D.md`

## Migration e testes

Nenhuma migration. Verificação documental, diff check e confirmação de ausência de alterações funcionais.

## Riscos

- Reduzir Ferramenta a arquivo ou formulário sem semântica.
- Codificar campos diretamente na interface.
- Confundir rascunho preenchido com implementação ou evidência.
- Desbloquear Missão seguinte sem evento legítimo.
- Coletar dados excessivos ou sem finalidade clara.

## Go / No-Go

**GO** para Definition & Alignment. **NO-GO** para implementação de TOL-2.13.
