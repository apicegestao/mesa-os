# Current Construction Scope

**Release:** V2.0  
**Sprint:** PRI-2.7 — Priority Foundation
**Mode:** BUILD
**Status:** COMPLETE — PRODUCTION RELEASED

## Authorized

- Identificar menor score dimensional do diagnóstico concluído.
- Sem empate: owner confirma a dimensão candidata com justificativa curta obrigatória.
- Persistir uma prioridade imutável e rastreável à execução, dimensão, score, autor e data.
- Em empate: exibir estado `Aguardando desempate TutorIA`, sem escolha ou persistência humana.
- RLS, grants mínimos, função transacional, testes e Post-Flight.
- Experiência de próxima ação sem dashboard e sem antecipar Ciclo.

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
- Prazo, meta, Ciclo, Missão, ferramenta, plano de ação ou recomendação.

## Exit criteria

Feature Spec aprovada; Pre-Flight BUILD; prioridade rastreável e imutável; empate bloqueado para futuro TutorIA; isolamento organizacional; lint, typecheck, testes, build e banco aprovados; migration e deploy após gates; Post-Flight entregue.
