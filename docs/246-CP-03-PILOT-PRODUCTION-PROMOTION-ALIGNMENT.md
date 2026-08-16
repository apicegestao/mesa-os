# CP-03 — Alinhamento para promoção do piloto T1 em produção

**Status:** preparação concluída; promoção bloqueada até os gates operacionais  
**Data:** 16 de agosto de 2026  
**Autoridades consultadas:** Constituição, Scope Lock, ADRs, Construction Protocol,
Current Scope, Plano Mestre e conversa-fonte Mesa OS V2.

## Decisão recomendada

Fazer uma promoção de produção para um **piloto pequeno e acompanhado de membros**
é o próximo passo correto. Ela não deve ser uma liberação geral nem a promoção de
todas as frentes em homologação.

O piloto deve validar o ciclo T1 completo do membro:

`acesso por código → Termos → Raio-X → prioridade → ciclo → Missão → ferramenta → implementação → Evidência → evolução`.

TutorIA permanece contextual e rastreável. Sua ativação com modelo pago em
produção fica fora desta primeira promoção, até configuração de custo e smoke
específico de provedor.

## Estado real dos ambientes

| Item | Produção | Homologação |
|---|---:|---:|
| Migrations aplicadas | 53 | 99 |
| Diferença identificada | — | 46 migrations posteriores |
| Security Advisor | sem alertas | aviso de senhas vazadas não aplicável ao OTP |
| Deploy principal Netlify | ativo | preview ativo |

As migrations posteriores incluem, entre outros, acesso controlado por código,
retenção longitudinal, suporte, evidências assistidas e base editorial T1.
CRM, financeiro, Intelligence e automações externas não devem ser trazidos ao
piloto por conveniência: cada um exige o próprio pacote de promoção.

## Escopo proposto para o futuro Definition Pack PP-1

1. Paridade mínima para o piloto de membro T1 e acesso interno administrativo
   estritamente necessário à operação editorial e suporte.
2. Publicação explícita, auditada, das quatro unidades editoriais T1 depois da
   paridade de schema; nenhuma publicação automática.
3. Matrícula prévia e OTP para uma primeira turma limitada a três a cinco membros.
4. Smoke pós-release com uma organização de demonstração antes de qualquer
   convite real.
5. Observação diária de ativação, falhas, suporte, Evidências e custo de IA.

## Fora de escopo do PP-1

- CRM, checkout, Asaas, cobrança, entitlement financeiro e produção financeira;
- Intelligence ativa, sugestões automáticas ou publicação editorial automática;
- WhatsApp, Instagram, comunicação proativa e demais canais externos;
- modelo de IA pago ativo em produção;
- expansão T2–T4, white label e qualquer liberação geral.

## Gates obrigatórios antes de qualquer alteração em produção

1. confirmação do owner de backup/ponto de restauração utilizável no projeto de
   produção;
2. Definition Pack PP-1 com lista ordenada de migrations, matriz de dependências,
   rollback e critérios de parada;
3. aprovação explícita do PP-1 e da janela de promoção;
4. confirmação por presença das variáveis de produção, sem revelar segredos;
5. CI verde no commit exato promovido e Security Advisor sem alerta novo;
6. merge único, deploy único e smoke pós-release documentado.

## Condições de parada

Qualquer diferença de migration não explicada, backup ausente, variável crítica
não configurada, erro de aplicação, alerta novo de segurança ou falha de smoke
interrompe a promoção antes de convidar membros.
