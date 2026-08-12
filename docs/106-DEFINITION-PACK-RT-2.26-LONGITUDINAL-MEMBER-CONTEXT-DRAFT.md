# Definition Pack — RT-2.26 Contexto Longitudinal do Membro

**Status:** APPROVED — owner approval recorded on 2026-08-12

## Decisão de produto recuperada

A conversa fonte `Mesa OS V2` define TutorIA como centro operacional: ele conhece profundamente a metodologia e o contexto autorizado do membro, acompanha jornada, decisões e compromissos. Também define que memória é longitudinal, estruturada, temporal, corrigível e distinta de histórico bruto de chat.

Este pacote reconcilia essa visão com ADR-036, ADR-039, `docs/80-TUTORIA-CONTEXT-ISOLATION-AND-MEMORY.md`, o Mapa de Desenvolvimento e o plano Mesa OS Intelligence.

## Modelo de continuidade em 12 meses e renovações

O vínculo não cria uma empresa nova a cada ciclo anual. A organização preserva sua linha do tempo canônica: diagnósticos, ciclos sequenciais, prioridades, Missões, ferramentas, evidências, métricas, documentos gerados e evolução. No fechamento de cada ciclo, o sistema cria um snapshot de referência; a reentrada em um novo ciclo usa o histórico como contexto, sem reescrever a linha de base nem os registros anteriores.

O TutorIA recebe somente um pacote mínimo para a finalidade atual. Assim, ele pode reconhecer progresso, lacunas persistentes, compromissos e decisões anteriores sem despejar toda a história em cada conversa.

## TCM-2.26A — Fonte de verdade longitudinal

- Consolidar a leitura de dados já canônicos por organização, período e revisão metodológica.
- Preservar imutabilidade de diagnósticos, evidências e snapshots; correções criam nova versão, nunca sobrescrevem a história.
- Exibir ao membro uma linha do tempo compreensível e seleção segura de período/ciclo.

## TCM-2.26B — Memória estruturada da TutorIA

Cada memória tem, no mínimo: organização, sujeito, tipo, conteúdo estruturado, fonte, referência de origem, confiança, validade, estado (`ativa`, `substituída`, `expirada` ou `contestada`), versão, data e autor da alteração.

Categorias iniciais permitidas:

1. fato estável do perfil ou empresa;
2. decisão registrada e respectiva premissa;
3. compromisso e seu estado;
4. lacuna de aprendizagem ou nível de domínio;
5. preferência de condução explicitamente declarada pelo membro.

Dados já estruturados no Mesa OS podem compor contexto de leitura sem duplicação. Informação extraída de conversa só vira memória quando a TutorIA a propõe com fonte e o membro confirma, edita ou recusa. Chat bruto continua fora da memória canônica e não entra em treinamento.

## TCM-2.26C — Recuperação, correção e transparência

- Cada chamada declara finalidade, organização, identidade, fontes e limite de retenção.
- O membro pode ver, corrigir, invalidar ou pedir remoção de uma memória que lhe diga respeito; a correção preserva o histórico de origem.
- A recuperação é limitada por relevância, recência, confiança e objetivo atual; não existe acesso genérico ao banco nem contexto de outra organização.
- Auditoria registra metadados da decisão de recuperação, nunca conteúdo sensível ou conversa integral.

## TCM-2.26D — Mesa OS Intelligence, plano interno separado

Mesa OS Intelligence não recebe nem cruza perfis identificáveis de membros como padrão. Ele usa apenas métricas estruturadas agregadas, desidentificadas e aprovadas, para descobrir lacunas recorrentes, melhorar conteúdos, ferramentas, palestras e encontros. Publicações e ações continuam sob revisão humana.

Não haverá fine-tuning com dados de membros na primeira fase. Melhorias do TutorIA virão de metodologia versionada, avaliações sintéticas, feedback explícito e padrões agregados aprovados.

## Proteções obrigatórias

- Isolamento por `organization_id`, identidade e finalidade em todas as leituras e escritas.
- Sem conversa bruta como memória ou corpus implícito de treinamento.
- Sem compartilhamento identificável entre organizações, provedor ou equipe interna sem base legal, contrato e gate próprios.
- Retenção, exclusão, exportação e papéis internos definidos antes da ativação; nenhuma duração é inventada neste pacote.
- Consentimento e confirmação para memória derivada de conversa; acesso administrativo exige RBAC, MFA e auditoria em incremento separado.
- Baixa confiança, conflito ou informação sensível exigem pergunta, confirmação ou escalonamento — não gravação automática.

## Fora do escopo

- WhatsApp, proatividade externa, RAG amplo, embeddings, fine-tuning, observação de colaboradores, perfil comportamental oculto e acesso operacional ao Mesa OS Intelligence.
- Reuso de conteúdo ou conversa de um membro para atender outro.
- Promoção para produção.

## Critérios de aceite

1. O membro renovado mantém história por ciclos sem alteração retroativa de registros.
2. TutorIA usa apenas contexto próprio, mínimo e justificável.
3. Memória de conversa exige confirmação e é corrigível/versionada.
4. A interface mostra ao membro as memórias ativas e sua origem.
5. Mesa OS Intelligence só trabalha com dados agregados, desidentificados e sujeitos a supressão de grupos pequenos.
6. Testes provam isolamento, autorização, versionamento, expiração, correção e ausência de vazamento entre organizações.

## Autorização de BUILD

O BUILD inicia pela fonte de verdade longitudinal e pelo contrato de memória confirmável. Ativação de memória automática, inteligência interna, comunicação externa e produção continuam bloqueadas.
