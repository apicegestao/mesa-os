# ADR / Decision Log

## ADR-001 — Modular Monolith

**Status:** FROZEN  
O sistema começa como monólito modular. Distribuição prematura não é autorizada.

## ADR-002 — Next.js, TypeScript e PostgreSQL

**Status:** FROZEN  
Next.js/React + TypeScript strict e PostgreSQL/Supabase formam a base técnica.

## ADR-003 — Ambientes separados

**Status:** FROZEN  
Development, staging e production têm configuração e credenciais próprias.

## ADR-004 — Schema e segurança

**Status:** ACCEPTED  
Alterações de banco usam migrations versionadas. Schemas expostos exigem grants explícitos e RLS por tabela. Secret/service-role keys nunca vão para clientes ou Git.

## ADR-025 — Legacy Abandonment

**Status:** FROZEN  
O código da tentativa anterior foi rejeitado como base de produção por problemas de qualidade, UX, funcionalidade e confiabilidade. O Mesa OS V2 será reconstruído do zero sob o Governance Pack. Nenhuma linha do legado será copiada.

## ADR-026 — Supabase modern key model

**Status:** ACCEPTED  
O frontend usa somente publishable key. Chaves secret/service-role ficam exclusivamente em runtime server-side quando houver necessidade autorizada.

## ADR-027 — IAM initial access model

**Status:** ACCEPTED

- Autenticação inicial por magic link via Supabase Auth e sessão SSR/PKCE.
- Entrada somente por convite; cadastro público não é autorizado.
- Papéis iniciais: `owner` e `member`; somente `owner` administra acessos.
- Uma identidade pertence a no máximo uma organização no primeiro release.
- A primeira organização e seu primeiro vínculo `owner` são provisionados administrativamente.
- Convites expiram em 72 horas.
- Staging exige projeto Supabase separado antes de homologação persistente.

## ADR-028 — Diagnostic definitions are versioned data

**Status:** ACCEPTED

- Perguntas, opções, ordem, pesos, fórmulas interpretáveis e textos do diagnóstico são dados versionados, não constantes de interface.
- Uma execução concluída preserva a revisão metodológica utilizada e não pode ser sobrescrita.
- O primeiro release implementa somente `Mês 0`; reaplicação e evolução longitudinal exigem incremento próprio.
- A primeira definição é provisionada por seed idempotente e versionado, sem interface administrativa.

## ADR-029 — Priority tie handling

**Status:** ACCEPTED

- Sem empate no menor score, o owner confirma a prioridade com justificativa curta.
- Em empate no menor score, nenhuma escolha humana é aceita; o estado permanece aguardando futuro desempate TutorIA.
- TutorIA não será improvisado no PRI-2.7, não acessará o banco diretamente e exigirá Feature Spec própria antes de decidir.
- Confirmar prioridade não cria Ciclo, Missão, prazo, meta ou plano de ação.

## ADR-030 — First cycle lifecycle

**Status:** ACCEPTED

- O primeiro ciclo começa imediatamente após comando explícito do owner e dura 90 dias corridos.
- Título e data final são derivados da prioridade e da data inicial; não são editáveis neste incremento.
- Existe no máximo um ciclo por organização e por prioridade.
- O ciclo permanece ativo após a data final até que um incremento futuro defina a transição de estado.
- Ciclo não cria Missões, metas, tarefas, ferramentas ou progresso.

## ADR-031 — Initial mission methodology and lifecycle

**Status:** ACCEPTED

- Missões são dados metodológicos versionados e suas instâncias preservam um snapshot imutável.
- A revisão inicial atende somente `Liderança & Equipe` com três Missões ordenadas: clareza de papéis, ritmo de gestão e delegação responsável.
- Somente a primeira Missão nasce `available`; as demais nascem `locked`.
- Existe no máximo uma Missão disponível por ciclo.
- Não há conclusão, desbloqueio, edição, reordenação ou substituição neste incremento.
- Missão não antecipa Ferramenta, Implementação, Evidência, Evolução ou TutorIA.

## ADR-032 — Structured tool definitions and drafts

**Status:** ACCEPTED

- Ferramentas são definições metodológicas versionadas com schema publicado, nunca campos codificados diretamente na interface.
- A primeira Ferramenta é o `Mapa de Papéis e Decisões`, vinculada somente à primeira Missão de `Liderança & Equipe`.
- Existe no máximo um rascunho por Missão; o payload é validado integralmente no servidor.
- O rascunho contém de 1 a 20 entradas e permanece editável após a data final do ciclo.
- Salvar não submete, aprova, conclui ou desbloqueia Missão e não representa Implementação, Evidência ou Evolução.

## ADR-033 — Cloud-first secure release trains

**Status:** ACCEPTED

- Incrementos consecutivos podem ser definidos e aprovados em lote quando compõem uma entrega vertical coerente.
- Governança, migrations, RLS, testes e rastreabilidade continuam obrigatórios por incremento.
- Desenvolvimento ocorre em branch e chega à produção por um único merge em `main` após CI completo.
- Produção recebe um deploy por Release Train; alterações exclusivamente documentais são ignoradas pelo build do Netlify.
- Nenhuma instalação local no computador do owner é exigida; GitHub, CI, Netlify e Supabase são os planos de controle em nuvem.
- Proteção administrativa de `main` e imposição Git-only devem ser ativadas nas plataformas quando seus conectores expuserem essa configuração ou pelo painel do owner.
