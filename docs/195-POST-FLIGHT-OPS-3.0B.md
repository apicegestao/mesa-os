# Post-Flight — OPS-3.0B Carteira de Concierge e Mentor

**Ambiente alterado:** homologação `pjkfifjcaezspwessaem` somente. Produção não foi alterada.

## Entregue

- papel interno `mentor` e atribuição temporal/auditável de carteiras;
- Admin pode atribuir e revogar; Mentor e Concierge consultam somente atribuições ativas próprias;
- envelope do Mentor: organização, ciclo ativo, próxima Missão disponível e contagem de marcos aprovados;
- envelope do Concierge: organização e contagem de matrículas pendentes;
- nenhuma conversa, memória TutorIA, conteúdo de evidência, anexo, nota privada, dado comercial ou financeiro é retornado pela carteira;
- tabelas com RLS e negação de acesso direto; RPCs com `auth.uid()`, capability, `SECURITY DEFINER`, `search_path` vazio e grants explícitos.

## Verificação

- migrations aplicadas: `ops_3_0b_mentor_role`, `ops_3_0b_portfolio_core`;
- consulta de verificação confirmou tabelas e leitor de carteira em homologação;
- lint passou; typecheck passou; 42 arquivos de teste / 114 testes passaram; build de produção passou.

## Revisão de segurança

O Security Advisor mantém avisos já conhecidos para RPCs internas `SECURITY DEFINER` concedidas a `authenticated`, inclusive as novas RPCs de carteira. O acesso é deliberadamente protegido dentro de cada função por identidade autenticada, capability e escopo de carteira, com acesso direto às tabelas negado. Proteção contra senha vazada também continua um alerta do Supabase, embora este fluxo de acesso use código temporário, não senha.

## Gate remanescente

Antes de uma promoção, executar smoke real com três contas distintas: Admin (atribuir/revogar), Mentor (somente carteira atribuída) e Concierge (somente pendências atribuídas). Não foram concedidos papéis nem criadas carteiras reais neste Post‑Flight.
