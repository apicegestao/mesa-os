# Proposal — RT-2.26E Contexto Automático e Aceite Rastreável

**Status:** PROPOSAL — revisão jurídica/LGPD obrigatória antes de BUILD

## Objetivo

Reduzir atrito para o empresário: o TutorIA deve registrar automaticamente o contexto operacional útil da jornada, sem exigir confirmação por evento e sem transformar conversa privada em memória indiscriminada.

## Decisão proposta

### 1. Registro automático permitido

Após aceite informado, o Mesa OS poderá derivar contexto somente de fontes canônicas da própria organização: diagnóstico concluído, ciclo, Missão, ferramenta estruturada, implementação, evidência, métrica, documento gerado e decisão explicitamente registrada no fluxo.

Categorias: progresso, compromisso, decisão, lacuna de aprendizagem, preferência de condução e fato operacional da empresa. Cada memória conserva fonte, versão, confiança, validade, estado e trilha de correção.

### 2. Registro automático proibido neste escopo

- chat bruto e conteúdo livre de conversa;
- dados sensíveis, inferência sobre saúde, vida pessoal, perfil comportamental ou colaboradores;
- dados de outra organização;
- treinamento/fine-tuning, reutilização coletiva ou acesso operacional do Mesa OS Intelligence;
- aprovação de evidência, mudança de estado, decisão empresarial ou comunicação externa autônoma.

### 3. Aceite no primeiro acesso

O primeiro acesso apresenta, em linguagem clara e separada dos termos gerais:

1. finalidade da personalização longitudinal;
2. categorias de dados e fontes automáticas;
3. o que não será coletado/uso proibido;
4. provedores e transferências aplicáveis;
5. direitos de visualização, correção, invalidação, oposição e canal de contato;
6. consequências práticas da recusa: o Mesa OS continua funcionando, mas TutorIA não usará contexto longitudinal opcional.

O aceite registra um recibo verificável: identidade autenticada, versão e hash do documento, texto/artefato versionado, data/hora, ação de aceite, sessão e evidências técnicas proporcionais. O membro pode baixar o recibo; o backoffice guarda o mesmo recibo em repositório privado, íntegro e auditado.

### 4. Backoffice restrito

Não haverá acesso genérico de equipe. Um papel interno específico de privacidade/atendimento, MFA, justificativa de acesso, auditoria e revisão periódica são pré-requisitos. O painel mostra recibos e metadados por padrão; conteúdo de memória só aparece quando a finalidade e a autorização permitirem.

### 5. Controles do membro

Uma página única permite ver memórias ativas, origem, versão e validade; corrigir/inativar item; desligar novas derivações automáticas; exportar recibos; e solicitar exclusão conforme política aplicável. Desligar a derivação não apaga os registros canônicos necessários ao serviço nem revisões históricas sujeitas a obrigação legal/contratual.

## Gates antes de BUILD

1. Parecer de advogado brasileiro em proteção de dados sobre base legal, consentimento, contrato, retenção e redação final.
2. Mapa de dados, operadores/provedores, transferência internacional e DPA aplicáveis.
3. Política de privacidade, termos, versão, retenção e procedimento de direitos do titular aprovados.
4. Definition Pack de backoffice com RBAC, MFA, auditoria e minimização.
5. DPIA/LIA quando a base legal e o risco exigirem.
6. Testes de aceite, retirada, isolamento, evidência de integridade e ausência de captura de chat.

## Base de referência

LGPD: finalidade, adequação, necessidade e transparência; direitos do titular e revisão de decisões automatizadas. Diretrizes da ANPD sobre legítimo interesse exigem finalidade específica, necessidade, balanceamento e salvaguardas. Este documento é especificação de produto, não parecer jurídico.
