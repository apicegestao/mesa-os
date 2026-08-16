# Pre-Release Review RPT-1

**Status:** EM EXECUÇÃO — não autoriza ainda alteração em produção

## Evidências já concluídas

- produção Supabase: `ACTIVE_HEALTHY`, PostgreSQL 17 e Security Advisor sem alertas;
- homologação: migrations integradas e GEM-3.5 aplicado; alerta conhecido de senha
  vazada não altera o fluxo OTP atual;
- branch integrada: lint, typecheck, build e 149 testes aprovados;
- backup/restauração de produção: confirmado explicitamente pelo owner;
- variáveis públicas Supabase presentes; ambiente e URL canônicos vêm de
  `netlify.toml` no contexto de produção.

## Ainda necessário antes da janela

- confirmar a lista final de migrations por nome lógico no projeto de produção;
- registrar o commit exato de merge e CI correspondente;
- conferir secret de serviço somente por presença, sem exibir valor;
- cadastrar `GEMINI_API_KEY` no cofre Netlify após deploy/schema, com a flag Gemini
  inicialmente desligada;
- executar smoke integrado em organização de demonstração.

## Sem autorização implícita

Este documento não cadastra segredo, não aplica migration, não faz merge e não
convida membros. Esses passos só ocorrem na sequência RPT-1 e com condições de
parada preservadas.
