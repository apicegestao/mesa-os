# DIA-2.5 — Diagnostic Foundation

**Status:** DRAFT — NOT AUTHORIZED FOR BUILD

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

## Fora do escopo

- Prioridade, Ciclo, Missão, Ferramenta, Implementação, Evidência e Evolução.
- TutorIA, Concierge, WhatsApp e qualquer geração por IA.
- Dashboard de negócio, benchmark externo ou comparação entre organizações.
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

## Decisões obrigatórias antes do BUILD

1. Qual diagnóstico estreia no V2 e qual seu objetivo de negócio?
2. Quem fornece e aprova a primeira definição metodológica?
3. Quais são dimensões, perguntas, tipos de resposta e obrigatoriedade?
4. Existe score? Se sim, qual fórmula, escala, arredondamento e interpretação?
5. Qual resultado mínimo o membro recebe ao concluir?
6. Pode haver mais de uma execução aberta por organização ou por membro?
7. Quem pode responder, revisar, submeter, reabrir ou invalidar uma execução?
8. Respostas exigem classificação de sensibilidade ou retenção específica?
9. Definições serão provisionadas por migration/seed governado ou exigem interface administrativa futura?
10. Qual evento encerra Diagnóstico e habilita a futura etapa de Prioridade, sem implementá-la agora?

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
