# Definition Pack — acesso único e experiência interna coerente

**Status:** APPROVED FOR BUILD IN HOMOLOGATION — solicitação direta do owner em 2026-08-14.  
**Objetivo:** reduzir fricção de entrada e alinhar o ambiente interno ao padrão visual aprovado da Mesa dos Donos.

## Decisões

- haverá uma única tela de entrada por e-mail e código OTP;
- após validar o código, o sistema decide o destino pelo acesso já autorizado:
  - acesso operacional ativo → Backoffice;
  - matrícula organizacional ativa sem acesso operacional → ambiente do membro;
  - sem vínculo ativo → estado seguro de acesso pendente;
- o usuário não escolhe papel, ambiente ou organização na entrada;
- todos os perfis internos seguem para o Backoffice, que exibe apenas os módulos permitidos pelas capabilities existentes;
- não haverá senha, link mágico, login social, criação pública ou enumeração de e-mails.

## Direção visual

- Arial em toda a aplicação;
- azul institucional #101D37 como eixo visual;
- fundo claro azulado, superfícies brancas, bordas discretas e tipografia compacta;
- navegação interna previsível e sem mistura de paletas verde/azul;
- cartões apenas para resumo, decisão, métrica ou ação.

## Limites

- não altera RLS, papéis, dados de membros, regras metodológicas ou permissões;
- não cria Admin Master automaticamente;
- não promove produção;
- o redirecionamento é conveniência de interface; autorização continua sendo validada por servidor e banco.

## Critérios de aceite

1. uma tela de login atende membro e equipe;
2. um Admin ou Concierge entra no Backoffice sem selecionar perfil;
3. um membro entra no ambiente do membro sem selecionar perfil;
4. áreas internas usam a paleta e a tipografia da Mesa;
5. testes, typecheck e build passam antes de uma única prévia consolidada.
