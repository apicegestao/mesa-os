# Definition Pack — RT-2.26F Ativação Controlada do Contexto TutorIA

**Status:** APPROVED FOR HOMOLOGATION — autorização do controlador em 12 de agosto de 2026

## Objetivo

Operacionalizar o aviso específico v1 do contexto longitudinal do TutorIA com decisão explícita, recibo verificável e isolamento por organização.

## Decisões

- A versão `tutoria_longitudinal_context` v1 é o único documento que habilita a personalização automática neste incremento.
- A escolha é específica, opcional e revogável pelo membro.
- A primeira escolha do owner habilita a política organizacional; cada identidade continua elegível somente após seu próprio aceite ativo.
- A retirada do membro interrompe novas derivações para sua identidade sem apagar registros canônicos ou recibos necessários.
- A ativação técnica de elegibilidade não autoriza chat bruto, dados sensíveis, treinamento/fine-tuning, inteligência interna identificável, mensagens externas ou decisões autônomas.

## Critérios de aceite

1. Documento publicado é imutável e possui hash verificável.
2. Apenas owner ativo pode habilitar a política da organização.
3. Apenas identidade autenticada pode criar ou retirar seu próprio aceite.
4. A elegibilidade exige, simultaneamente, política organizacional ativa e último evento `accepted` da identidade.
5. O fluxo é validado em homologação, com RLS e Security Advisor sem novos alertas críticos.

## Fora de escopo

Implementar adaptadores que derivem fatos das fontes canônicas. Eles serão o próximo incremento, depois de validar este gate e a experiência de aceite.
