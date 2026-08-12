# Definition Pack — Experiência do Membro, TutorIA e fronteiras de Intelligence

**Status:** BUILD autorizado pelo owner em 2026-08-12  
**Escopo:** interface do membro; nenhuma nova superfície de backoffice.

## Decisões canonizadas

1. **Conta e segurança** serve para acesso, Termos, recibos e transparência/correção do contexto estruturado do próprio membro. Não é uma área de chat nem de administração de IA.
2. **Governança de IA** (limites, custos, provedores e políticas) é operação interna da Mesa dos Donos. Ela deixa a área do membro; sua futura interface exige Definition Pack próprio de RBAC, MFA e auditoria.
3. **TutorIA** é presença persistente do produto: botão flutuante em todas as telas, que abre uma conversa contextual. Não há seletor de intenção para o membro. O sistema escolhe a rota permitida com base no contexto da tela e na pergunta.
4. O campo de conversa é tratado como composição de chat, não como formulário de ferramenta. A persistência longitudinal permanece governada: o chat bruto não passa a ser memória nem material de treinamento.
5. Cards do membro devem ser derivados de fatos canônicos, ter ação ou estado explícito e evitar métricas inventadas. Cards puramente explicativos permanecem estáticos e identificados como tal.
6. A saudação da tela Hoje deriva do horário local do membro: bom dia, boa tarde ou boa noite.

## Fronteira Mesa OS Intelligence

### Configurável por Intelligence, quando autorizado

- conteúdos de apoio, links externos e referências por etapa metodológica;
- sínteses agregadas e desidentificadas de lacunas, demandas e resultados;
- sugestões internas de pauta, treinamento, ferramenta e acompanhamento;
- regras de apresentação baseadas em dados já estruturados e aprovados.

### Requer mudança de código e governança

- cálculos, fórmulas, critérios de aprovação e regras metodológicas;
- permissões, RLS, retenção, isolamento, auditoria, orçamento e roteamento de modelos;
- novos dados coletados, integrações, automações, canais de WhatsApp ou ações proativas;
- qualquer uso identificável de dados de membros no backoffice;
- criação de telas internas, RBAC/MFA e execução de ações em nome do membro.

## Fora do escopo deste bloco

- backoffice, concierge, mentor ou administrador;
- Mesa OS Intelligence com dados identificáveis;
- treinamento/fine-tuning com conversas dos membros;
- alteração de política de IA, custos, provedores, Terms ou autenticação;
- nova ferramenta metodológica ou mudança no Mapa de Desenvolvimento.

## Validação

- Conta não exibe governança operacional nem chat;
- TutorIA abre a conversa em qualquer tela e mantém a conversa enquanto a pessoa navega na sessão;
- pergunta livre continua sujeita aos mesmos limites de segurança, orçamento e auditoria;
- saudação tem testes para os três períodos;
- typecheck, testes, lint e build passam.
