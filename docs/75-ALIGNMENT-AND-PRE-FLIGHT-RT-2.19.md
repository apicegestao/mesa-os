# Alignment Check & Pre-Flight — RT-2.19

**Item:** Reconstrução com fidelidade ao protótipo aprovado  
**Mode:** BUILD  
**Status:** APPROVED FOR BUILD

## Autoridades consultadas

- `00-CONSTITUTION.md`
- `02-V2-SCOPE.md`
- `08-ADR-DECISION-LOG.md`
- `09-CONSTRUCTION-PROTOCOL.md`
- `10-CURRENT-SCOPE.md`
- `63-SOURCE-RECOVERY-MESA-OS-V2.md`
- `65-APPROVED-PRODUCT-SOURCE-REGISTER.md`
- `67-TUTORIA-CANONICAL-ARCHITECTURE.md`
- HTML aprovado `mesa-dos-donos-ultima-versao(1).html`

## Alignment Check

O Current Scope autoriza correção de fidelidade visual, densidade compacta, barras de progresso canônicas, card contextual do Lula, App Shell, arquitetura de informação do membro e presença visual do TutorIA. O protótipo é especificação visual e de interação, mas seu código compilado não será copiado para produção.

Não há conflito de autoridade. A reconstrução preserva o core loop persistido e não cria transições, métricas ou capacidades de IA.

## Escopo

- reconstruir sidebar, topbar e página Hoje segundo a composição do protótipo;
- apresentar ciclo, resultado, próxima ação, pulso e direção do Lula com dados canônicos;
- manter Arial em toda a aplicação;
- reduzir tamanho, espaçamento e extensão vertical dos cards;
- manter TutorIA central e visível, declarando honestamente sua indisponibilidade funcional;
- unificar o Raio-X na mesma linguagem visual, com progresso dinâmico por pilar;
- projetar a área Evolução somente com estado canônico, bloqueando comparações ainda inexistentes;
- separar Hoje, Jornada, Evidências e Evolução em áreas próprias, evitando a página única extensa;
- manter o Raio-X pendente como destaque em Hoje e projetar seu resultado somente em Evolução;
- preparar a Direção do Lula como superfície contextual ligada a conteúdo externo, sem geração por IA neste incremento;
- mover configuração de senha para uma área secundária recolhível;
- preservar os fluxos atuais de diagnóstico, prioridade, ciclo, missão, ferramenta, implementação e evidência.

## Fora do escopo

- chat, autonomia, recomendações ou mensagens do TutorIA;
- WhatsApp;
- novos indicadores, metas ou progresso simulados;
- alterações de banco, migrations, RLS ou dados;
- deploy de produção antes de aprovação visual.

## Arquivos previstos

- `src/modules/member-experience/ui/app-chrome.tsx`
- `src/modules/member-experience/ui/member-home.tsx`
- `src/modules/member-experience/index.ts`
- `src/app/app/page.tsx`
- `src/app/styles.css`
- testes de experiência do membro
- documentação de Post-Flight

## Riscos e controles

- **Dados ausentes:** mostrar “ainda não medido”, sem inventar valores.
- **TutorIA prematuro:** controles visuais permanecem desabilitados e rotulados.
- **Regressão funcional:** componentes de negócio existentes serão preservados em áreas ancoradas.
- **Responsividade:** validar desktop e viewport estreito.

## Verificações obrigatórias

Lint, typecheck, testes, build e inspeção visual local. Nenhuma migration prevista.
