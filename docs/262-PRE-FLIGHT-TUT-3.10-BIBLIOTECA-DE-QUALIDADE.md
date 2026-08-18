# Pre-Flight — TUT-3.10

**Autoridades:** Constitution, V2 Scope, Construction Protocol, ADR-036, ADR-039, ADR-043, Current Scope e decisão do owner de transformar o TutorIA em referência de ensino empresarial.

**Alterações:** contrato de qualidade, cenários sintéticos, prompt server-side, fallback de qualidade e testes.  
**Dados e segurança:** nenhum dado de membro, migration, novo provedor ou custo adicional. O prompt continua recebendo apenas o contexto já autorizado.  
**Risco:** fallback excessivamente genérico. **Controle:** o guardrail rejeita apenas evasão, encaminhamento humano ou resposta materialmente curta; os cenários e testes impedem regressão.  
**Validação:** typecheck, testes, lint, build e revisão do diff.
