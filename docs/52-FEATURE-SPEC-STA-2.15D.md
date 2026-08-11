# STA-2.15D — Core-loop Status & Next Action

**Status:** PROPOSED — BUILD NOT AUTHORIZED

## Objetivo

Fazer o owner compreender onde está, o que fazer agora e por que isso importa durante Implementação, Evidência e transição.

## Escopo

- Estado derivado no servidor a partir dos registros canônicos; sem progresso duplicado persistido.
- Próxima ação determinística: preencher Ferramenta, registrar Implementação, registrar Evidência ou conhecer a próxima Missão.
- Confirmações claras de estado e bloqueios.

## Fora do escopo

- Dashboard, percentual, gamificação, notificações, recomendações de IA ou Evolução.
- Ferramenta/execução para a Missão 2.

## Regras de negócio

1. A próxima ação deriva de Missão, Ferramenta, Implementação e Evidência; o cliente não decide transições.
2. Somente owner ativo acessa o estado da organização.
3. Após a transição, a Missão 2 é apresentada; se não houver Ferramenta vinculada, o sistema comunica disponibilidade futura sem criar ação falsa.
4. Estados impossíveis resultam em erro seguro e logging sem dados sensíveis.

## UX

Um bloco único de status substitui mensagens dispersas e usa linguagem não técnica. Não há barra percentual nem alegação de transformação.

## Critérios de aceite

- Cada estado válido produz exatamente uma próxima ação.
- A interface nunca oferece Evidência antes da Implementação nem conclusão sem Evidência.
- A Missão 2 aparece após transição, com bloqueio honesto para a Ferramenta futura.
- Erros não expõem IDs internos, payloads ou detalhes de segurança.

## Testes necessários

Tabela de estados, componentes, integração, acessibilidade, logging, typecheck, lint e build.

## Dependências

IMP-2.15A, EVD-2.15B e MTR-2.15C.
