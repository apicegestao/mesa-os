# 243 — Correção dos wrappers ativos do membro

**Status:** aplicada e verificada em homologação (`pjkfifjcaezspwessaem`)  
**Data:** 15 de agosto de 2026  
**Escopo:** corretivo técnico; não altera escopo de produto nem produção.

## Contexto

Três fluxos ativos do ambiente de membro usam wrappers de banco orientados à
identidade do usuário. As implementações privadas correspondentes não possuíam
permissão de execução para o papel `authenticated`, impedindo que os wrappers
concluíssem o trabalho mesmo com uma sessão válida.

## Correção autorizada

Foi concedida execução exclusivamente ao papel `authenticated` para:

1. `private.save_workbench_tool_draft(uuid, jsonb)`;
2. `private.save_my_tutoria_memory(uuid, public.tutoria_memory_kind, text, smallint, timestamptz)`;
3. `private.invalidate_my_tutoria_memory(uuid)`.

Não foi concedido acesso ao papel `anon`. A mudança foi aplicada somente em
homologação pela migration `20260815041200_rpc_active_member_private_grants.sql`.

## Garantias preservadas

As três implementações verificam a identidade autenticada e o escopo
organizacional antes de gravar ou invalidar dados. Portanto, a permissão técnica
não cria acesso entre membros ou entre organizações.

## Verificações pós-aplicação

- Os três objetos ficaram executáveis por `authenticated`.
- Os três permaneceram sem execução para `anon`.
- A inspeção das implementações confirmou validações de identidade e organização.
- O Security Advisor não apontou nova exposição decorrente desta correção. Permanece
  apenas o aviso já conhecido de proteção contra senhas vazadas, não aplicável ao
  fluxo atual de acesso por código.

## Próximo uso

Os fluxos de rascunho de ferramenta e memória longitudinal do TutorIA podem ser
validados no roteiro de homologação do membro. Qualquer promoção para produção
continua sujeita ao gate de publicação definido pela governança.
