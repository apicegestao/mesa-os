# Definition Pack EVD-AI-3.3A — Autonomia graduada na revisão de Evidências

**Status:** APPROVED FOR BUILD — homologação somente
**Ambiente de BUILD proposto:** homologação somente
**Owner:** Mesa dos Donos
**Base:** `00-CONSTITUTION.md`, `10-CURRENT-SCOPE.md`, GOV-CR-2.27B e conversa Mesa OS V2

## 1. Resultado pretendido

TutorIA é o especialista mestre e a instância padrão de orientação, análise e validação operacional da jornada. Para evidências, ele deve resolver com autonomia quando os critérios estiverem claros e os sinais forem suficientes; humano é instância de exceção, não fila padrão.

O membro recebe uma decisão clara, explicada e útil: evidência validada, complemento necessário ou encaminhamento excepcional.

## 2. Decisão de autoridade

Dentro de um critério metodológico versionado, TutorIA pode:

- validar uma evidência suficiente, registrar sua justificativa e liberar a continuidade canônica da Missão;
- devolver uma evidência incompleta com perguntas objetivas e permitir novo envio sem intervenção humana;
- explicar o raciocínio, a confiança e o próximo passo;
- manter a continuidade da conversa e do contexto autorizado do mesmo membro.

TutorIA não pode alterar metodologia, regra de critério, acesso, pagamento, Termos, identidade ou ciclo fora dos contratos permitidos. Seu poder é uma decisão operacional limitada, rastreável e reversível por humano autorizado.

## 3. Fluxo proposto

```text
Membro registra evidência
        ↓
Validação determinística de campos, vínculo e política
        ↓
TutorIA avalia dentro do contexto permitido
        ↓
Alta confiança: valida e libera continuidade
Média confiança: pede complemento específico
Baixa confiança, risco ou dúvida persistente: encaminha humano
        ↓
Decisão, política, confiança e justificativa ficam auditadas
```

## 4. Quando TutorIA escala para humano

Escalonamento é obrigatório somente quando ocorrer ao menos uma condição:

1. confiança abaixo do limiar versionado;
2. contradição material entre a evidência e os fatos autorizados;
3. alegação de impacto financeiro, jurídico, trabalhista, médico, regulatório ou reputacional que não possa ser sustentada no contrato atual;
4. risco de segurança, política, orçamento, modelo ou contexto insuficiente;
5. pedido explícito do membro;
6. persistência de dúvida: o membro declara que não foi compreendido ou repete substancialmente a mesma dúvida após duas respostas úteis e contextualizadas.

O encaminhamento direciona para Concierge ou Mentor conforme finalidade, sem expor conteúdo fora do mínimo necessário.

## 5. Política de confiança e efeitos

| Faixa / condição | Decisão padrão | Efeito |
|---|---|---|
| Alta confiança, critérios atendidos e sem risco | TutorIA valida | Atualiza o estado canônico e libera a próxima etapa autorizada |
| Média confiança ou informação incompleta | TutorIA pede complemento | Nenhuma mudança de progresso; membro reenvia |
| Baixa confiança, conflito, risco ou dúvida persistente | TutorIA encaminha humano | Mantém estado pendente e cria fila auditável |

Confiança não é um índice abstrato de “certeza da IA”. É uma política operacional verificável, baseada em completude, aderência ao critério, coerência com fatos autorizados e ausência de sinais de risco. Limiar, critério e versão de modelo ficam registrados em cada decisão.

## 6. Dados e privacidade

- entrada mínima: Missão, implementação relacionada, descrição factual, data e tipo de evidência;
- contexto permitido: somente fatos metodológicos e de jornada da mesma organização, conforme Termos vigentes;
- sem treino, fine-tuning, RAG compartilhado ou aprendizado entre membros;
- logs operacionais não recebem o corpo sensível da evidência ou da conversa;
- o membro vê a decisão, o motivo e a opção de solicitar revisão humana;
- decisões automáticas são reversíveis por humano autorizado, sem apagar o registro original.

## 7. Controles técnicos propostos

- contrato server-side específico; modelo não acessa banco diretamente;
- schema tipado: `decisão`, `confiança`, `critérios_atendidos`, `pontos_observados`, `perguntas_de_complemento`, `sinais_de_risco`, `motivo_de_escalonamento`;
- política e limite de confiança versionados por Admin autorizado, com auditoria e sem reescrever decisões passadas;
- idempotência por evidência + versão de política;
- atualização canônica atômica somente para decisão de alta confiança que satisfaça todos os guardrails;
- rate limit, orçamento e gateway de modelo server-side já existentes;
- fallback seguro: falha de modelo mantém a evidência pendente e oferece continuidade humana; nunca aprova por ausência de resposta;
- monitoramento de reversão humana e taxa de escalonamento; ultrapassado o limiar operacional, autonomia do critério é suspensa até revisão.

## 8. Fora de escopo

- anexos, OCR, imagens, áudio ou interpretação de documento externo;
- WhatsApp, comunicação proativa ou mensagem externa;
- decisão jurídica, financeira, trabalhista ou médica;
- treinamento com dados dos membros;
- criação ou alteração de metodologia, Missão, critério ou ciclo por IA;
- autonomia para acesso, pagamento, identidade, Termos ou permissões.

## 9. Critérios de aceite para BUILD

1. alta confiança válida atualiza somente o estado de evidência/Missão explicitamente permitido, de forma atômica e auditável;
2. média confiança nunca altera progresso e retorna perguntas de complemento claras;
3. baixa confiança, risco e persistência de dúvida sempre criam encaminhamento humano adequado;
4. decisão mostra ao membro motivo, confiança operacional e possibilidade de revisão humana;
5. testes cobrem isolamento, idempotência, reversão, falha de modelo, suspensão de critério e nenhuma alteração fora do escopo;
6. RLS, funções privilegiadas, orçamento, logs e Security Advisor aprovados em homologação;
7. produção não é promovida sem smoke consolidado e aprovação explícita do owner.

## 10. Dependência de governança

`10-CURRENT-SCOPE.md` ainda veda aprovação/desbloqueio automático. Portanto este Definition Pack só pode entrar em BUILD depois da aprovação do GOV-CR-2.27C correspondente. A autonomia prevista não deve ser inferida por esta documentação isoladamente.
