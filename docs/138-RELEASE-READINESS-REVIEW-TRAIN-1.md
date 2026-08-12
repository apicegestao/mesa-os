# Release Readiness Review — Train 1

**Status:** BLOCKED — não promover  
**Produção:** `vlkkokjbtmdeoxewsbiy`  
**Homologação:** `tqpxqevlhfyqnjdrhlhd`

## Resultado da revisão

| Gate | Resultado | Evidência |
| --- | --- | --- |
| Código integrado | Verde | RT-2.27A: typecheck, 95 testes, lint e build aprovados. |
| Homologação | Verde | Todas as migrations até `rt_2_27_evolution_metric_projection` aplicadas. |
| Advisor de segurança — homologação | Verde | Nenhum alerta. |
| Advisor de segurança — produção | Bloqueado | 9 RPCs `SECURITY DEFINER` antigas ainda expostas e proteção contra senhas vazadas desabilitada. |
| Paridade de migrations | Bloqueado | Produção contém a base até RT-2.15; a pilha RT-2.20–RT-2.27A ainda não foi promovida. |
| Smoke autenticado | Bloqueado | Exige fixture exclusiva de homologação; não serão usados membros, sessões ou dados reais. |
| Deploy de produção | Não iniciado | Depende de todos os gates anteriores e de aprovação explícita do owner. |

## Caminho seguro para liberação

1. Criar uma identidade-fixture apenas no ambiente de homologação, com organização e registros sintéticos mínimos.
2. Executar um único smoke autenticado do caminho crítico e da visualização de Evolução, incluindo Termos, isolamento, exportação e auditoria de TutorIA.
3. Revalidar Security Advisor, migrations e variáveis de ambiente sem revelar valores.
4. Corrigir os avisos remanescentes por meio da promoção ordenada da fronteira de RPCs e habilitar proteção contra senhas vazadas na configuração produtiva, com decisão operacional separada.
5. Submeter um único pacote de promoção para aprovação explícita: banco, aplicação, deploy e smoke pós-release.

## Decisão atual

O Train 1 está tecnicamente coerente em homologação, mas não é elegível para produção. Este bloqueio é deliberado e protege os dados dos membros e a superfície de autenticação.
