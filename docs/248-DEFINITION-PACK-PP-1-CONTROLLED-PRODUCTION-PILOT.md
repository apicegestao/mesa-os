# Definition Pack PP-1 — Piloto T1 controlado em produção

**Status:** DRAFT — aguardando confirmação de restauração, aprovação explícita e janela de promoção  
**Data:** 16 de agosto de 2026  
**Base:** CP-03, Constitution, Scope Lock, ADR-003, ADR-004, ADR-033, ADR-036,
ADR-039, ADR-040, ADR-041, Current Scope e conversa-fonte `Mesa OS V2`.

## 1. Decisão proposta

Promover a experiência essencial do membro T1 para produção como um piloto
acompanhado de **três a cinco organizações**, sem transformar a produção em um
ambiente de testes e sem promover CRM, financeiro, checkout, Intelligence ativa ou
automação externa.

O caminho validado será:

`OTP autorizado → Termos → Raio-X → prioridade → ciclo → missão → ferramenta → implementação → evidência → evolução`.

TutorIA mantém conversa e memória longitudinal sob os Termos vigentes. Nenhum
provedor de IA pago, decisão autônoma ou validação de evidência por modelo é ativado
por este pacote.

## 2. O que entra

- controles de matrícula e segregação membro/equipe necessários ao piloto;
- um acesso administrativo interno estritamente necessário para publicar os quatro
  itens editoriais T1 e acompanhar o piloto;
- contexto longitudinal e persistência da conversa do TutorIA;
- base editorial T1 e publicação explícita/auditada das quatro unidades;
- correções de privilégios necessárias para salvar rascunhos e memória do membro;
- observabilidade de ativação, falhas de acesso, suporte, ferramentas, evidências e
  custo de IA (sem chamada de modelo pago).

## 3. O que não entra

- CRM, Kanban, propostas, carteira, concierge automático ou qualquer tela comercial;
- Asaas, checkout, cobrança, produto, entitlement financeiro ou webhook;
- Intelligence ativa, recomendações automáticas ou publicação automática;
- WhatsApp, Instagram, proatividade ou outro canal externo;
- especialistas, Thor, novos prompts produtivos ou novos fornecedores de IA;
- T2–T4, liberação geral, white label ou mudanças de método sem publicação explícita.

## 4. Dependência encontrada e tratamento

A fundação de papéis internos (`internal_staff_role`, atribuições e trilha de
auditoria) foi criada inicialmente no train técnico de CRM. Ela é necessária ao
gate editorial administrativo, mas **não obriga a disponibilizar CRM**.

PP-1 poderá levar essa fundação técnica de IAM para dar ao Admin o papel mínimo de
publicação e suporte. As superfícies CRM/Financeiro continuam fora do fluxo, sem
convites a Comercial/Financeiro e sem dados ou operações comerciais no piloto.

## 5. Lista ordenada de migrations candidatas

Esta é a lista mínima analisada a partir da produção atual (53 migrations) e da
homologação. A aplicação só ocorre após uma revisão final da lista no projeto de
produção; migrations não relacionadas seguem fora do trem.

| Ordem | Migration | Motivo |
|---:|---|---|
| 1 | `20260813204800_iam_2_28_enrollment_advisor_hardening` | nega acesso direto a matrículas e auditoria |
| 2 | `20260813214349_iam_2_29_segregated_access` | separa membro e operação interna |
| 3 | `20260813214746_iam_2_29_rpc_privileges_hardening` | remove execução anônima dos RPCs internos |
| 4 | `20260814030312_ops_3_0a_crm_foundation` | somente fundação de papéis/auditoria internos exigida pelos gates; CRM permanece não habilitado no piloto |
| 5 | `20260814223000_internal_staff_enrollment` | matrícula auditada de Admin interno |
| 6 | `20260814234500_tutoria_conversation_longitudinal_memory` | continuidade de conversa, termos e memória privada |
| 7 | `20260815030000_mth_3_4a_editorial_curriculum_foundation` | quatro unidades T1 em rascunho, ligadas a ferramentas |
| 8 | `20260815030100_mth_3_4a_editorial_rls_denial` | defesa em profundidade dos rascunhos editoriais |
| 9 | `20260815033000_mth_3_4c_editorial_release_gate` | publicação editorial atômica e somente Admin |
| 10 | `20260815040000_mth_3_4e_editorial_guide_sync` | versão editorial T1 completa |
| 11 | `20260815041000_mth_3_4c_editorial_workspace_rpc_grant` | corrige wrapper do workspace editorial |
| 12 | `20260815041100_mth_3_4c_editorial_publish_rpc_grant` | corrige wrapper de publicação editorial |
| 13 | `20260815041200_rpc_active_member_private_grants` | restaura wrappers privados de rascunho e memória, mantendo as verificações internas |

As migrations de CRM posteriores, financeiro, suporte, Intelligence e EVD-AI não
fazem parte de PP-1. A evidência do piloto segue o fluxo estruturado já existente;
avaliação por IA e escalonamento humano automatizado continuam em homologação.

## 6. Pré-flight obrigatório

1. Owner confirma que existe backup/restauração utilizável do Supabase de produção.
2. Comparar, no projeto de produção, o histórico real com a lista acima e parar se
   houver qualquer diferença não explicada.
3. Confirmar presença — sem revelar valores — de URL, publishable key, segredo de
   sessão/servidor e configuração SMTP/OTP de produção.
4. Validar CI completo no commit exato do train, segredo ausente do repositório e
   Security Advisor sem alerta novo.
5. Criar uma organização de demonstração e uma matrícula de teste controlada; não
   convidar membro real antes de o smoke passar.

## 7. Execução e parada

- Um merge e um deploy de produção; migrations são aditivas e executadas uma vez.
- Publicar explicitamente as quatro unidades T1 somente após o schema e o Admin
  serem verificados.
- Fazer smoke com a organização de demonstração antes de qualquer convite real.
- Parar antes de convidar membros se houver erro de migration, falha de OTP/termos,
  erro de RLS/RPC, diferença de schema, falha de build, alerta de segurança novo ou
  falha de persistência de conversa.

## 8. Smoke pós-release

1. login OTP de membro autorizado e bloqueio de e-mail não autorizado;
2. aceite único de termos e recebimento de comprovante;
3. início e conclusão do Raio-X, prioridade e ciclo;
4. ferramenta T1: salvar, retornar após novo login e confirmar implementação;
5. registrar Evidência e conferir estado/linha de evolução;
6. abrir, retomar e validar isolamento da conversa TutorIA;
7. login de Admin, publicação auditada e ausência de acesso direto a dados;
8. logs sem segredo, custo de IA nulo ou marcado como não acionado.

## 9. Rollback e recuperação

Não há rollback destrutivo de migrations em produção. Em falha:

1. interromper convites e novas publicações;
2. desativar a rota/superfície afetada por configuração ou hotfix mínimo;
3. preservar logs e evidências do incidente;
4. restaurar somente pelo ponto confirmado se a integridade exigir;
5. registrar Post-Flight de interrupção antes de retomar.

## 10. Aprovação necessária

Para transformar este rascunho em execução, o owner precisa confirmar os dois
gates separadamente:

1. que há backup/ponto de restauração utilizável em produção;
2. aprovação explícita de PP-1 e da promoção única descrita neste documento.
