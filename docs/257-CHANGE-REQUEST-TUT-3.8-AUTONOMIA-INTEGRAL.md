# Change Request — TUT-3.8 Autonomia integral do TutorIA

**Status:** APPROVED BY OWNER — 18/08/2026  
**Fonte:** solicitação explícita do owner; baseline `Mesa OS V2`; ADR-036 e ADR-039.

## Decisão

TutorIA é a única autoridade de guia, ensino, avaliação de evidência e continuidade metodológica do membro. Concierge atua em experiência e acompanhamento, sem substituir decisão, conteúdo ou aprovação técnica do TutorIA.

Incerteza, baixa confiança, dado ausente, risco identificado ou resposta inválida deixam de abrir fila humana. O TutorIA declara o limite, solicita complemento específico e reavalia. A liberação de Missão permanece automática, transacional e auditada, restrita a evidência aprovada com confiança alta.

## Limites preservados

- TutorIA não acessa banco diretamente; usa contratos server-side auditáveis.
- Não inventa fatos; separa fato, hipótese e dado necessário.
- Temas regulados recebem orientação gerencial conservadora e aviso de limite, sem emitir parecer profissional.
- Orçamento, rate limit, consentimento, isolamento organizacional, registros de auditoria e kill switch permanecem ativos.

## Fora do escopo

- Remover suporte de concierge para questões de experiência do cliente.
- Dar à IA poder de mudar metodologia, acesso, cobrança, dados críticos ou regras de segurança.
- Treinamento coletivo com conteúdo identificável dos membros.
