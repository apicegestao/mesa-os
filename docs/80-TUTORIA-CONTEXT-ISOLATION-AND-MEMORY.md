# TutorIA — Contexto, memória e isolamento

**Status:** definição canônica complementar — requer incremento próprio para BUILD

TutorIA é a inteligência operacional do Mesa OS. Para orientar bem, ele precisa compreender a metodologia, os dados autorizados da empresa, o momento da jornada, ferramentas, compromissos, evidências, métricas e interações relevantes. Isso não autoriza acesso indiscriminado nem mistura de dados entre empresas.

## Princípio de isolamento

Todo contexto operacional do TutorIA é vinculado a uma organização e montado sob uma finalidade explícita. Uma empresa nunca recebe fatos, documentos, conversas, indicadores, nomes, benchmarks identificáveis ou memória de outra empresa.

O banco canônico continua sendo a fonte de verdade. TutorIA recebe apenas um pacote de contexto mínimo, autorizado e auditável; não consulta tabelas arbitrariamente.

## Escopos de conhecimento e memória

| Escopo | Conteúdo permitido | Regra de uso |
| --- | --- | --- |
| Metodologia | Mapa 4 × 4, playbooks, rubricas, políticas e conteúdos publicados | Compartilhável por ser institucional e versionado. |
| Organização | Diagnóstico, ciclo, Missões, ferramentas, evidências, métricas e compromissos da própria empresa | Obrigatoriamente filtrado por `organization_id`. |
| Membro | Preferências, responsabilidades, consentimentos e interações pertinentes | Visível somente se o vínculo e a finalidade autorizarem. |
| Aprendizado coletivo | Apenas padrões agregados, desidentificados e aprovados por governança | Nunca utiliza conteúdo bruto ou identificadores de outra organização. |

Chat bruto não é memória canônica. Qualquer memória útil deve ser estruturada, ter fonte, escopo, confiança, validade e trilha de auditoria.

## Contexto mínimo por ação

Cada solicitação informa: ator, organização, objetivo, escopo de dados, revisão metodológica, política aplicável, ferramentas autorizadas e limite de retenção. O orquestrador rejeita contextos sem organização válida ou que tentem atravessar o limite da organização.

## Proatividade e autonomia

Proatividade não significa liberdade irrestrita. Uma iniciativa do TutorIA só ocorre se evento, consentimento, canal, prioridade, frequência e cooldown permitirem. Ações de baixo risco podem ser automáticas; decisões de impacto, comunicação externa ou baixa confiança exigem confirmação, escalonamento humano ou ambos.

## Auditoria e direito de correção

Toda orientação ou ação relevante precisa registrar, sem expor dados sensíveis desnecessários: fontes consultadas, versão de contexto e política, modelo/rota, confiança, tools executadas, resultado, custo/latência e eventual escalonamento. O membro pode corrigir uma informação; a correção cria novo registro, preservando a origem histórica.

## Limite atual

O RT-2.20 cria apenas os contratos de metodologia, métricas, evidências e revisão. Ele ainda não ativa modelo de IA, memória conversacional, aprendizado coletivo, mensagens proativas ou WhatsApp. A ativação depende de Definition Pack, consentimentos, Tool Gateway e avaliação de segurança próprios.
