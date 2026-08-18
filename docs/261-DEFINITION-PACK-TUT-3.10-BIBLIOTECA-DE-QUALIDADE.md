# Definition Pack — TUT-3.10 Biblioteca de Qualidade do TutorIA

## Objetivo

Transformar qualidade de resposta em contrato testável, não em preferência subjetiva. TutorIA deve ensinar gestão de forma direta para empresários ocupados, mantendo profundidade técnica apenas quando ela ajuda a decidir.

## Escopo

- padrão de ensino em linguagem simples;
- seis cenários-base: DRE, caixa, delegação, vendas, processos e decisões;
- guardrail contra respostas evasivas, jargão desnecessário e encaminhamento humano;
- testes sem conteúdo de membros e sem chamada paga ao modelo.

## Critérios de aceite

1. Prompt traz padrão de ensino versionado.
2. Cada cenário central possui expectativa explícita de utilidade.
3. Saída que transfere o membro para humano ou apenas pede contexto é rejeitada e recebe resposta de recuperação.
4. Não há mudança em dados, permissões, orçamento ou contexto autorizado.

## Fora do escopo

Avaliação semântica automatizada de respostas reais, fine-tuning, uso de dados brutos, novos modelos, novas ferramentas ou publicação metodológica automática.
