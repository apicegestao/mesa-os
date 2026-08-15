# Definition Pack EVD-AI-3.3A — Revisão assistida de Evidências

**Status:** DRAFT — aguarda aprovação explícita antes de BUILD  
**Ambiente de BUILD proposto:** homologação somente  
**Owner:** Mesa dos Donos  
**Base:** `00-CONSTITUTION.md`, `10-CURRENT-SCOPE.md`, GOV-CR-2.27B e conversa Mesa OS V2

## 1. Resultado pretendido

Fazer com que o TutorIA ajude o membro a enviar evidências de melhor qualidade e ajude a equipe a revisar com mais consistência, sem transformar IA em aprovadora autônoma.

O membro recebe uma leitura clara sobre:

- se a descrição contém fato observável, contexto de uso e relação com a implementação;
- o que ainda falta para tornar a evidência revisável;
- por que uma evidência foi encaminhada para revisão humana.

## 2. Decisão de autoridade

O TutorIA **não aprova, reprova, desbloqueia Missão, altera progresso, encerra ciclo ou modifica o registro canônico**. Ele produz uma avaliação assistiva, versionada e explicável.

A mudança de estado de uma evidência continua pertencendo ao fluxo canônico de revisão, com trilha de auditoria. Em qualquer um dos casos abaixo, a fila humana é obrigatória:

- confiança abaixo do limiar versionado;
- evidência potencialmente contraditória, sensível ou ambígua;
- resultado com impacto financeiro, trabalhista, jurídico ou reputacional alegado;
- pedido expresso do membro ou da equipe;
- falha de política, orçamento, modelo ou contexto.

## 3. Fluxo proposto

```text
Membro registra evidência
        ↓
Validação determinística de campos e vínculo metodológico
        ↓
TutorIA faz leitura assistiva dentro do contexto permitido
        ↓
Parecer: pronto para revisão humana | precisa complementar | encaminhar humano
        ↓
Equipe revisa e aplica o estado canônico, com motivo auditável
```

Nenhuma seta deste fluxo representa aprovação automática.

## 4. Dados e privacidade

- entrada mínima: Missão, ferramenta/implementação relacionada, descrição factual, data e tipo de evidência;
- contexto permitido: somente fatos metodológicos e de jornada da mesma organização, conforme Termos vigentes;
- conteúdo não é usado para treino, fine-tuning, RAG compartilhado ou recomendação a outro membro;
- logs de custo/auditoria não registram o corpo sensível da evidência além do necessário para o registro canônico;
- o membro vê que se trata de análise assistiva, não decisão final;
- retenção e acesso seguem o mesmo isolamento por organização e finalidade aplicados ao TutorIA.

## 5. Política de confiança

O número de confiança não é verdade de negócio nem substitui revisor. Ele apenas classifica a suficiência do parecer:

| Faixa | Tratamento |
|---|---|
| alta + sem sinal de risco | “pronta para revisão humana” |
| média | “precisa complementar” com perguntas objetivas |
| baixa, conflitante ou sensível | encaminhamento humano obrigatório |

Os limiares ficam versionados e configuráveis apenas por Admin autorizado; mudança exige auditoria e não afeta evidências já revisadas.

## 6. Controles técnicos propostos

- contrato server-side específico, sem acesso direto do modelo ao banco;
- policy engine, limite de custo e rate limit já existentes reutilizados;
- schema tipado para o parecer: `suficiência`, `pontos observados`, `perguntas de complemento`, `sinais de risco`, `confiança`, `motivo de escalonamento`;
- modelo chamado somente em homologação até gates de qualidade, segurança e custo;
- persistência imutável do parecer com versão de política/modelo, sem sobrescrever a evidência;
- idempotência por evidência + versão de política;
- observabilidade sem prompt/resposta sensível em logs operacionais;
- fallback seguro: indisponibilidade do modelo mantém a evidência no fluxo humano, sem bloquear o membro de registrar.

## 7. Fora de escopo

- aprovação, reprovação, desbloqueio ou conclusão automática;
- anexos, OCR, imagem, áudio ou interpretação de documento externo;
- WhatsApp, comunicação proativa ou mensagem externa;
- decisão jurídica, financeira, trabalhista ou médica;
- treinamento com evidências ou conversas de membros;
- mudança de metodologia, Missão ou critério por IA.

## 8. Critérios de aceite para BUILD

1. uma evidência pode receber parecer assistivo sem alterar seu estado canônico;
2. casos de baixa confiança/riscos sempre entram na fila humana;
3. o membro recebe explicação útil, sem alegação de aprovação;
4. RLS, escopo organizacional, orçamento e auditoria são verificados em homologação;
5. testes cobrem idempotência, isolamento, falha do modelo, baixa confiança e ausência de efeito sobre progresso;
6. lint, typecheck, testes, build, Security Advisor e Post-Flight aprovados;
7. produção não é promovida sem smoke consolidado e aprovação explícita do owner.

## 9. Decisão solicitada

Se aprovado, este pacote abre o incremento **EVD-AI-3.3A** para BUILD em homologação. Até essa aprovação, permanece apenas como especificação e não autoriza alteração de banco, regra de progresso ou ativação de modelo.
