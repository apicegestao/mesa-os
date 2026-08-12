# Alignment & Pre-Flight — RT-2.25 TutorIA Workbench e Documentos

**Status:** PASS — 2026-08-11

## Alinhamento

- Definition Pack 102 foi aprovado pelo owner.
- TutorIA é produto central: conversa de gestão ampla, análise especializada e ferramentas estruturadas; não um FAQ nem um gerador recreativo. O padrão especialista se aplica a toda dúvida, ferramenta, análise, documento e treinamento, e não somente à DRE.
- A profundidade será baseada em dados estruturados, metodologia publicada e premissas explícitas. Ausência de dado produz pergunta ou ressalva honesta, nunca conclusão inventada.
- A política atual já aceita perguntas empresariais abertas e bloqueia somente abuso evidente; qualquer ajuste posterior deve preservar esse princípio.

## Limites do trem

- Primeira fatia: contrato de workbench e de análise especializada de DRE, sem alterar dados de negócio automaticamente.
- PDF/XLSX serão produzidos apenas a partir de dados estruturados e confirmação explícita, em incremento liberado pelos testes do contrato.
- Modelos e provedores ficam atrás de uma política server-side. Gemini é a rota inicial; demais rotas dependem de avaliação de custo, qualidade e retenção.
- Produção, WhatsApp, proatividade, memória conversacional, RAG amplo, aprovação autônoma e geração recreativa permanecem fora do escopo.

## Pre-Flight

- Nenhuma chave pessoal será cadastrada. Netlify AI Gateway permanece a única rota de homologação.
- Orçamento por membro, reserva/baixa atômica, auditoria sem conteúdo bruto e isolamento organizacional devem ser reutilizados, não duplicados.
- Antes de qualquer migration, será feito inventário dos vínculos metodológicos publicados e do contrato atual de métricas/evidências.
- Antes de qualquer preview: lint, typecheck, testes, build, revisão de segurança e smoke adequado. Um único preview consolidado por trem.
