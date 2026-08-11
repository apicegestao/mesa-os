# Post-Flight — CYC-2.9 Cycle Foundation

**Backlog:** CYC-2.9
**Status:** COMPLETE — PRODUCTION RELEASED
**Data:** 2026-08-11

## Implementado

- Um ciclo por organização e por prioridade confirmada.
- Início explícito pelo owner, com status ativo imediato.
- Duração fixa de 90 dias corridos e data final calculada no banco.
- Título derivado da dimensão prioritária: `Ciclo — [Dimensão]`.
- Registro rastreável de organização, prioridade, autor e criação.
- Leitura owner-only por RLS e operação transacional com grants mínimos.
- Interface para iniciar e visualizar o ciclo ativo.

## Deliberadamente não implementado

- Missões, metas, tarefas, ferramentas, recomendações ou progresso.
- Alteração, cancelamento, substituição ou conclusão manual.
- Segundo ciclo e encerramento automático após a data final.
- TutorIA e qualquer escolha ou automação de negócio adicional.

## Verificação

- ESLint e TypeScript: aprovados.
- Vitest: 6 arquivos, 13 testes aprovados.
- Next.js build de produção: aprovado.
- Migration aplicada no projeto Supabase greenfield.
- Teste transacional remoto como owner executado com rollback.
- Banco permaneceu com zero ciclos após o teste.
- RLS, função e duas restrições de unicidade cobertas por pgTAP.
- Commit funcional: `c2f2fe8b36f86dcf062d92bdc1a73c60de3916d0`.
- Deploy Netlify: `6a7b2eab8609c90008e526f6`, estado `ready`, sem erro ou segredo detectado.

## Segurança e advisors

- `start_cycle` é endpoint privilegiado intencional, disponível somente a autenticados, com `search_path` vazio e validação interna de owner ativo e prioridade pertencente à organização.
- Público e anônimo não têm execução; a tabela expõe somente leitura protegida por RLS.
- O índice novo sem uso é esperado antes do tráfego da funcionalidade.
- A proteção de senhas vazadas não se aplica ao acesso atual por magic link.

## Migration

- Local: `20260811141017_cycle_foundation.sql`.
- Aplicada remotamente como `cycle_foundation`.

## Próximo gate

Homologar em produção o início e a exibição do ciclo. Nenhuma nova feature está autorizada por este documento.
