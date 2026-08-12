# Governance Checkpoints — Mesa OS V2

**Status:** ACTIVE  
**Owner:** Rafael Portela Martins  
**Baseline:** conversa `Mesa OS V2` (`6a7671ee-20b0-83e9-ba40-12c7b311f0b7`)

## Como funciona

Este registro dá visibilidade ao owner sem transformar cada commit em uma aprovação manual. Cada checkpoint informa onde estamos, o que foi conferido e o próximo recorte seguro. Um checkpoint de escopo, custo, risco ou promoção solicita decisão explícita; os demais permitem BUILD contínuo dentro do pacote aprovado.

## CP-01 — RT-2.25: Base factual da DRE

**Estado:** PASS — 2026-08-12  
**Objetivo:** dar à TutorIA uma base financeira verificável antes de qualquer explicação generativa.

**Autoridades reconciliadas:** ADR-035 (conversa fonte), ADR-036 (TutorIA central), ADR-038 (Mapa de Desenvolvimento), ADR-039 (isolamento), Current Scope TWR-2.25A/B/D e Definition Pack RT-2.25.

**Construído:** workbench DRE versionado, rascunho isolado por organização, validação server-side, escopo de leitura `read_workbench_tool` auditável e leitura determinística que separa cálculos, alertas e dados ausentes.

**Fora do escopo preservado:** nenhum acesso direto da IA ao banco, nenhuma escrita pela IA, nenhuma aprovação de evidência, documento final, memória de chat, WhatsApp, automação ou promoção para produção.

**Evidência de validação:** migration aplicada somente no projeto Supabase de homologação; Security Advisor sem alertas; 27 testes específicos e typecheck passaram.

**Próximo recorte autorizado:** converter a base factual em explicação especializada governada, com orçamento, auditoria, schema de resposta e escalonamento por baixa confiança. Antes de habilitar inferência em preview, executar checkpoint de ativação e smoke autenticado.

## CP-02 — RT-2.25: Explicação especializada da DRE

**Estado:** PASS — PRONTO PARA ATIVAÇÃO CONTROLADA — 2026-08-12
**Objetivo:** permitir que a TutorIA aprofunde a leitura factual da DRE sem poder alterá-la ou apresentar fatos financeiros inventados.

**Autoridades reconciliadas:** CP-01, ADR-036 (TutorIA central), ADR-039 (isolamento e aprendizagem governada), Current Scope TWR-2.25A/B/D e Definition Pack RT-2.25.

**Construído:** contrato de prompt limitado à camada factual, schema de saída de entrega especializada, bloqueio de fatos/cálculos não idênticos aos já calculados, teto de custo próprio, rate limit, reserva/liquidação atômica de orçamento, uso auditável e tabela de auditoria sem prompt, resposta ou valores financeiros.

**Fora do escopo preservado:** a IA não escreve na DRE, não acessa o banco diretamente, não armazena conversa, não aprova evidência, não gera documento final, não decide pelo membro e não é ativada em produção.

**Evidência de validação:** migration aplicada somente no Supabase de homologação; RLS ativo e leitura anônima bloqueada; Security Advisor sem alertas; lint, typecheck e 80 testes passaram.

**Condição de ativação:** configurar exclusivamente no preview/homologação a flag da capacidade e um teto por chamada suficiente; executar smoke autenticado com dados de teste e conferir auditoria/custo. Isso exige checkpoint de ativação, não promoção de produção.

## CP-03 — RT-2.25: Ativação controlada em preview

**Estado:** IN PROGRESS — 2026-08-12
**Objetivo:** habilitar a explicação especializada apenas na homologação, sob o custo e isolamento aprovados.

**Ações concluídas:** a branch de homologação recebeu o trem consolidado; `TUTORIA_DRE_ANALYSIS_ENABLED=true` e teto de `2790` micros de dólar por chamada foram configurados exclusivamente em `deploy-preview`, com escopo de função/runtime. Produção não recebeu estas variáveis.

