# Pre-Flight — DIA-3.8

**Autoridades:** Constitution, V2 Scope, Construction Protocol, ADR-036, ADR-038, ADR-043, Current Scope e decisão explícita do owner.  
**Escopo:** overlay do Raio-X, navegação de dimensão, prioridade automática e desempate metodológico auditável.  
**Fora do escopo:** iniciar ciclo automaticamente, alterar metodologia, modelo de IA, custo, conteúdo de membro ou permissões.  
**Risco:** uma prioridade automática inadequada. **Controle:** usa apenas scores do snapshot concluído; em empate, posição publicada e rastreável; inserção é transacional e idempotente.  
**Validação:** testes, typecheck, lint, build, migration, verificação de função e advisor de segurança.
