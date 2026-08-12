# Definition Pack — RT-2.26G Adaptador de Diagnóstico para Contexto TutorIA

**Status:** APPROVED FOR HOMOLOGATION

## Objetivo

Derivar um único fato de contexto do TutorIA quando um diagnóstico canônico é concluído, somente para a identidade que o concluiu e somente após a elegibilidade de contexto automático.

## Contrato da fonte

| Campo derivado | Origem canônica | Regra |
| --- | --- | --- |
| tipo de episódio, IME e estágio | `diagnostic_executions` concluído | resumo técnico, sem respostas individuais |
| sujeito | `completed_by` | nunca inferido a partir de perfil ou conversa |
| organização | `organization_id` | deve ser a mesma da política e do aceite |
| referência | `diagnostic_executions.id` | única e idempotente |

## Regras

- A derivação ocorre apenas na transição `draft` → `completed`.
- Exige política ativa e último aceite `accepted` para o sujeito.
- O resumo não inclui respostas, dimensões individuais, texto livre nem dados sensíveis.
- A referência do diagnóstico torna a operação idempotente; reexecução não duplica memória.
- A memória derivada é exibida ao membro com origem identificável e pode ser invalidada pelo próprio membro.
- A retirada do aceite bloqueia novas derivações; não apaga automaticamente os registros canônicos ou históricos existentes.

## Fora de escopo

Pulso, reanálise, ciclos, missões, ferramentas, evidências, documentos, conversas, IA generativa, notificações e qualquer aprendizado coletivo.
