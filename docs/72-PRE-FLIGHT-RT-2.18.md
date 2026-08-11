# Pre-Flight — RT-2.18 Experience Recomposition

**Resultado:** GO  
**Branch:** `release/rt-2-18`  
**Authority:** Definition Pack RT-2.18 aprovado em 2026-08-11

## Source Decisions Consulted

- SRC-001 — UX Architecture, Próxima Melhor Ação, Journey, missão, ferramentas e TutorIA.
- SRC-002 — protótipo visual, somente como referência.
- SRC-003 — mapa metodológico 4 × 4.
- `67-TUTORIA-CANONICAL-ARCHITECTURE.md`.
- `68-METHODOLOGY-4X4-RECONCILIATION.md`.

## Build scope

- Design System local e shell autenticado responsivo.
- Navegação por visões sem criar estados de negócio.
- Home `Hoje` com próxima ação derivada.
- Recomposição guiada de Missão, Ferramenta, Implementação e Evidência.
- Fundação visual do TutorIA sem IA falsa ou CTA ativo.
- Mapa metodológico apresentado sem progresso individual inventado.

## Expected files

- `src/app/app/page.tsx` e `src/app/styles.css`.
- componentes novos sob `src/modules/member-experience` e `src/modules/design-system` quando justificável.
- testes de componentes e estado derivados.
- documentação e Post-Flight.

## Migrations

Nenhuma prevista. Descoberta de necessidade de migration interrompe o BUILD e exige adendo aprovado.

## Security

- carregamento e autorização continuam server-side;
- nenhuma chamada de IA, secret ou integração externa;
- nenhuma informação bloqueada será serializada apenas para ser escondida por CSS;
- componentes do TutorIA não aceitam capability controlada pelo cliente.

## Regression risks

- server actions perderem contexto com mudança de composição;
- navegação por âncora ou seção ocultar feedback de formulário;
- CSS global afetar login;
- ordem de foco inadequada no mobile;
- estado de próxima ação divergir do Core Loop Panel.

## Verification

- testes unitários e de componente atuais;
- novos testes de derivação e composição;
- lint, typecheck e build;
- inspeção responsiva;
- smoke completo antes de produção.

## Stop conditions

- necessidade de alterar schema ou regra de negócio;
- IA real, gateway ou secret;
- dados metodológicos apresentados como progresso pessoal;
- regressão de isolamento, validação server-side ou core loop;
- conflito com decisão fonte ou documento FROZEN.
