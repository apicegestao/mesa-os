# MTH-3.4B — Workspace estruturado para Ferramentas editoriais publicadas

**Status:** APPROVED FOR BUILD — homologação somente

## Objetivo

Permitir que uma ferramenta editorial já publicada seja carregada no workspace do Mesa OS sem duplicar formulários por ferramenta e sem expor rascunhos editoriais.

## Contrato

- a fonte de campos é a revisão versionada de `workbench_tool_revisions`;
- a interface aceita texto, número, moeda, data, escolha e listas estruturadas;
- a mesma validação canônica ocorre no cliente e no servidor antes do rascunho persistir;
- PDF/XLSX derivam do rascunho salvo e preservam código e versão da ferramenta;
- uma revisão `draft` ou `retired` não é carregada nem exportada pelo membro;
- não há análise ativa, aprovação, mudança de progresso ou publicação editorial neste incremento.

## Escopo inicial

- `sales_funnel_value_v1` — Funil comercial e proposta;
- `critical_process_map_v1` — Mapa de processo crítico.

Ambas as revisões permanecem em `draft` até revisão editorial e decisão explícita de publicação. DRE e Mapa de Papéis preservam seus workspaces especializados existentes.

## Fora de escopo

- publicação de conteúdo ou Ferramenta;
- edição administrativa da metodologia;
- decisões automáticas do TutorIA;
- inclusão do CRM comercial como fonte de dados da ferramenta do membro;
- qualquer alteração de produção.
