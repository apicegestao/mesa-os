# Post-Flight - RT-2.26M Adaptador de Evidência Aprovada

**Ambiente:** Supabase de homologação `tqpxqevlhfyqnjdrhlhd`  
**Produção:** não alterada  
**Resultado:** PASS

## Entregue

- Gatilho somente após o registro de uma revisão de evidência.
- Fato mínimo criado apenas quando o parecer é `approved`, sujeito a Termos atuais e política organizacional ativa.
- Expiração automática do fato se um parecer posterior solicitar correção ou escalonamento.
- Transparência em Conta e segurança: a origem aparece como “derivada de evidência aprovada”.
- Gateway de orientação auditado passa a declarar a nova origem permitida.

## Garantias verificadas

- A descrição da evidência, o racional do parecer e quaisquer anexos não entram no contexto do TutorIA.
- Não há backfill: somente eventos posteriores ao gate vigente podem gerar um fato.
- A origem aponta para a evidência canônica, é única por sujeito e preserva revisões.
- O trigger está instalado na tabela `evidence_reviews` da homologação.
- Security Advisor sem alertas.
- Lint, typecheck, 95 testes e build aprovados.

## Produção

Nenhum deploy ou promoção foi realizado. O incremento se mantém na pilha consolidada de homologação.
