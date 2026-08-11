# Post-Flight — RT-2.21 TutorIA Foundation

**Status:** partial build checkpoint — 2026-08-11  
**Ambiente:** branch Supabase isolado `tqpxqevlhfyqnjdrhlhd`; produção não alterada.

## Implementado

- Contrato determinístico de política do TutorIA com três resultados explícitos: `allow`, `deny` e `escalate`.
- Negações testadas para ausência de sessão, substituição de identidade e vínculo organizacional inativo.
- Tabelas de auditoria aditivas para contexto, decisão de política e execução de tool, sem texto de conversa, evidência ou segredo.
- RLS e grants mínimos nas três tabelas; `anon` não tem acesso.
- Índices de escopo e de chaves estrangeiras incluídos após a revisão de performance.
- Gateway server-side que registra somente a presença contextual protegida do TutorIA na visão Hoje; não chama modelo nem executa regra de negócio.
- Catálogo estrito de duas leituras permitidas: estado derivado do próprio membro e resumo quantitativo do mapa metodológico publicado. O contrato não aceita escrita, evidência bruta, texto de ferramenta ou conteúdo conversacional.
- Um pedido de tool não catalogada passa a retornar `escalate`, em vez de ampliar permissões silenciosamente.
- Se o registro de auditoria não puder ser concluído, o gateway retorna `escalate/audit_unavailable`; não há continuidade silenciosa.
- CTA visual permanece desabilitada e honesta: o contexto está protegido, mas a orientação conversacional ainda não está ativa.

## Verificações

- Inserção autenticada com vínculo ativo comprovada em transação revertida no branch de teste.
- Verificação de schema confirmou RLS nas três tabelas, `SELECT`/`INSERT` para `authenticated` e nenhum `SELECT` para `anon`.
- Prova transacional de isolamento confirmou que uma identidade com vínculo ativo não consegue inserir auditoria em outra organização (`denied_by_rls`); o registro e a organização de prova foram revertidos.
- Performance advisor: os alertas de chaves estrangeiras introduzidos pelas novas tabelas foram resolvidos.
- Advisor de segurança do Supabase: sem alertas após habilitar, exclusivamente na homologação, a proteção contra senhas vazadas.
- `pnpm check` passou após o catálogo: lint, typecheck, 48 testes e build de produção.

## Gates ainda pendentes

- Executar a bateria completa de lint, typecheck, testes e build após o catálogo de tools.
- Homologação autenticada da nova trilha de auditoria e decisão explícita de promoção. Produção permanece inalterada.

## Deliberadamente não implementado

- modelo, provedor ou segredo de IA;
- chat, RAG, memória conversacional ou aprendizado coletivo;
- avaliação/autorização de evidência, desempate, geração de ferramenta ou qualquer ação de negócio;
- WhatsApp, automação, e-mail proativo ou integração externa;
- promoção, merge ou deploy de produção.

## Próximo trabalho dentro do RT-2.21

Completar o catálogo de tools de leitura com respostas mínimas tipadas e ampliar os testes de gateway/auditoria. O incremento continua impedido de promover enquanto o controle de senha vazada não estiver habilitado e enquanto a homologação autenticada permanecer pendente.
