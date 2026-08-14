# Security Review — OPS-3.0A CRM RPCs

**Environment:** homologação `pjkfifjcaezspwessaem`
**Status:** reviewed; preview/smoke still pending

## Resultados verificados

- As oito tabelas novas de acesso e CRM têm RLS habilitado.
- `authenticated` não possui `SELECT` nem `INSERT` direto nessas tabelas.
- Não há segredo, integração Meta, pagamento, dado metodológico, contexto TutorIA ou dado de evolução no novo domínio.
- As migrations `ops_3_0a_crm_foundation` e `ops_3_0a_crm_handoff_controls` estão aplicadas somente em homologação.

## Alertas do Security Advisor

O Advisor aponta funções `SECURITY DEFINER` executáveis por `authenticated`. Isso é esperado para os RPCs internos que precisam escrever em tabelas deliberadamente sem grants diretos. Não é uma liberação baseada somente em estar autenticado: cada função verifica `auth.uid()`, `internal_operator`, role/capability interna e, quando pertinente, carteira ou Concierge atribuído.

As funções novas cobertas são: bootstrap do primeiro Admin, atribuição de role, consulta de estado interno/carteira, criação de oportunidade, transição de etapa, handoff e aceite de handoff. As funções de matrícula/revogação existentes foram reforçadas para exigir `manage_enrollments`, concedida apenas a Admin e Concierge.

Controles obrigatórios aplicados:

1. `revoke ... from public` e de `anon`; `grant execute` somente a `authenticated`.
2. `set search_path = ''`, validação de entrada e `auth.uid()` em toda função mutante.
3. capability interna consultada no banco, nunca em metadados editáveis do usuário.
4. RLS e ausência de grants diretos como defesa em profundidade.
5. auditoria de bootstrap, role, oportunidade, handoff e matrícula/revogação.

## Exceção e gate

Os alertas permanecem como exceção intencional, semelhante aos quatro RPCs IAM-2.29 previamente revisados. Antes de preview ou promoção, o gate exige smoke de Admin, Comercial, Concierge e negação, além da confirmação de que nenhum RPC novo permite leitura/escrita fora da capability atribuída. A proteção contra senha vazada permanece um alerta de configuração já existente e não é relevante ao fluxo OTP, mas continua pendente de decisão operacional para produção.
