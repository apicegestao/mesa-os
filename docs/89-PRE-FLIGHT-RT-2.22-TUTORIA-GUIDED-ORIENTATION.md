# Pre-Flight — RT-2.22 TutorIA Guided Orientation

**Status:** PASS FOR GUARDED BUILD — 2026-08-11  
**Ambiente autorizado:** branch Supabase de homologação `tqpxqevlhfyqnjdrhlhd`; produção excluída.

## Prontidão

- RT-2.21 forneceu catálogo fechado de leituras, policy determinística, auditoria e isolamento por RLS.
- `pnpm check` estava verde ao final do RT-2.21 (51 testes, lint, typecheck e build).
- O projeto tem deploy de produção anterior, pré-condição operacional do AI Gateway, mas o RT-2.22 não o alterará.

## Guardrails de build

- A rota só poderá chamar provedor se `TUTORIA_ORIENTATION_ENABLED` for exatamente `true` e se as variáveis injetadas do AI Gateway estiverem presentes em homologação.
- Sem essas condições, a API devolve indisponibilidade honesta, sem chamar provedor e sem gastar créditos.
- O modelo será fixo em `gemini-2.5-flash`, com entrada e saída limitadas por schema.
- Nenhum segredo será criado, lido, impresso ou adicionado ao repositório.

## Gates para ativação futura

1. Habilitar AI Gateway somente no contexto de preview/homologação.
2. Definir rate limit e teto de custo no controle do Netlify.
3. Confirmar resposta autenticada, schema, auditoria e consumo no preview.
4. Produzir Post-Flight e obter aprovação explícita antes de qualquer promoção.
