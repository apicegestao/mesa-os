# Definition Pack — RT-2.21 TutorIA Foundation

**Status:** APPROVED — owner, 2026-08-11  
**Modo:** BUILD  
**Autoridade de BUILD:** limitada estritamente a este pacote

## Objetivo

Construir a primeira fundação confiável do TutorIA como centro operacional da Mesa dos Donos, sem ativar modelo de IA, automações ou comunicação externa. O resultado é uma camada segura que sabe qual contexto pode ser usado, quais ações são permitidas e como cada decisão é auditada.

## Source Decisions Consulted

- SRC-001 — conversa `Mesa OS V2`, registrada em `docs/63-SOURCE-RECOVERY-MESA-OS-V2.md` e `docs/65-APPROVED-PRODUCT-SOURCE-REGISTER.md`.
- `docs/67-TUTORIA-CANONICAL-ARCHITECTURE.md` — TutorIA como centro da experiência e sequenciamento mínimo.
- `docs/68-METHODOLOGY-4X4-RECONCILIATION.md` — mapa 4 × 4 e progresso baseado em implementação/evidência.
- `docs/80-TUTORIA-CONTEXT-ISOLATION-AND-MEMORY.md` — isolamento, memória e uso permitido de contexto.
- `docs/81-RPC-PRIVILEGE-BOUNDARY-REVIEW.md` — fronteira de privilégios e gateways.

## Escopo proposto

### TCF-2.21A — pacote de contexto mínimo e isolado

- Contrato tipado para contexto de organização, membro, ciclo, missão, ferramenta, evidência, métricas e metodologia publicada.
- Montagem server-side, por finalidade explícita e sob identidade autenticada.
- Cada pacote informa fontes, versão metodológica, data de observação e campos ausentes; ausência nunca é preenchida por inferência.
- Nenhuma leitura cruza organizações, membros ou ciclos sem vínculo canônico e política correspondente.

### TCF-2.21B — policy engine e gateway de ferramentas

- Catálogo allow-list de operações de leitura com entrada, saída, escopo organizacional, risco e auditoria declarados.
- A aplicação e futuros modelos acessam dados exclusivamente por esse gateway; não haverá acesso arbitrário ao banco.
- Decisões de política retornam `allow`, `deny` ou `escalate`, com motivo rastreável.

### TCF-2.21C — trilha de auditoria e observabilidade

- Registro imutável de montagem de contexto, decisão de política, tool solicitada, resultado resumido, falha e escalonamento.
- Sem texto de conversa, conteúdo sensível ou segredo no log.
- Métricas operacionais: negações por política, falhas de gateway, latência e volume por organização.

### TCF-2.21D — presença contextual honesta

- CTA unificado de TutorIA nos pontos aprovados da experiência, conectado ao contexto permitido da tela.
- Enquanto não houver modelo autorizado, a interface declara que a orientação assistida está em preparação; não simula uma resposta de IA, recomendação ou validação.

## Dados e segurança

- Novas tabelas públicas, se necessárias, terão RLS, grants mínimos e políticas organizacionais explícitas.
- Código privilegiado fica em schema não exposto, com `search_path` restrito, checks de identidade e sem `EXECUTE` para `PUBLIC`.
- Contexto de uma organização não é reutilizável por outra. Aprendizado coletivo, se existir no futuro, exige agregação/desidentificação e autorização própria.
- Dados brutos de cliente, evidências, ferramentas e conversas não entram em prompts, logs ou memória sem finalidade, política e consentimento definidos.

## Fora do escopo

- Provedor, modelo, chave de IA, prompt de produção, RAG ou geração de respostas.
- Chat livre, memória conversacional executável ou aprendizagem entre membros.
- Validação autônoma de evidências, alteração de status, desempate, aprovação ou desbloqueio.
- Criação de DRE, RACI, SWOT ou qualquer ferramenta; exportação PDF/XLSX.
- WhatsApp, e-mail proativo, scheduler, automação, webhook ou integração de canal.
- Acesso de TutorIA direto ao banco, dados de outra organização ou ações sem confirmação/política.
- Alteração de produção ou promoção do RT-2.20.

## Critérios de aceite propostos

1. Um membro autenticado recebe apenas o pacote mínimo autorizado de sua organização.
2. Uma tentativa de leitura fora do vínculo organizacional é negada e auditada.
3. Toda tool registrada pertence ao catálogo e produz resultado tipado ou falha explícita.
4. Logs não contêm segredos, dados de outra organização ou conteúdo integral de evidência.
5. A CTA do TutorIA jamais afirma ter analisado, aprovado ou recomendado algo sem capacidade ativa autorizada.
6. RLS, grants, testes de isolamento, lint, typecheck, build e advisor de segurança passam antes de qualquer promoção.

## Decisões submetidas à aprovação

- Adotar este Release Train como a próxima etapa de BUILD após o fechamento do RT-2.20.
- Manter o primeiro incremento de TutorIA estritamente sem modelo e sem comunicação externa.
- Tratar `deny` e `escalate` como resultados obrigatórios do policy engine, nunca como falhas silenciosas.
- Exigir um Definition Pack separado para modelo/IA, memória, validação de evidências, criação de ferramentas e automações.

## Sequência após aprovação

1. Alignment Check e Pre-Flight específicos.
2. Schema e contratos de contexto, isolados em branch Supabase de teste.
3. Gateway, políticas, auditoria e testes de isolamento.
4. CTA contextual honesta e observabilidade.
5. Preview isolado, Post-Flight e somente então decisão de promoção.
