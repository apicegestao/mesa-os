# Methodology 4 × 4 — Reconciliation

**Fonte:** SRC-003 — Mapa de desenvolvimento  
**Status:** CANONICAL DIRECTION; DATA MODEL RECONCILIATION REQUIRED BEFORE BUILD

## Mapa recebido

| Pilar | T1 · Fundamentos | T2 · Controle | T3 · Previsibilidade | T4 · Autonomia |
|---|---|---|---|---|
| Financeiro e indicadores | DRE e painel mínimo | Orçamento e caixa | Metas e projeções | Decisão por indicadores |
| Equipe, cultura e liderança | Papéis e organograma | Rituais de liderança | Gestão de desempenho | Autonomia e sucessão |
| Marketing e vendas | Funil e proposta | Rotina comercial | Previsibilidade de vendas | Motor de crescimento |
| Processos internos | Mapa de processos | SOPs críticos | Indicadores de processo | Melhoria contínua |

## Interpretação preservada

- A metodologia possui quatro pilares evoluindo ao longo de quatro trimestres.
- Cada trimestre possui uma intenção de maturidade transversal.
- O membro pode ter entregas ativas em mais de um pilar e uma prioridade explícita do ciclo.
- TutorIA usa o mapa para explicar onde a empresa está, o que está construindo agora e o que virá depois.
- A visão trimestral não deve virar uma grade rígida de conteúdo; implementação e evidência continuam determinando evolução.

## Relação com o que já existe

### Correspondências

- `Papéis e organograma` se relaciona à Missão `Clareza de papéis e decisões` e ao `Mapa de Papéis e Decisões` já publicado.
- `Rituais de liderança` se relaciona à Missão `Ritmo de gestão`.
- `Autonomia e sucessão` se relaciona à trajetória de delegação e redução de dependência do dono.
- O ciclo de 90 dias existente é temporalmente compatível com um trimestre.

### Divergências

- O diagnóstico atual escolhe uma única dimensão prioritária; o mapa mostra desenvolvimento transversal com prioridade destacada.
- A metodologia publicada contém inicialmente três Missões somente em Liderança & Equipe; o mapa contém dezesseis células de desenvolvimento.
- As dimensões atuais do IME e os quatro pilares do mapa ainda não possuem uma taxonomia canônica reconciliada.
- `Ciclo`, `trimestre`, `entrega ativa`, `prioridade do ciclo` e `missão` precisam de relações explícitas, sem serem tratados como sinônimos.
- Percentuais e números demonstrativos do protótipo não são evidência metodológica nem dados de produção.

## Modelo conceitual recomendado

```text
Methodology Version
  └── Development Map
       ├── Pillars
       ├── Stages / Quarters
       └── Development Outcomes (4 × 4)

Journey
  └── Quarter / 90-day Cycle
       ├── Priority Outcome
       ├── Supporting Outcomes
       ├── Missions
       ├── Tools
       ├── Implementations
       └── Evidence / Metrics
```

## Proteção do que já foi publicado

Nenhuma migration atual será reescrita ou removida. A reconciliação deverá ser aditiva e versionada:

- preservar diagnóstico, prioridade, ciclo, missões, ferramenta, implementação e evidência existentes;
- mapear registros atuais à versão metodológica correspondente;
- criar novas definições em versão posterior;
- nunca simular progresso ou concluir células retroativamente;
- exigir regra explícita para migrar ou manter jornadas em versões anteriores.

## Decisões necessárias no futuro Definition Pack

- taxonomia final entre pilares do IME e pilares do mapa;
- se todo trimestre ativa quatro outcomes ou apenas um prioritário e apoios condicionais;
- critério de conclusão de cada outcome;
- relação entre outcome, ciclo, missão e ferramenta;
- regra de progressão entre T1, T2, T3 e T4;
- impacto de pausas, atrasos e ciclos adicionais;
- cálculo de progresso separado de evolução empresarial;
- regras para múltiplos membros da mesma organização.

Essas decisões não podem ser preenchidas por inferência de implementação.
