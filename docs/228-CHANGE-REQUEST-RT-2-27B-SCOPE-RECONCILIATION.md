# GOV-CR-2.27B — Reconciliação de escopo: histórico TutorIA e visibilidade do Mentor

**Status:** APROVADO PELO OWNER E APLICADO EM HOMOLOGAÇÃO  
**Data:** 2026-08-14  
**Afeta:** `10-CURRENT-SCOPE.md`, TutorIA longitudinal e operações internas  
**Não afeta:** Constituição, produção ou políticas de isolamento entre organizações

## Motivo

O escopo corrente preservava duas proibições que conflitam com decisões posteriores, expressamente autorizadas pelo owner e já documentadas em Definition Packs:

1. vedação absoluta de histórico conversacional, apesar da autorização de Termos únicos com retenção longitudinal de conversas do TutorIA, recibo temporal e transparência ao membro;
2. restrição de Mentor à carteira atribuída, apesar do OPS-3.0C autorizar a visão metodológica global, mantendo Concierge por carteira.

Manter esses itens sem exceção explícita criaria ambiguidade de governança e dificultaria auditorias futuras.

## Decisão

### TutorIA longitudinal

É autorizada, **apenas em homologação**, a retenção de mensagens da conversa do membro com TutorIA para continuidade da experiência, desde que:

- seja coberta pelos Termos de Uso vigentes e por aceite único, versionado e temporal;
- seja isolada por identidade, organização e política de acesso;
- não seja usada como base de treino/fine-tuning, RAG compartilhado, perfilagem de outros membros ou aprendizado entre organizações;
- seja recuperada somente pelo contrato de contexto permitido, com limites, proveniência e tratamento como conteúdo não confiável;
- falhas de persistência sejam comunicadas ao membro, sem falsa indicação de histórico salvo;
- qualquer uso novo, derivação automática adicional ou compartilhamento interno exija Definition Pack e revisão específicos.

Memória estruturada continua sendo a fonte preferida para fatos e decisões; a conversa preserva continuidade, não autoridade para alterar dados, método, ciclo, evidência ou acesso.

### Mentor global

Mentor possui visão metodológica global mínima dos membros autorizados pelo OPS-3.0C, sem conteúdo bruto do TutorIA, anexos, financeiro ou poder de mudança metodológica. Concierge continua limitada à carteira atribuída e à sua capacidade operacional.

## Evidência de autorização

O owner autorizou a retenção longitudinal e a simplificação do aceite na sequência registrada desta task, incluindo “Pode seguir sem revisão”; o pacote jurídico foi revisado/autorizado antes da ativação. O owner também corrigiu expressamente o modelo de acesso: “Mentor deve ter acesso a todos os membros; divisão por carteira somente para Concierge.”

## Implementação e verificação

- Termos e retenção: Definition Pack `227-DEFINITION-PACK-UNIFIED-TERMS-AND-TUTORIA-CONVERSATION-RETENTION.md` e migration `20260814234500_tutoria_conversation_longitudinal_memory.sql` aplicadas apenas à homologação;
- UI de transparência e recuperação: `src/modules/tutoria-guidance/ui.tsx` e rota autenticada de conversa;
- isolamento: RLS e RPCs com identidade autenticada e vínculo organizacional ativo;
- Mentor: `OPS-3.0C`, RPC de visão global e interface de carteira;
- qualidade: lint, typecheck, testes e build executados a cada pacote; produção não foi promovida.

## Resultado

As proibições históricas permanecem válidas para tudo que não esteja expressamente descrito acima. Esta Change Request não libera autonomia, treinamento com dados de membros, integração externa, aprovação automática de evidência ou acesso global indiscriminado.
