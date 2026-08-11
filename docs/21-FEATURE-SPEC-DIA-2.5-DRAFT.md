# DIA-2.5 — Diagnostic Foundation

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11.

**Fonte candidata recebida:** `raio-x-mesa-dos-donos.jsx`, analisada em `23-SOURCE-ANALYSIS-RAIO-X.md`. O arquivo é referência de conteúdo e comportamento; não é base de código nem autoridade visual.

## Objetivo

Definir a fundação do primeiro passo do core loop, permitindo futuramente que um membro execute um diagnóstico organizacional versionado e obtenha um resultado rastreável, sem acoplar a metodologia ao código.

## Problema resolvido

Após autenticar-se, o membro ainda não possui uma primeira ação de transformação. O Diagnóstico deve estabelecer uma leitura inicial estruturada antes de qualquer definição de Prioridade.

## Usuários

- Membro com vínculo organizacional ativo.
- Owner apenas quando atuar como membro; privilégios de acesso não alteram o resultado metodológico sem regra aprovada.

## Escopo preliminar

- Definição de diagnóstico e suas revisões como dados versionados.
- Uma execução de diagnóstico vinculada à organização e à identidade responsável.
- Progresso persistente e retomada segura.
- Submissão explícita e resultado imutável ou versionado após conclusão.
- Resultado mínimo rastreável, limitado ao que for aprovado.
- RLS e auditoria coerentes com o vínculo organizacional.
- Experiência orientada à próxima ação, com estados vazio, progresso, erro e conclusão.

## Recorte recomendado para o primeiro BUILD

- Somente a aplicação inicial `Mês 0 — Entrada`.
- Cinco dimensões e vinte perguntas recebidas na fonte candidata.
- Escala ordinal obrigatória de 1 a 5.
- Salvamento de rascunho e retomada.
- Submissão explícita, com resultado preservado como registro imutável.
- IME geral, resultado por dimensão e faixa de maturidade, condicionados à aprovação formal das fórmulas e textos.
- Uma próxima ação clara no shell autenticado; não criar dashboard.

## Fora do escopo

- Prioridade, Ciclo, Missão, Ferramenta, Implementação, Evidência e Evolução.
- TutorIA, Concierge, WhatsApp e qualquer geração por IA.
- Dashboard de negócio, benchmark externo ou comparação entre organizações.
- Reaplicações de Mês 3, 6, 9 e 12 e comparação longitudinal; pertencem a um incremento posterior.
- Perfil empresarial amplo.
- Editor visual de metodologia ou AI Tool Factory.
- Gamificação, recomendações automáticas ou automações não aprovadas.

## Fluxo preliminar

1. Membro autenticado entra no contexto da organização.
2. O sistema apresenta a próxima ação de Diagnóstico disponível.
3. O membro inicia ou retoma uma execução.
4. O sistema persiste respostas válidas conforme a definição versionada.
5. O membro revisa e confirma a submissão.
6. O sistema fixa a versão usada e apresenta apenas o resultado aprovado.

## Regras vinculantes preliminares

- A metodologia é dado versionado; perguntas, opções, pesos e textos não ficam codificados em componentes.
- Uma execução concluída preserva a versão metodológica utilizada.
- Nenhum resultado ou score é inferido sem fórmula aprovada.
- O membro acessa somente execuções da própria organização conforme política aprovada.
- Salvar progresso não equivale a concluir o diagnóstico.
- Conclusão exige ação explícita e validação de completude.
- Uma reaplicação futura cria nova execução; nunca sobrescreve um resultado concluído.
- O nome do membro vem da identidade autenticada; não é digitado e persistido separadamente no diagnóstico.

## Conteúdo metodológico candidato

### Dimensões

1. Financeiro.
2. Liderança & Equipe.
3. Marketing & Captação.
4. Vendas & Comercial.
5. Autonomia do Dono.

Cada dimensão contém quatro perguntas, totalizando vinte perguntas.

### Escala

1. Não existe.
2. Raramente funciona.
3. Às vezes.
4. Com frequência.
5. Totalmente estruturado.

### Cálculo candidato

- Dimensão: `arredondar(soma das 4 respostas / 20 × 100)`.
- IME: `arredondar(soma das 20 respostas / 100 × 100)`, equivalente à média das respostas convertida para percentual.
- Como todas as respostas são obrigatórias, resultados parciais não recebem score oficial.

### Faixas candidatas

- 0–39: Empresa Refém.
- 40–59: Em Transição.
- 60–79: Em Maturação.
- 80–100: Autogerenciável.

As perguntas completas e os achados de adaptação estão registrados na análise da fonte. Fórmulas, faixas e nomenclaturas foram aprovadas para este BUILD.

## UX

- Uma próxima ação clara; a home não vira dashboard.
- Linguagem não técnica e progressive disclosure.
- Retomada informa progresso sem expor estruturas internas.
- Mobile, teclado, foco, contraste e mensagens de erro devem ser validados.

## Auditoria preliminar

- Início, retomada, submissão e versão metodológica utilizada.
- Alterações administrativas da definição, caso esse fluxo seja futuramente autorizado.
- Nunca registrar respostas sensíveis em logs técnicos.

## Critérios de aceite preliminares

- Definições metodológicas podem evoluir sem deploy de código.
- Uma execução sempre referencia uma versão imutável da definição.
- Rascunho pode ser retomado e não aparece como concluído.
- Submissão incompleta é rejeitada de modo compreensível.
- Isolamento organizacional é provado por testes de banco.
- Nenhuma etapa posterior do core loop é criada.
- Lint, typecheck, testes, build, banco e E2E relevantes são aprovados.

## Decisões aprovadas para o BUILD

1. Nome `Raio-X do Empresário`; objetivo: medir maturidade empresarial na entrada.
2. JSX recebido como fonte metodológica inicial aprovada por Rafael Portela Martins.
3. Cinco dimensões, vinte perguntas e escala obrigatória de 1 a 5 sem alteração textual.
4. Fórmulas, arredondamento inteiro e quatro faixas candidatas aprovados.
5. Resultado mínimo: IME, faixa, radar por dimensão e detalhamento das respostas.
6. Uma única execução aberta por organização no Mês 0; sem colaboração neste incremento.
7. Somente `owner` ativo pode iniciar, alterar e submeter; membros permanecem sem permissão de escrita neste incremento.
8. Respostas classificadas como dado organizacional confidencial; retenção durante o vínculo contratual e exclusão por processo administrativo futuro.
9. Primeira definição via seed versionado e idempotente, sem interface administrativa.
10. Submissão encerra somente o Diagnóstico; nenhuma etapa de Prioridade é habilitada.

## Testes necessários

- Unidade: validação de respostas, completude e transições de estado.
- Banco: constraints, versionamento e isolamento por organização.
- Integração: iniciar, salvar, retomar e submeter.
- E2E: caminho principal, sessão expirada, erro, incompletude e mobile.
- Segurança: grants, RLS, ausência de secrets e dados sensíveis em logs.

## Dependências

- Respostas aprovadas às decisões obrigatórias.
- Feature Spec alterada para `APPROVED FOR BUILD`.
- ADRs adicionais caso surjam decisões arquiteturais duráveis.
- Novo Current Scope em BUILD e novo Pre-Flight.
- Projeto Supabase de staging antes de homologação persistente.
