# Post-Flight — reconciliação de privilégios de RPC

**Status:** concluído em homologação  
**Ambiente:** `pjkfifjcaezspwessaem` somente  
**Produção:** não alterada

## Entrega

- migration aplicada: `rpc_privilege_reconciliation`;
- 40 funções públicas que executavam como `SECURITY DEFINER` foram preservadas como contratos públicos `SECURITY INVOKER`;
- suas implementações privilegiadas foram mantidas no schema `private`;
- permissões de `PUBLIC` e `anon` foram revogadas para funções `private` e portas públicas;
- wrappers públicos necessários foram limitados a `authenticated`.

## Verificações

- simulação transacional anterior à aplicação: aprovada e revertida sem alteração;
- catálogo após aplicação: `0` funções públicas privilegiadas executáveis por `authenticated`;
- catálogo após aplicação: `0` funções `private` amplamente executáveis;
- catálogo após aplicação: `0` funções abertas a `anon` nos schemas `public` e `private`;
- chamada autenticada sem capability de CRM retornou apenas workspace vazio, sem vazamento ou erro de privilégio;
- lint, typecheck, 124 testes e build estavam verdes no checkpoint imediatamente anterior.

## Advisor

O alerta de RPC privilegiado foi eliminado. Permanece apenas o aviso de **proteção contra senhas vazadas desabilitada** no Supabase Auth. O Mesa OS usa OTP sem senha; ainda assim, a configuração será incluída no gate de preparação de produção como hardening de plataforma.

## Limites preservados

- sem mudança de produção;
- sem alteração de dados de negócio, metodologia, pagamento ou elegibilidade;
- sem comunicação externa, IA ativa ou novo papel de acesso.

## Próximo gate

Com a fronteira de privilégios corrigida, o Bloco A pode seguir para o smoke consolidado de autenticação, segregação interna, CRM, Financeiro/Asaas Sandbox, matrícula e distribuição de Concierge.
