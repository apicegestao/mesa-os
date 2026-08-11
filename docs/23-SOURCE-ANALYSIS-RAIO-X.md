# Análise de fonte — Raio-X Mesa dos Donos

**Data:** 2026-08-11  
**Fonte:** `/Users/rafaelportela/Downloads/raio-x-mesa-dos-donos.jsx`  
**Tratamento:** referência funcional e metodológica; não copiar código, layout, estilos ou armazenamento.

## Conteúdo extraído

### Diagnóstico

- Nome apresentado: Raio-X do Empresário.
- Descrição: Diagnóstico de maturidade — 12 meses.
- Cinco aplicações propostas: Mês 0, 3, 6, 9 e 12.
- Cinco dimensões, quatro perguntas cada.
- Todas as respostas usam escala obrigatória de 1 a 5.

### Perguntas por dimensão

#### Financeiro

1. Você conhece a margem de contribuição de cada produto ou serviço?
2. Tem previsibilidade de caixa para os próximos 60 a 90 dias?
3. Toma decisões com base em indicadores, não em feeling?
4. Seu financeiro é atualizado e monitorado pela equipe, sem depender de você?

#### Liderança & Equipe

1. Seu time executa tarefas críticas do dia a dia sem te consultar?
2. Cada área tem um responsável com metas claramente definidas?
3. Você conduz reuniões de gestão com cadência definida e consistente?
4. A cultura da empresa se mantém mesmo quando você está ausente?

#### Marketing & Captação

1. Seu posicionamento no mercado é claro e diferenciado da concorrência?
2. Você tem canais de geração de leads previsíveis e mensuráveis?
3. A jornada do cliente está mapeada do primeiro contato até a recompra?
4. Você monitora ativamente retenção e recompra de clientes?

#### Vendas & Comercial

1. O processo de vendas está documentado e qualquer vendedor consegue replicar?
2. As metas comerciais são atingidas sem a sua intervenção direta?
3. Existe um roteiro de vendas utilizado ativamente pelo time?
4. Você monitora a taxa de conversão por etapa do funil de vendas?

#### Autonomia do Dono

1. Sua empresa funciona normalmente por 5 ou mais dias sem sua presença?
2. As decisões operacionais são tomadas pela equipe, não por você?
3. Você tem tempo dedicado exclusivamente à estratégia do negócio?
4. Existe um líder ou gerente conduzindo o time operacional no lugar do dono?

### Escala

| Valor | Texto |
|---:|---|
| 1 | Não existe |
| 2 | Raramente funciona |
| 3 | Às vezes |
| 4 | Com frequência |
| 5 | Totalmente estruturado |

### Resultado candidato

- Índice de Maturidade Empresarial (IME), de 0 a 100.
- Score de 0 a 100 por dimensão.
- Radar por dimensão.
- Detalhamento de respostas.
- Faixas: Empresa Refém, Em Transição, Em Maturação e Autogerenciável.

## Regras observadas na fonte

- Uma dimensão só avança depois de suas quatro respostas.
- O resultado só é liberado depois das vinte respostas.
- O IME usa peso igual para todas as perguntas.
- Cada dimensão usa peso igual entre suas quatro perguntas.
- Aplicações posteriores dependem apenas da conclusão da anterior; datas reais não são verificadas.
- `Refazer` substitui os dados do período no armazenamento local.
- O nome do membro é digitado manualmente.
- Os dados são armazenados em uma API local `window.storage`, sem organização, auditoria ou controle de acesso.

## Adaptações obrigatórias para o Mesa OS

- Implementar conteúdo como definição metodológica versionada, separada do código.
- Persistir no PostgreSQL/Supabase com RLS e vínculo organizacional.
- Obter identidade e organização da sessão; remover identificação manual do membro.
- Separar rascunho de submissão concluída.
- Proibir sobrescrita de resultado concluído; reaplicação futura cria nova execução.
- Trocar o “Painel” por experiência de próxima ação, sem dashboard corporativo.
- Usar o Design System do Mesa OS, sem copiar cores inline, emojis ou componentes visuais da fonte.
- Garantir acessibilidade da escala: texto completo visível e controle por teclado, não apenas `title`.
- Não incluir comparação longitudinal no primeiro BUILD; isso antecipa Evolução.
- Não liberar Mês 3/6/9/12 sem regra temporal e incremento próprios.

## Decisões de engenharia propostas

- Mês 0 como único período do primeiro BUILD.
- Uma definição inicial provisionada por seed versionado e idempotente.
- Uma execução aberta por organização para o Mês 0.
- Respostas obrigatórias; nenhum score parcial oficial.
- Resultado concluído imutável, com versão metodológica preservada.

Estas propostas não autorizam BUILD. A aprovação ocorre na Feature Spec e no Current Scope.
