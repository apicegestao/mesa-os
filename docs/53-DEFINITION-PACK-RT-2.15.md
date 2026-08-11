# Definition Pack — RT-2.15 Core Loop Completion

**Status:** PROPOSED — AWAITING SINGLE APPROVAL  
**Owner:** Rafael Portela Martins  
**Data:** 2026-08-11

## Resultado homologável

O owner retoma o Mapa de Papéis e Decisões, registra como o aplicou, submete uma evidência operacional e avança, de forma transacional, da Missão 1 concluída para a Missão 2 disponível.

## Incrementos do train

| Ordem | Incremento | Entrega | Migration |
|---|---|---|---|
| 1 | IMP-2.15A | Implementação confirmável | própria, aditiva |
| 2 | EVD-2.15B | Evidência operacional estruturada | própria, aditiva |
| 3 | MTR-2.15C | Conclusão e desbloqueio atômicos | própria, aditiva |
| 4 | STA-2.15D | Estado e próxima ação derivados | sem entidade duplicada |

## Decisões propostas para aprovação única

1. Implementação possui rascunho e confirmação explícita irreversível.
2. Resumo de aplicação e data são obrigatórios; data não pode ser futura nem anterior ao ciclo.
3. Evidência aceita quatro tipos controlados e uma descrição factual; sem anexos ou links.
4. Evidência submetida é imutável e não representa impacto ou Evolução.
5. Submeter evidência conclui a Missão e libera a próxima na mesma transação.
6. A próxima Missão é determinada pela posição; não há escolha, pulo ou reordenação.
7. A transição continua possível após a data final enquanto o ciclo permanecer ativo.
8. A Missão 2 fica disponível, mas sua Ferramenta não é antecipada.
9. O status do core loop é derivado, não um percentual persistido.
10. Build ocorre em uma branch, com migrations separadas, CI completo, Pre-Release Review, um merge e um deploy.

## Segurança e confiabilidade

- Owner-only, RLS e grants mínimos.
- Funções `security definer` revalidam autenticação, organização, papel e estados.
- Payloads e datas validados no servidor.
- Constraints, idempotência e locks impedem avanço duplo.
- Zero `DROP`, `TRUNCATE`, exclusão ou migração destrutiva.
- Secret scan, pgTAP, testes de rollback e regressão antes do merge.

## Fora do train

TutorIA; Evolução; impacto/score; anexos; links; comentários; aprovação de terceiros; member; notificações; WhatsApp; dashboards; Ferramenta da Missão 2; conclusão do ciclo; segunda prioridade ou segundo ciclo.

## Plano de release

1. Aprovação explícita única deste pack.
2. Pre-Flight integrado e atualização do Current Scope para BUILD.
3. Implementação das quatro capacidades na branch `release/rt-2-15`.
4. Migrations aplicadas e verificadas em ordem no ambiente autorizado.
5. CI e Pre-Release Review completos.
6. Um merge em `main`, um deploy de produção e smoke test com rollback antes do fluxo real.

## Gate

A aprovação deste documento autoriza somente o BUILD descrito nas quatro specs. Qualquer mudança material, risco destrutivo ou conflito interrompe o train.
