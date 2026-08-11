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
