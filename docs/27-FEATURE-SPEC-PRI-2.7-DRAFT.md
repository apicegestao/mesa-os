# PRI-2.7 — Priority Foundation

**Status:** APPROVED FOR BUILD

**Aprovação:** Rafael Portela Martins, 2026-08-11, com ADR-029 para empates.

## Objetivo

Permitir que o owner transforme o resultado concluído do Raio-X em uma única prioridade organizacional explícita, compreensível e rastreável, sem delegar a decisão crítica ao sistema.

## Problema resolvido

O Diagnóstico mostra a situação atual, mas não determina sozinho onde a organização concentrará esforço. Sem uma prioridade confirmada, o core loop não pode avançar de forma governada.

## Usuários

- Owner com vínculo ativo e diagnóstico Mês 0 concluído.
- `member` permanece fora da decisão neste primeiro incremento.

## Escopo preliminar

- Apresentar o resultado dimensional do diagnóstico concluído.
- Destacar a menor dimensão como candidata baseada em evidência.
- Em empate na menor pontuação, apresentar o bloqueio para futuro desempate TutorIA; nenhuma escolha humana.
- Sem empate, owner confirma a única menor dimensão como prioridade.
- Registrar diagnóstico, revisão metodológica, dimensão, score no momento da escolha, autor e data.
- Exibir a prioridade confirmada como próxima referência do membro.
- Garantir isolamento organizacional, imutabilidade da origem e auditoria.

## Fora do escopo

- Definir Ciclo, prazo, meta, Missão ou plano de ação.
- Recomendar ferramentas, conteúdos ou ações.
- TutorIA, IA generativa ou decisão automática.
- Prioridades livres sem vínculo com dimensão do Raio-X.
- Múltiplas prioridades ativas.
- Repriorização, cancelamento ou histórico longitudinal sem regra aprovada.
- Dashboard ou comparação entre organizações.

## Fluxo preliminar

1. Owner conclui o Diagnóstico.
2. O sistema apresenta os scores dimensionais e explica que o menor score é uma candidata, não uma decisão automática.
3. Sem empate, o owner informa justificativa curta e confirma a única candidata.
4. Em empate, o fluxo aguarda futuro desempate TutorIA e não permite confirmação.
5. Antes de confirmar, o sistema mostra a escolha e sua origem.
6. Owner confirma explicitamente.
7. A prioridade fica registrada; nenhuma etapa de Ciclo é criada.

## Regras preliminares

- Prioridade depende de diagnóstico concluído da própria organização.
- Uma organização possui no máximo uma prioridade ativa neste incremento.
- O sistema não confirma prioridade silenciosamente.
- Empate nunca permite escolha humana neste incremento.
- A prioridade preserva o score e a revisão de origem.
- Confirmar prioridade não representa implementação nem evolução.

## Permissões

- Owner ativo: ler candidatas e confirmar prioridade da própria organização.
- Member: sem leitura ou escrita neste incremento, salvo decisão posterior explícita.
- Nenhum acesso anônimo.

## Dados preliminares

- Organização.
- Execução de diagnóstico concluída.
- Revisão metodológica e dimensão selecionada.
- Score dimensional no momento da confirmação.
- Estado, autor e timestamps.

## Estados

- `awaiting_selection`: diagnóstico concluído, sem prioridade.
- `active`: prioridade confirmada.
- Estados de substituição ou encerramento não estão autorizados neste incremento.

## UX

- Explicar em linguagem simples por que uma dimensão aparece como candidata.
- Diferenciar recomendação baseada em score de decisão confirmada.
- Uma ação principal por tela.
- Confirmação explícita e resumo antes de persistir.
- Mobile, teclado, foco, contraste e estados de erro validados.

## Auditoria

- Diagnóstico e revisão de origem.
- Dimensão e score selecionados.
- Identidade que confirmou e horário.
- Nunca registrar respostas do diagnóstico em logs técnicos.

## Critérios de aceite preliminares

- Sem diagnóstico concluído, nenhuma prioridade pode ser criada.
- A menor dimensão é corretamente identificada como candidata.
- Empates são apresentados sem desempate automático.
- Apenas owner ativo confirma.
- Uma segunda prioridade ativa é rejeitada.
- Registro permanece ligado ao resultado imutável de origem.
- Nenhum Ciclo, Missão ou recomendação de ferramenta é criado.
- Lint, typecheck, testes, build, banco e E2E relevantes são aprovados.

## Decisões aprovadas para o BUILD

1. Owner confirma somente a única menor dimensão candidata.
2. Confirmação humana explícita obrigatória quando não há empate.
3. Justificativa curta obrigatória e confidencial.
4. Prioridade imutável neste release.
5. Somente owner visualiza neste incremento.
6. Título é o nome da dimensão.
7. Explicação usa score, origem e justificativa, sem texto metodológico inventado.
8. Não haverá prazo, meta ou plano de ação.
9. Empate permanece bloqueado para futuro TutorIA, sem intervenção humana.

## Testes necessários

- Unidade: menor score, empate e cardinalidade.
- Banco: constraints, owner, organização e vínculo com execução concluída.
- Integração: carregar candidatas e confirmar.
- E2E: sem diagnóstico, escolha simples, empate, duplicidade, sessão expirada e mobile.
- Segurança: RLS, grants e ausência de respostas nos logs.

## Dependências

- Aprovação das oito decisões obrigatórias.
- Textos metodológicos por dimensão, caso sejam exigidos.
- Feature Spec alterada para `APPROVED FOR BUILD`.
- Novo Current Scope em BUILD e novo Pre-Flight.
- Supabase de staging antes de homologação persistente.
