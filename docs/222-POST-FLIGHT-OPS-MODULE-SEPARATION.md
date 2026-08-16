# Post-Flight — separação de módulos do Backoffice

**Status:** BUILD concluído localmente; aguardando o preview consolidado  
**Ambiente de destino:** homologação somente  
**Produção:** não alterada

## Entrega

- `/ops` passa a abrir no CRM como superfície principal;
- CRM preserva o Kanban por empresa, nova oportunidade, fluxo comercial e leitura agregada de Intelligence;
- Carteira, Suporte, Financeiro, Intelligence e Acessos foram separados por navegação e capability;
- cada módulo consulta apenas os dados necessários à sua tela;
- o acesso ao ambiente de membro continua separado e explícito.

## Validação local

- lint aprovado;
- typecheck aprovado;
- 124 testes aprovados;
- build de produção aprovado.

## Limites preservados

- sem nova permissão, papel, migration ou alteração de RLS;
- sem deploy e sem produção;
- sem mudança de CRM, pagamento, metodologia ou Intelligence além da organização de superfície.
