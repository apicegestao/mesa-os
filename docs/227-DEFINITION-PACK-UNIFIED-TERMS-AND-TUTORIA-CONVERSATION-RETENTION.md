# Definition Pack — Termos unificados e retenção de conversa do TutorIA

**Status:** DRAFT — revisão jurídica obrigatória antes de publicação ou ativação  
**Origem:** solicitação expressa do responsável do produto em 14 de agosto de 2026  
**Autoridade consultada:** `00-CONSTITUTION.md`, `08-ADR-DECISION-LOG.md`, `09-CONSTRUCTION-PROTOCOL.md`, `10-CURRENT-SCOPE.md`, termos `mesa_os_terms` v1.

## Decisão de experiência já aplicável

O acesso usa um único Termo de Uso versionado. No primeiro acesso, ou quando houver uma versão materialmente nova, o membro vê o texto, marca uma única caixa de confirmação e seleciona **Aceitar e continuar**. Não há aceite fragmentado por funcionalidade.

O recibo continua a guardar identidade autenticada, versão, hash e data/hora. Preferências e direitos posteriores — por exemplo, retirar uma personalização futura — não são novos aceites e não reduzem a validade do recibo original.

## Mudança proposta para revisão jurídica

A versão v1 dos Termos exclui conversas livres da memória automática. A proposta para uma versão futura é permitir a retenção privada de conversas do TutorIA para continuidade longitudinal do próprio membro, limitada a:

- organização e identidade que originaram a conversa;
- finalidade de continuidade da tutoria e apoio ao membro;
- ausência de uso para treinamento ou fine-tuning entre organizações;
- isolamento técnico por RLS, sem acesso de outra organização;
- auditoria de leitura pelo TutorIA;
- política explícita de retenção, eliminação, exportação e acesso interno;
- novo aceite da versão publicada antes da ativação.

## Fora de escopo desta etapa

- publicação dos novos Termos;
- retenção persistente de transcrições brutas;
- envio de conversas a provedores ou a sistemas externos adicionais;
- uso das conversas para inteligência coletiva identificável;
- mudança de produção.

## Próximo gate permitido

Revisão jurídica da versão proposta dos Termos e aprovação explícita da política de retenção. Depois: Definition Pack técnico, migration aditiva, RLS, auditoria, testes de isolamento, homologação e somente então publicação da nova versão para reaceite.
