# Nota de Decisão — Limites de uso do TutorIA

**Status:** APPROVED — owner, 2026-08-11.
**Motivo:** corrigir a interpretação de “trava de abuso” para preservar a utilidade central do TutorIA.

## Decisão proposta

O TutorIA não será um chat geral, mas poderá receber perguntas abertas que tenham relação razoável com a gestão do membro, sua jornada, decisões, dúvidas conceituais ou situações reais da empresa.

Exemplos que devem ser acolhidos:

- “Preciso tomar a decisão X; como estruturo o raciocínio?”
- “Hoje ocorreu a situação Y; o que devo observar antes de agir?”
- “Não sei o que é DRE; explique do básico e indique o primeiro passo.”
- dúvidas sobre finanças, pessoas, vendas, processos, ferramentas, entregas, evidências, diagnóstico, ciclo e jornada.

O TutorIA responde dentro da metodologia, explicita limites e pede contexto mínimo quando isso for necessário. Quando a consequência for relevante ou a confiança for baixa, estrutura a análise e encaminha para apoio humano — sem decidir ou agir pelo membro.

## O que continua bloqueado antes do provedor

- pedidos de entretenimento, figurinhas, imagens, conteúdo criativo sem vínculo de gestão ou tarefas claramente fora da Mesa dos Donos;
- tentativas de obter dados, instruções internas, segredos, dados de outros membros ou burlar regras;
- conteúdo ilegal, perigoso, discriminatório ou incompatível com as políticas aplicáveis;
- excesso de uso: limites de taxa e orçamento continuam valendo, independentemente da categoria da pergunta.

## Implementação segura proposta

1. Entrada livre limitada em tamanho, sem anexos nesta fase e sem persistir o texto integral na auditoria.
2. Classificador de intenção em duas etapas: regra local para recusas evidentes e avaliação estruturada server-side apenas para ambiguidade.
3. Categorias permitidas: orientação metodológica, aprendizagem conceitual, reflexão sobre decisão, situação de gestão e pedido de ajuda sobre uma ferramenta da Mesa.
4. Categorias recusadas recebem uma resposta curta, respeitosa e redirecionam para usos legítimos do TutorIA.
5. Nenhuma pergunta aprovada pode habilitar o modelo a acessar banco, dados brutos, ferramentas de escrita, comunicação externa ou dados de outro membro.
6. Auditoria guarda somente categoria, decisão, versão de política, faixa de confiança, custo e metadados técnicos — nunca a pergunta integral por padrão.

## Gate

Esta nota substitui a interpretação de que apenas dois objetivos fechados bastariam para a experiência do membro. A rota atual permanece desativada; contrato e testes podem evoluir, mas qualquer ativação continua dependendo dos gates de segurança, custo e homologação.