**Pendente e obrigatório:** o preview deve concluir o build e receber smoke autenticado com DRE de teste. A validação confirmará retorno útil ou escalonamento seguro, auditoria sem conteúdo e reserva/liquidação de custo. Sem esse smoke, o checkpoint não é aprovado e não há promoção.

**Tentativa de smoke:** o preview abriu e confirmou a proteção de acesso da equipe, mas não havia sessão autenticada disponível. Nenhuma credencial foi enviada ou alterada; o smoke funcional permanece pendente.

## CP-04 — TutorIA: qualidade acima de compressão artificial

**Estado:** PASS — 2026-08-12

**Decisão:** o teto por chamada controla consumo excepcional, não a qualidade da resposta. Cada capacidade terá perfil de profundidade, piso de qualidade, orçamento e estratégia explícita para falta de contexto. A TutorIA não pode cortar rigor, ocultar limitação ou inventar dados para caber no limite.

**Aplicação inicial:** a análise especializada de DRE passa a suportar até 1.200 tokens de saída, com custo máximo estimado de US$ 0,00372 por chamada em homologação. Quando a profundidade necessária superar a capacidade autorizada, a resposta deve preservar a camada factual, pedir contexto, oferecer aprofundamento posterior ou escalar — nunca improvisar uma conclusão.

**Proteções preservadas:** o orçamento mensal do membro continua sendo a principal barreira; rate limit continua voltado a abuso/uso massivo; pedidos empresariais legítimos não são bloqueados por conteúdo.

## CP-05 — RT-2.25: Prévia canônica de documentos

**Estado:** PASS — 2026-08-12

**Objetivo:** permitir que cada ferramenta apresente ao membro a origem e o conteúdo resumido do seu documento antes de qualquer exportação.

**Construído:** DRE, Mapa de Papéis e Decisões (RACI) e Leitura SWOT agora exibem uma prévia canônica com marca Mesa dos Donos, versão da ferramenta, resultado metodológico de origem, estado de rascunho e seções que comporão PDF/XLSX.

**Garantias:** a prévia é derivada exclusivamente do rascunho isolado da organização e não cria arquivo, link público, retenção ou compartilhamento. A exportação ainda exigirá confirmação explícita, auditoria e controles de acesso próprios.

**Evidência de validação:** 24 testes dos workbenches passaram, assim como typecheck, lint do escopo e verificação de whitespace do diff.

**Próximo recorte autorizado:** implementar a solicitação confirmada de exportação, geradores PDF/XLSX com identidade visual da Mesa dos Donos, armazenamento privado e trilha de auditoria; manter produção sem alteração até validação específica.

## CP-06 — RT-2.25C: Exportação direta e auditável

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Construído:** DRE, Mapa de Papéis e Decisões e Leitura SWOT podem gerar PDF ou XLSX somente após confirmação explícita. A rota exige sessão e vínculo ativo, valida o rascunho salvo e entrega o arquivo diretamente com `private, no-store`. Todos os campos estruturados são carregados no arquivo; uma nova geração sempre reflete o rascunho atual.

**Privacidade e retenção:** o binário não é persistido, publicado ou compartilhado; sua retenção no servidor é zero. A auditoria guarda apenas organização, ferramenta, formato, resultado, tamanho e data — nunca o conteúdo da ferramenta.

**Evidência de validação:** 25 testes dos workbenches, typecheck, lint e build passaram. A migration foi aplicada somente no Supabase de homologação e o Security Advisor não reportou alertas.

**Pendente para promoção:** smoke autenticado em preview, inspeção do arquivo baixado e revisão integrada de segurança/privacidade. Produção permanece sem alteração.

## CP-07 — Próximo escopo: contexto longitudinal e memória governada

**Estado:** PASS — PRIMEIRA FATIA EM HOMOLOGAÇÃO — 2026-08-12

