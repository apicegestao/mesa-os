# Pre-Flight — RT-2.23 AI Budget Governance

**Status:** PASS — 2026-08-11

1. Branch Supabase de homologação identificada: `tqpxqevlhfyqnjdrhlhd`; produção não será tocada.
2. A orientação do TutorIA continua desativada por flags e limite técnico explícito.
3. O custo será armazenado em micros de USD; limites são administrados em centavos BRL com taxa BRL/USD versionada e informada pelo owner.
4. A reserva precisa ocorrer dentro de uma transação PostgreSQL protegida por lock por membro/período; não será confiada ao navegador ou ao modelo.
5. Tabelas de reserva e orçamento terão RLS e nenhum acesso direto de membros; somente revisão de política pelo owner será exposta.
6. Advisor de segurança, teste de concorrência/isolamento, lint, typecheck, testes e build são gates obrigatórios antes do Post-Flight.
