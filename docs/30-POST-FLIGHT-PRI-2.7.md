# Post-Flight — PRI-2.7 Priority Foundation

**Backlog:** PRI-2.7  
**Status:** COMPLETE — PRODUCTION RELEASED  
**Data:** 2026-08-11

## Implementado

- Identificação da única menor dimensão do diagnóstico concluído.
- Confirmação explícita por owner com justificativa confidencial de 10 a 500 caracteres.
- Prioridade imutável ligada à organização, execução, revisão, dimensão, score, autor e data.
- Uma prioridade por organização e por diagnóstico.
- Empate bloqueado para futuro desempate TutorIA, sem escolha humana.
- Função transacional que recalcula a candidata e rejeita dados adulterados.
- RLS owner-only, grants mínimos e índices de foreign keys.
- Interface após o resultado do IME para confirmar, visualizar ou aguardar TutorIA.

## Deliberadamente não implementado

- TutorIA, provedor/modelo, prompt ou desempate por IA.
- Escolha humana em empate ou de dimensão diferente da única menor.
- Ciclo, Missão, prazo, meta, plano, alteração ou segunda prioridade.

## Verificação

- ESLint e TypeScript: aprovados.
- Vitest: 6 arquivos, 13 testes aprovados.
- Next.js build: aprovado.
- Banco real: candidato único `Liderança & Equipe`, score 30/100.
- Teste transacional de confirmação: aprovado e revertido.
- Teste transacional com empate simulado: corretamente rejeitado e revertido.
- Produção permaneceu com zero prioridades após os testes.
- RLS ativo e uma política owner-only.
- Smoke test aceito em produção: prioridade `Liderança & Equipe`, score de origem 30/100, confirmada com justificativa válida; o conteúdo confidencial não foi lido na verificação.

## Migration

- Local: `20260811135526_priority_foundation.sql`.
- Aplicada remotamente pelo conector Supabase como `priority_foundation`.

## Segurança e advisors

- `confirm_priority` é endpoint transacional intencional: autenticado, `search_path` vazio, negado para público/anônimo e revalida owner e organização.
- Índices sem uso são esperados antes da primeira confirmação real.
- Proteção de senha vazada não se aplica ao fluxo magic link.

## Dívida técnica

- TutorIA Tie-Breaker exige Definition & Alignment próprio, contrato sem acesso direto ao banco, critérios, explicabilidade, confiança, fallback e auditoria.
- E2E autenticado depende de staging dedicado.

## Próximo gate

Smoke test de produção concluído. Qualquer implementação de TutorIA Tie-Breaker ou Ciclo exige novo Current Scope.
