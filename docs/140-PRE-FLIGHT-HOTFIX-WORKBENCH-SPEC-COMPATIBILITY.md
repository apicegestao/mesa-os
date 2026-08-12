# Pre-Flight — Hotfix de Compatibilidade do Workbench

**Item:** HOTFIX-WB-01  
**Motivo:** o preview consolidado falha ao carregar uma especificação RACI/SWOT publicada, embora o build esteja verde.

## Escopo

- Normalizar, somente em leitura, os nomes técnicos persistidos de configuração de campos repetíveis para o contrato tipado da interface.
- Adicionar regressão para uma especificação de entradas estruturadas.

## Fora do escopo

- Alterações em migrations, banco, RLS, ferramentas publicadas, payloads de membros, IA, deploy de produção ou dados de QA.

## Critérios de aceite

- A especificação persistida RACI/SWOT é validada sem aceitar propriedades arbitrárias.
- O preview deixa de retornar erro de servidor em `/app`.
- Typecheck, testes, lint e build passam antes de novo push.
