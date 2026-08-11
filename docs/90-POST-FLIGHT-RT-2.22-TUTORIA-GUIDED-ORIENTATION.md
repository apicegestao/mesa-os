# Post-Flight — RT-2.22 TutorIA Guided Orientation

**Status:** guarded build checkpoint — 2026-08-11
**Ambiente:** Supabase branch de homologação; produção inalterada.

## Implementado

- Contrato Zod de objetivo e resposta curta do TutorIA, com schema fechado e rejeição de saída inválida.
- Rota server-side autenticada em `/api/tutoria/orientation`; o navegador não chama provedor diretamente.
- Contexto limitado ao estado derivado do membro e ao resumo quantitativo da metodologia, ambos vindos dos contratos RT-2.21.
- Rate limit lógico de quatro tentativas por minuto por identidade e organização.
- Auditoria imutável de início e desfecho de orientação, sem prompt, resposta, segredo ou evidência bruta.
- Guardrail de ativação: sem `TUTORIA_ORIENTATION_ENABLED=true` e as variáveis injetadas do Gateway, a rota devolve indisponibilidade e não chama modelo.

## Verificações

- RLS da nova auditoria confirmado no branch de homologação.
- Advisor de segurança do Supabase sem alertas.
- `pnpm check`: lint, typecheck, 54 testes e build aprovados.

## Não ativado

- AI Gateway, flag de orientação, qualquer chave, inferência ou consumo de créditos.
- Interface interativa, preview, deploy, merge ou produção.

## Gates restantes

1. Configurar AI Gateway e teto de consumo somente em preview/homologação.
2. Habilitar a flag apenas nesse ambiente e executar smoke autenticado.
3. Revisar saída real, auditoria e consumo.
4. Aprovação explícita para mostrar a orientação na interface e, separadamente, para promover.
