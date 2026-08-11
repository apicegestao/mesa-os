# Definition Pack — RT-2.23 AI Budget Governance

**Status:** APPROVED — owner, 2026-08-11
**Modo proposto:** BUILD em homologação isolada

## Objetivo

Permitir que o administrador atual da organização (`owner`) altere o limite de uso de IA de seus membros sem mudança de código, enquanto a equipe Mesa dos Donos administra separadamente sua verba mensal global de operação e metodologia interna.

## Configuração inicial proposta

| Controle | Valor inicial | Escopo |
| --- | ---: | --- |
| Limite por membro | R$ 100,00/mês | Cada identidade ativa da organização |
| Verba interna Mesa dos Donos | R$ 500,00/mês | Uso global da equipe Mesa dos Donos, incluindo IA de metodologia interna; não pertence a organizações de membros |
| Moeda de administração | BRL | Configuração e relatórios internos |
| Cobrança técnica | USD | Registro estimado por modelo e tokens |

Uma orientação a membro somente é permitida se o membro tiver saldo no seu limite individual. A verba interna da Mesa dos Donos é controlada por um ledger global separado e nunca é repartida, exibida ou consumida como orçamento da organização do membro.

## TBG-2.23A — política versionada de orçamento

- Configuração por organização: centavos BRL por membro/mês, taxa BRL/USD de referência e fuso de fechamento.
- Configuração global de operação Mesa dos Donos: verba mensal interna em BRL, escopo de custo (`metodologia_interna`, futuro `operacao_interna`) e auditoria restrita à equipe autorizada.
- Valores iniciais: `10000` centavos por membro e `50000` centavos para a verba global da Mesa dos Donos; fuso `America/Sao_Paulo`.
- A taxa cambial é informada pelo owner e versionada com data de vigência. Não haverá consulta automática de câmbio nem falsa precisão de fatura.
- Cada alteração cria revisão imutável com autor, data e valores anteriores/novos.

## TBG-2.23B — enforcement server-side

- Antes de cada orientação a membro, o gateway calcula o custo máximo possível e verifica o teto individual no período atual.
- As capacidades internas da Mesa dos Donos verificam exclusivamente a verba global interna, em ledger separado; elas não disputam saldo com membros.
- A verificação ocorre no servidor e é atômica; o navegador, o modelo e o provedor não escolhem orçamento.
- Falta de saldo, taxa ausente, configuração inativa ou concorrência retorna indisponibilidade honesta, registra auditoria e não chama modelo.
- O custo observado após a resposta é registrado; diferença entre estimativa e consumo real aparece como reconciliação interna, sem estourar o teto silenciosamente.

## TBG-2.23C — administração e visibilidade

- A página `Conta e segurança` do owner receberá uma área de **Governança de IA** para o limite por membro, com edição, confirmação e histórico.
- A verba global de R$500 ficará em uma futura área interna da equipe Mesa dos Donos, não na conta da empresa membro.
- O membro não vê orçamento, custo individual ou taxas. Uma interface administrativa mais ampla exige pacote próprio de RBAC.
- Indicadores internos: custo por membro, por capacidade, por modelo, por resolução, saldo do período, bloqueios por orçamento e estimativa versus observado.

## Proteções e exclusões

- Nenhuma alteração de limite chama ou habilita IA por si só.
- Nenhum valor de orçamento, taxa, token, resposta ou chave é enviado ao modelo.
- Não há cobrança automática, cartão, pagamento ou integração financeira.
- Meta/WhatsApp, DeepSeek direto, fallback automático entre modelos e produção continuam fora deste incremento.

## Critérios de aceite

1. O owner altera o limite por membro e taxa sem deployment ou mudança de código.
2. Uma orientação que excede o teto do membro é bloqueada antes de chamar o provedor; uma capacidade interna só pode usar a verba global Mesa dos Donos.
3. Duas solicitações concorrentes não conseguem ultrapassar o respectivo orçamento, sem cruzar os escopos de membro e equipe interna.
4. Todo período e toda alteração ficam auditáveis; o membro não acessa os dados internos.
5. RLS, testes concorrentes, lint, typecheck, build, advisor e preview autenticado passam antes de promoção.

## Decisão pedida

Aprovar o RT-2.23 com o valor inicial de R$100 por membro/mês, gerenciado pelo owner da organização na interface, e R$500/mês em verba global exclusiva da equipe Mesa dos Donos para IA de metodologia interna, com taxa BRL/USD configurável e versionada.
