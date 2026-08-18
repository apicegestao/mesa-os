# DIA-3.7 / TUT-3.9 — Diagnóstico e didática do TutorIA

## Correção

O início do diagnóstico usava uma função anterior ao contrato temporal de episódios. A função passou a criar ou retomar, de forma idempotente, a execução de entrada com `episode_type`, `episode_sequence` e `effective_on` válidos.

## Qualidade do TutorIA

O contrato de resposta agora exige: resposta direta, linguagem comum, no máximo três passos práticos, explicação de termos para iniciantes e uma única pergunta de continuação quando necessária. A interface distingue visualmente “Faça assim” e “Por quê”.

## Limites preservados

Nenhuma resposta pode inventar dados da empresa. Orçamento, isolamento por organização, consentimento, auditoria e políticas server-side continuam inalterados.
