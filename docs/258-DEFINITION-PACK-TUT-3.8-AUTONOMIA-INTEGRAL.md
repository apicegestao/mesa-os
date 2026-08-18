# Definition Pack — TUT-3.8

## Entrega

1. Nenhum fluxo de conversa do membro oferece encaminhamento ou fila humana.
2. Respostas malformadas do provedor recebem resposta de recuperação útil e autônoma.
3. TutorIA ensina conceitos de gestão e pede apenas o contexto que faltar.
4. Evidência de confiança/critério insuficiente retorna `changes_requested` com complemento; não retorna `escalated`.
5. Somente aprovação autônoma de confiança alta conclui e libera a próxima Missão na mesma transação.

## Critérios de aceite

- Pergunta introdutória de DRE tem orientação acionável e não exibe apoio humano.
- Não existe CTA de escalonamento na interface TutorIA.
- Política de evidência converte risco/baixa confiança em complemento.
- A função de escrita de decisão rejeita novos resultados `escalated`.
- Regressões de lint, tipo, testes e build passam.

## Riscos e controles

O controle não é uma aprovação humana: é limite de ação. O TutorIA somente libera progresso sob critério explícito e alta confiança; nos demais casos mantém a Missão aberta, explica o que falta e preserva a trilha de auditoria.