**Decisão reconciliada:** a conversa `Mesa OS V2` e ADR-039 exigem que o TutorIA se beneficie da trajetória do membro, mas determinam que chat bruto não é memória e que qualquer aprendizado coletivo é agregado, desidentificado e aprovado.

**Construído:** a primeira fatia do RT-2.26 cria memória explicitamente confirmada pelo membro, isolada por organização e sujeito, com tipo, confiança, validade, estado, origem e revisões imutáveis. Em Conta e segurança, o membro pode registrar, corrigir e invalidar seu próprio contexto.

**Proteções preservadas:** chat bruto não é persistido, não há extração automática de memória, a IA ainda não recupera essas memórias em chamadas, e Mesa OS Intelligence não recebeu acesso a dados identificáveis.

**Evidência de validação:** migration aplicada somente na homologação, presença das duas tabelas confirmada por consulta, Security Advisor sem alertas; 91 testes, lint, typecheck e build passaram.

**Próximo recorte autorizado:** recuperação contextual mínima e auditável para uma finalidade específica do TutorIA, seguida de subpack próprio de retenção/direitos antes de qualquer memória derivada de conversa.

## CP-08 — Proposta: contexto automático e aceite rastreável

**Estado:** LEGAL REVIEW REQUIRED — 2026-08-12

**Decisão:** o owner propôs eliminar confirmações por evento para o empresário. O produto pode automatizar contexto derivado de registros canônicos, mas aceite genérico não autoriza coleta ilimitada, retenção indefinida, chat bruto, dados sensíveis, treinamento ou decisão automática.

**Gate:** antes de BUILD, o texto e a base legal precisam de revisão jurídica brasileira; o backoffice requer Definition Pack próprio de RBAC/MFA/auditoria. O RT-2.26 atual permanece somente com memória explicitamente confirmada.

## CP-09 — RT-2.26E: fundação de aceite e gate automático

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Construído:** documentos jurídicos versionados, hash de conteúdo, recibos de aceite autenticado e política por organização. Conteúdo publicado torna-se imutável; o recibo vincula o membro à versão e ao hash vistos no aceite.

**Proteção-chave:** a elegibilidade para derivação automática exige simultaneamente política organizacional ativa e aceite da versão jurídica correspondente. A policy inicia desabilitada e não há documento jurídico publicado, captura automática, backoffice ou produção nesta entrega.

**Evidência de validação:** migration aplicada somente na homologação; RLS ativo nas três tabelas e Security Advisor sem alertas. Testes do gate, typecheck, lint e build passaram.

**Gate seguinte:** revisão jurídica brasileira do texto, base legal, retenção, direitos do titular e evidência de aceite; Definition Pack de backoffice com RBAC/MFA/auditoria; só então ativação controlada da primeira fonte automática.

## CP-10 — RT-2.26F: aviso v1 e escolha de contexto no primeiro acesso

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Decisão:** o controlador autorizou a publicação do aviso específico v1 para personalização longitudinal opcional. Termos gerais e política de privacidade integral continuam sujeitos a versionamento posterior; este recorte não os substitui.

**Construído:** o aviso `tutoria_longitudinal_context` v1 é publicado com hash verificável e imutabilidade após publicação. No primeiro acesso, o owner escolhe ativar o contexto automático ou continuar sem ele. A ativação cria recibo autenticado e política organizacional; a retirada cria recibo de revogação. Cada identidade só é elegível quando seu último evento é `accepted` e a política organizacional correspondente está ativa.

**Proteções preservadas:** nenhuma fonte canônica é derivada automaticamente ainda; a entrega habilita apenas a escolha e o gate. Chat bruto, dados sensíveis, treinamento/fine-tuning, dados entre organizações, backoffice identificável e produção permanecem fora do incremento.

**Evidência de validação:** migration aplicada exclusivamente em homologação, hash publicado conferido, privilégios limitados a `authenticated`, Security Advisor sem alertas e testes/lint/typecheck/build passaram.

