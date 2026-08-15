# Revisão de Consolidação RT-2.27C

**Status:** concluída para o escopo revisado em homologação  
**Data:** 2026-08-14  
**Ambiente verificado:** homologação (`pjkfifjcaezspwessaem`)  
**Produção:** não alterada

## Objetivo

Revisar a base ativa após os incrementos de acesso, operação interna, financeiro, contexto longitudinal e autonomia graduada de Evidências. A revisão cobre coerência de migrations, fronteiras de privilégio, IA, custos, isolamento, duplicidades de código e usabilidade sem redesenho visual.

## Correções realizadas

| Achado | Risco | Correção | Situação |
|---|---|---|---|
| A migration privada de decisão de Evidência também declarava o wrapper público, que já existe em migration posterior | Uma instalação limpa falharia por criação duplicada de função | Mantida a camada privada na migration original e o wrapper público em migration própria | Corrigido |
| Avaliação de Evidência chamava modelo sem a guarda própria de teto de custo | Custo não governado por chamada | Criado teto independente de Evidências, reserva anterior e liquidação posterior do orçamento | Corrigido |
| Avaliação de Evidência não era explicitamente limitada à homologação | Risco de ativação fora do ambiente autorizado | Rota e escritor server-side bloqueiam qualquer ambiente diferente de `staging` | Corrigido |
| Avaliação de Evidência não confirmava aceite vigente antes da automação | Decisão sem base de consentimento atual | Aceite ativo e contexto automático habilitado passaram a ser pré-condições | Corrigido |
| Avaliação de Evidência não comprovava de forma explícita identidade, organização, autoria e estado pendente | Tentativa de revisar evidência inadequada ou já decidida | A rota valida vínculo ativo, mesma organização, mesmo autor e estado `submitted` | Corrigido |
| Uso de IA de Evidência não alimentava as métricas internas | Falta de rastreabilidade de custo e resultado | Cada resultado registra tokens, custo estimado, rota e resolução em `ai_usage_events` | Corrigido |

## Verificações de segurança

- A função privada que altera a decisão de Evidência não concede execução a navegador, usuário autenticado ou papel anônimo.
- O wrapper público correspondente está disponível somente para `service_role`; a rota autenticada não repassa entrada diretamente para a função privilegiada.
- A decisão permanece determinística: o modelo fornece sinais estruturados; a política local decide `approved`, `changes_requested` ou `escalated`.
- Falha de modelo, saída inválida, orçamento insuficiente ou erro de escrita não aprovam nem avançam Missão.
- Limite operacional: até quatro avaliações de Evidência por membro/organização/minuto, além do teto mensal individual já existente.
- Secret de serviço continua exclusivamente server-side; não há nova variável `NEXT_PUBLIC` sensível.

## Resultado do Security Advisor

O Advisor de segurança da homologação reportou somente `auth_leaked_password_protection` como advertência. O Mesa OS não utiliza senhas: o acesso vigente é por código temporário enviado por e-mail. Portanto, não há ação funcional necessária neste release. Caso uma modalidade de senha seja autorizada no futuro, a proteção contra senhas vazadas deverá ser habilitada antes da ativação.

## Qualidade verificada

- testes automatizados: 49 arquivos e 137 testes aprovados;
- typecheck aprovado;
- migrations ordenadas sem duplicidade de função na instalação limpa;
- decisão privilegiada conferida no banco de homologação: execução somente por `service_role` e administração do banco.

## Limites que permanecem intencionais

- a autonomia de Evidência continua exclusiva de homologação;
- não há anexos, OCR, documentos externos, WhatsApp ou comunicação proativa neste incremento;
- não existe promoção automática para produção;
- reabertura/reversão humana, suspensão por taxa de reversão e fila operacional detalhada são a próxima camada necessária antes de considerar promoção.

## Próximo bloco permitido

Completar a camada de operação humana para Evidências: fila mínima, reversão auditada e medição de taxa de reversão, seguida de smoke consolidado de membro e equipe em homologação. Nenhuma mudança visual estrutural é necessária para esse bloco.
