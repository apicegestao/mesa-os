# Checklist jurídico — Mesa OS e Contexto Longitudinal TutorIA

## Identificação e contrato

- [ ] Razão social, CNPJ, endereço, canal de suporte e encarregado preenchidos.
- [ ] Modelo de contratação, consumidor/B2B, representação da empresa e foro revisados.
- [ ] Limites de responsabilidade, disponibilidade, propriedade intelectual e encerramento adequados.

## LGPD e IA

- [ ] Inventário de dados e classificação: pessoais, sensíveis, de terceiros e empresariais.
- [ ] Base legal por finalidade; LIA quando legítimo interesse for utilizado.
- [ ] Avaliação de necessidade e proporcionalidade do contexto automático.
- [ ] DPIA/RIPD avaliado conforme risco.
- [ ] Direitos do titular, canal de atendimento e prazos definidos.
- [ ] Critérios de transparência, explicação e revisão de decisão automatizada definidos.

## Aceite e prova

- [ ] Definir se o aceite é consentimento, aceite contratual, oposição ou combinação de mecanismos.
- [ ] Validar texto, granularidade, ausência de consentimento forçado e consequência da recusa.
- [ ] Validar evidência mínima: identidade autenticada, versão, hash, data/hora, recibo, integridade e retenção.
- [ ] Definir se é necessária assinatura eletrônica avançada/qualificada ou provedor especializado para algum ato específico.

## Fornecedores e segurança

- [ ] Mapear Supabase, Netlify, provedores de IA e demais operadores/suboperadores.
- [ ] Examinar DPA, retenção, localização/transferência internacional e medidas de segurança.
- [ ] Proibir fine-tuning e reutilização de dados privados sem novo gate.
- [ ] Definir política de incidente, backups, retenção, descarte e resposta a solicitações.

## Backoffice e inteligência interna

- [ ] Definir controlador, operadores, RBAC, MFA, justificativa de acesso e auditoria.
- [ ] Estabelecer agregação, limiar de coorte e supressão antes de Mesa OS Intelligence.
- [ ] Proibir acesso genérico a memórias, conversas ou dados identificáveis.
