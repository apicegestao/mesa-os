# Pre-Flight — TOL-2.13 Structured Tool Foundation

**Data:** 2026-08-11
**Modo:** BUILD
**Status:** GO

## Alignment Check

- MIS-2.11 foi publicado e homologado com a primeira Missão disponível.
- GOV-2.12D foi concluído e as oito decisões foram aprovadas.
- A solução respeita os requisitos FROZEN de Ferramenta estruturada, schema-driven e metodologia fora do código.
- Salvar o rascunho não representa Implementação, Evidência ou Evolução.

## Escopo

- Definição versionada do `Mapa de Papéis e Decisões`.
- Binding imutável com a primeira definição de Missão.
- Um rascunho por Missão, owner-only, retomável e validado no servidor.
- Interface genérica para adicionar, remover, reordenar e editar de 1 a 20 entradas.
- RLS, grants mínimos, testes, migration e documentação.

## Fora do escopo

- Submissão, aprovação, conclusão ou desbloqueio de Missão.
- Implementação, Evidência, impacto, score ou Evolução.
- TutorIA, IA, anexos, exportação, comentários ou colaboração.
- Ferramentas para outras Missões.

## Riscos e controles

- Schema divergente da UI: renderização orientada pela revisão publicada.
- Payload adulterado: validação integral no banco e rejeição de chaves desconhecidas.
- Vazamento entre organizações: RLS owner-only e revalidação transacional.
- Payload excessivo: limites por campo, quantidade e tamanho total.
- Falso avanço: estado único `draft`, sem transição de Missão.

## Testes

- pgTAP para tabelas, RLS, função e unicidade.
- Validação de payload válido e inválido com rollback.
- Teste de interface schema-driven.
- Lint, typecheck, Vitest, build e advisors.

## Go / No-Go

**GO** para TOL-2.13 dentro deste recorte. **NO-GO** para Implementação e etapas posteriores.
