# Post-Flight — Smoke Autenticado do Train 1

**Status:** PARTIAL PASS — novo preview consolidado necessário  
**Ambiente:** homologação isolada  
**Produção:** não alterada

## Fixture

- Foi criada uma identidade sintética, confirmada sem envio de e-mail.
- A identidade recebeu uma organização de QA própria e vínculo `owner` ativo.
- Nenhuma identidade, organização, sessão ou registro de membro foi usado no smoke.

## Verificações aprovadas

- Login direto por senha no preview de homologação.
- A área autenticada carregou com a organização sintética.
- Hoje, Jornada, Diagnósticos, Evidências, Evolução e Conta e segurança responderam sem erro e preservaram estados honestos de ausência de dados.

## Limite encontrado

O deploy preview atual corresponde a uma revisão anterior da branch. Ele permite confirmar login e isolamento, mas não contém os commits posteriores de contexto longitudinal, recibos de Termos e RT-2.27A. Portanto, não é evidência suficiente para o Train 1 completo.

## Próximo passo permitido

Publicar a branch já revisada para reconstruir **um único** preview consolidado. Repetir o smoke com a mesma fixture e somente então reavaliar os gates de promoção. Produção permanece bloqueada.
