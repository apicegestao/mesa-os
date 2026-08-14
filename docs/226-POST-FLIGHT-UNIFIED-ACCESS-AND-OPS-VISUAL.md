# Post-Flight — acesso único e experiência interna coerente

**Ambiente:** homologação  
**Status:** pronto para prévia consolidada; produção não alterada.

## Implementado

- uma entrada única em `/login` para membro e equipe;
- após OTP, perfil operacional ativo segue para `/ops`; os demais seguem para `/app`;
- a rota histórica de login interno redireciona para a entrada única;
- formulários de matrícula encaminham explicitamente a sessão autenticada, evitando perda de contexto entre navegador, rota e função;
- tipografia Arial e paleta institucional foram aplicadas à fundação visual global e ao Backoffice.

## Controles preservados

- OTP sem senha, link mágico, criação pública ou enumeração de e-mail;
- papéis, capabilities, RLS e auditoria não foram alterados;
- a função de provisionamento mantém JWT obrigatório e autorização de Admin/Concierge;
- produção permanece protegida.

## Verificação

- lint: aprovado;
- typecheck: aprovado;
- testes: 127 aprovados;
- build: aprovado.

## Próximo passo

Publicar uma única prévia consolidada, testar o acesso com e-mail já autorizado e só então criar o Admin Master em organização de demonstração.
