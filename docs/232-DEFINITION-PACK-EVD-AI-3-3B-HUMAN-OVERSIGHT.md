# Definition Pack EVD-AI-3.3B — Supervisão humana e reversão auditada de Evidências

**Status:** DRAFT — sem autorização de BUILD  
**Ambiente proposto:** homologação somente  
**Owner:** Mesa dos Donos  
**Base:** `00-CONSTITUTION.md`, `08-ADR-DECISION-LOG.md`, `10-CURRENT-SCOPE.md`, GOV-CR-2.27C e EVD-AI-3.3A

## 1. Problema que este incremento resolve

O TutorIA é o resolvedor padrão de Evidências elegíveis. Isso não elimina uma via humana excepcional, auditável e proporcional para decisões de baixa confiança, risco, pedido do membro ou correção de decisão automática.

Sem essa via, não existe fechamento operacional adequado para escalonamentos nem métrica confiável para avaliar a qualidade da autonomia.

## 2. Resultado pretendido

- Concierge recebe somente encaminhamentos de suporte/processo; Mentor recebe somente encaminhamentos metodológicos.
- Cada item apresenta um envelope mínimo: organização, Missão, decisão do TutorIA, justificativa, confiança, motivo de escalonamento e vínculo de Evidência. O corpo sensível não é exibido fora da necessidade de atendimento.
- Humano autorizado pode confirmar, solicitar complemento ou reverter uma decisão automática; nunca edita ou apaga o histórico original.
- Toda intervenção gera um evento imutável e uma revisão subsequente, preservando a decisão do TutorIA e sua versão de política/modelo.
- Métricas internas mostram taxa de reversão, complementação e escalonamento por critério, sem usar conteúdo de membros para treinamento.

## 3. Papéis e limites

| Papel | Pode | Não pode |
|---|---|---|
| Concierge | atender escalonamento operacional, solicitar complemento e encaminhar | aprovar critério metodológico em conflito ou alterar metodologia |
| Mentor | avaliar aderência metodológica, confirmar ou reverter decisão de Evidência | alterar dados financeiros, identidade, acesso, Termos ou ciclo |
| Admin | auditar fila e métricas, definir limiar de suspensão | reescrever histórico ou liberar promoção automática |
| TutorIA | continuar sendo instância padrão dentro da política aprovada | decidir fora do contrato ou revogar a trilha humana |

## 4. Fluxo proposto

```text
TutorIA decide Evidência
       ↓
escala por baixa confiança, risco, pedido ou dúvida persistente
       ↓
fila mínima, com destinatário por finalidade
       ↓
humano confirma | pede complemento | reverte
       ↓
nova revisão imutável + auditoria + métrica agregada
       ↓
se reversões excederem limite: critério é suspenso para decisão automática
```

## 5. Regras de reversão

1. Somente uma decisão humana posterior pode reverter uma decisão automática.
2. A reversão exige justificativa factual de pelo menos 20 caracteres e registra o ator, data e política afetada.
3. Se a decisão original havia liberado Missão seguinte, a reversão não pode apagar a execução já existente; deve abrir uma exceção administrativa auditada e bloquear novas progressões dependentes até resolução.
4. Não há exclusão nem atualização de `mission_evidence` ou `evidence_reviews` existentes.
5. Reversão por humano não é autorização para alterar metodologia, critérios, pesos, acesso, finanças ou Termos.

## 6. Suspensão de autonomia

- O Admin configura por critério metodológico um limite de reversão e janela de observação.
- Ao atingir o limite, novas Evidências daquele critério são encaminhadas a humano; decisões anteriores permanecem íntegras.
- A reativação requer decisão explícita de Admin, motivo e trilha de auditoria.
- O primeiro BUILD pode usar limite conservador fixo e versionado; interface de configuração só entra se o contrato prever sua auditoria completa.

## 7. Dados, privacidade e Intelligence

- Fila e métricas usam estritamente a organização e os papéis autorizados.
- Nenhum conteúdo bruto entra no Mesa OS Intelligence. Somente contagens agregadas com supressão de coortes pequenas podem formar proposta interna.
- Conversas e Evidências de um membro não treinam modelo, não criam embeddings compartilhados e não são expostas a outro membro.
- Logs técnicos guardam identificadores, resultado, custo e política; não duplicam descrição completa da Evidência.

## 8. Critérios de aceite para BUILD

1. cada escalonamento cria fila idempotente e visível somente ao papel correto;
2. confirmação, complemento e reversão são atômicos, imutáveis e auditados;
3. nenhuma reversão deixa a jornada em estado contraditório;
4. taxa de reversão e regra de suspensão são calculadas por fontes canônicas;
5. RLS, RPCs privilegiados, testes de corrida, regressão e Security Advisor aprovados em homologação;
6. produção continua sem promoção automática e exige Post-Flight consolidado.

## 9. Fora de escopo

- nova UI ampla de backoffice;
- comunicação por WhatsApp, e-mail ou Instagram;
- alteração automática de metodologia, ciclo, Ferramenta ou conteúdo;
- aprendizado/treinamento com dados identificáveis de membros;
- anexos, OCR, imagens, áudio ou documentos externos;
- promoção para produção.

## 10. Decisão necessária

A autorização de BUILD deste pacote deve ser explícita porque introduz reversão de progresso e acesso humano a uma fila operacional, ainda que dentro de limites restritos.
