# Current Construction Scope

**Release:** V2.0  
**Sprint:** CYC-2.9 — Cycle Foundation
**Mode:** BUILD
**Status:** COMPLETE — PRODUCTION RELEASED

## Authorized

- Criar um único ciclo ativo para a organização a partir da prioridade confirmada.
- Iniciar imediatamente, com duração fixa de 90 dias corridos e término calculado automaticamente.
- Usar o título `Ciclo — [Dimensão]` e permitir acesso somente ao `owner` ativo.
- Exibir o ciclo ativo sem progresso, conclusão manual ou alteração posterior.
- Migration versionada, RLS, operação transacional, testes e documentação de encerramento.

## Not Authorized

- Journey ou jornada do membro.
- TutorIA.
- Tools ou ferramentas metodológicas.
- Concierge.
- WhatsApp.
- Dashboards de negócio.
- AI Tool Factory.
- White label.
- Cadastro público e criação automática de vínculo.
- Login por senha, login social, MFA e SSO empresarial.
- RBAC ou administração além de `owner` e `member` para acesso.
- Múltiplas organizações por identidade.
- Perfil empresarial além dos dados estritamente necessários ao diagnóstico.
- Journey, TutorIA, Tools, Concierge, WhatsApp, dashboards de negócio, AI Tool Factory e white label.
- Mês 3, 6, 9 e 12, comparação longitudinal e qualquer mecanismo de Evolução.
- Edição administrativa da metodologia.
- Reabertura, invalidação ou sobrescrita de resultado concluído.
- Participação colaborativa ou submissão por `member` neste primeiro incremento.
- Implementação do TutorIA ou desempate automático neste sprint.
- Escolha humana em caso de empate no menor score.
- Seleção de dimensão diferente da única menor candidata.
- Alteração, substituição, cancelamento ou segunda prioridade.
- Meta, Missão, ferramenta, plano de ação ou recomendação.
- Edição, cancelamento, substituição ou conclusão manual do ciclo.
- Encerramento automático do ciclo ao ultrapassar a data final.
- Segundo ciclo ou múltiplos ciclos por organização.

## Exit criteria

Migration remota aplicada; operação validada com rollback; lint, typecheck, testes e build aprovados; deploy de produção saudável; documentação canônica e Post-Flight atualizados.
