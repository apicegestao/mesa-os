# Pre-Flight — RT-2.26G Adaptador de Diagnóstico

**Status:** READY FOR BUILD — homologação somente

## Alignment Check

As autoridades `00-CONSTITUTION.md`, `02-V2-SCOPE.md`, ADR-039, RT-2.26F e CP-10 permitem contexto longitudinal estruturado, temporal, corrigível e isolado. O adaptador não amplia dados coletados: apenas projeta um resumo mínimo de diagnóstico já concluído.

## Controles obrigatórios

1. Trigger somente após a conclusão imutável do diagnóstico.
2. Função privada, `search_path` fixo, sem execução pública.
3. Dupla trava: política organizacional e aceite vigente por identidade.
4. Referência única da fonte e revisão imutável da memória.
5. RLS e leitura restrita ao próprio sujeito.
6. Security Advisor, teste de idempotência, teste de elegibilidade, lint, typecheck e build.

## Não iniciar se

- o aviso v1 não estiver publicado;
- a política organizacional estiver desligada;
- o último evento do membro não for `accepted`;
- o diagnóstico não estiver concluído.