**Próximo recorte permitido:** implementar um adaptador de fonte canônica por vez, iniciando por diagnóstico concluído, sob contrato de origem, minimização, idempotência, auditoria e testes específicos. Promoção continua dependente de revisão consolidada e aprovação de deploy.

## CP-11 — RT-2.26G: adaptador de diagnóstico concluído

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Construído:** a transição imutável de um diagnóstico de `draft` para `completed` pode criar um único fato mínimo no contexto do TutorIA: episódio, IME e estágio. A memória conserva a referência do diagnóstico e uma revisão inicial auditável.

**Proteções preservadas:** a trigger só executa se a política da organização estiver ativa e o último evento da identidade que concluiu o diagnóstico for `accepted`. Sem essas duas condições, ela não grava nada. Respostas individuais, dimensões, texto livre, chat bruto e dados sensíveis não são projetados.

**Evidência de validação:** trigger conferida no banco de homologação, Security Advisor sem alertas e 93 testes, lint, typecheck e build passaram.

**Próximo recorte permitido:** avaliar um adaptador equivalente para ciclo e Missão somente após a inspeção autenticada deste primeiro fluxo em preview. Não promover produção sem smoke e aprovação consolidada.

## CP-12 — RT-2.26H: Termos únicos e reaceite temporal

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Decisão:** o controlador autorizou um único Termo de Uso no primeiro acesso. A seção de contexto longitudinal do TutorIA é parte do mesmo texto e do mesmo recibo de aceite.

**Construído:** `mesa_os_terms` v1 foi publicado com hash verificável. A área autenticada só é liberada para quem aceitou a versão atual. O aceite do owner ativa a política organizacional correspondente; a retirada mantém o acesso aos registros, mas interrompe novas derivações automáticas.

**Atualizações seguras:** uma nova versão recebe outro número, conteúdo e hash, enquanto a anterior é retirada de publicação. O carregamento sempre consulta a versão publicada; por isso um aceite anterior não libera a versão nova. Todos os recibos anteriores permanecem no histórico.

**Proteções preservadas:** não existe editor livre de Termos, alteração silenciosa, chat bruto, dados sensíveis, treinamento de modelo, dados entre organizações ou alteração de produção.

**Evidência de validação:** hash do Termo v1 conferido no banco, Security Advisor sem alertas e 94 testes, lint, typecheck e build passaram.

## CP-13 — RT-2.26I: adaptador de ciclo ativo

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Construído:** ao criar um ciclo ativo, o sistema pode registrar para a identidade que o criou um fato mínimo contendo título, período e sequência T. A memória é vinculada ao identificador do ciclo e não pode duplicar.

**Proteções preservadas:** sem Termos atuais aceitos e política organizacional ativa, a trigger não grava. Nenhuma prioridade detalhada, Missão, ferramenta, evidência, conversa ou dado sensível é projetado.

**Evidência de validação:** trigger conferida no banco, Security Advisor sem alertas e 94 testes, lint, typecheck e build passaram. Produção não foi alterada.

**Próximo recorte permitido:** adaptador de Missão disponível somente após inspeção autenticada consolidada dos fluxos de Termos, diagnóstico e ciclo em preview.

## CP-14 — RT-2.26J: recuperação mínima para orientação

**Estado:** PASS EM HOMOLOGAÇÃO — 2026-08-12

**Construído:** a orientação do TutorIA pode receber até oito fatos automáticos ativos da própria identidade, limitados a diagnóstico concluído e ciclo ativo. A leitura só acontece após verificar Termos atuais aceitos e política organizacional ativa; cada leitura é auditada com códigos de fonte.

**Proteções preservadas:** memórias livres do membro, chat bruto, ferramentas, evidências, dados sensíveis e dados de outra organização não entram no prompt. A nova leitura é somente de consulta e não escreve nem altera a jornada.

**Evidência de validação:** catálogo de tools ampliado de modo explícito, enum de banco conferido, Security Advisor sem alertas e 94 testes, lint, typecheck e build passaram.
