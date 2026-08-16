# Checkpoint — execução acelerada com homologação consolidada

**Status:** ACTIVE  
**Owner direction:** construir em blocos com segurança e menor custo de deploy.

## Decisão operacional

FIN-3.1C está concluído em código, migration, Edge Function e verificações automatizadas. A reentrega autenticada do evento Sandbox do Asaas não será um gate isolado nem gerará um deploy exclusivo. Ela integra o smoke final do próximo lote vertical de homologação.

## Cadência a partir deste checkpoint

1. BUILD contínuo em branch para itens já autorizados no Current Scope.
2. Validações locais obrigatórias por checkpoint técnico: migration, typecheck, lint, testes relevantes e build.
3. Um único preview quando houver conjunto coerente para revisão autenticada.
4. Um único smoke consolidado para autenticação, segregação interna, CRM/Financeiro e o fluxo Asaas Sandbox.
5. Produção permanece bloqueada até Pre-Release Review, aprovação explícita e promoção única.

## Regras de segurança que não entram em lote de espera

Falhas de isolamento organizacional, RLS, autenticação, pagamento, segredo, auditoria, perda de dados ou privilégio excessivo interrompem imediatamente o lote afetado. Elas são corrigidas e validadas antes de qualquer outro BUILD.

## Fora do escopo preservado

Sem promoção, credencial em código, cadastro público, comunicação externa, modelo de IA ativo, treinamento com dados de membros, automação autônoma ou alteração metodológica automática.
