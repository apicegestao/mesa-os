# MTH-3.4C — Gate de revisão e publicação editorial

**Status:** APPROVED FOR BUILD — homologação somente

## Decisão

Admin revisa a unidade editorial interna, seus vínculos e os estados das Ferramentas. A publicação é uma ação explícita, atômica e auditada. Não há botão de publicação para Mentor, Concierge, Comercial, Financeiro ou Intelligence.

## Regras

1. somente uma unidade `draft` integral e vinculada a pelo menos uma Ferramenta pode ser publicada;
2. ao publicar, a unidade e suas Ferramentas vinculadas ainda em `draft` passam a `published` na mesma transação;
3. ferramentas já publicadas são preservadas; revisões `retired` bloqueiam a operação;
4. o conteúdo não é reescrito: apenas a transição única de `draft` para `published` é permitida;
5. a operação produz evento de auditoria interna com código e versão, sem conteúdo de membro;
6. o endpoint de interface recusa execução quando o ambiente público for `production`.

## Fora de escopo

- publicação em produção;
- edição de conteúdo no navegador;
- aprovação automática por IA/Intelligence;
- mudança de missão, ciclo, métrica ou progresso do membro.
