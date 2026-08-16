# Pre-Flight — OPS-3.0D Suporte ao membro

**Ambiente:** homologação `pjkfifjcaezspwessaem` somente.  
**Objetivo:** pedido de apoio → triagem → responsável → resposta/encerramento, sem canal externo.

## Autoridades reconciliadas

- Constitution: simplicidade para o membro, menor privilégio e rastreabilidade;
- ADR-036/039: TutorIA central sem acesso direto ao banco e isolamento por organização/finalidade;
- Operating Model R2 e OPS-3.0B/C: Concierge por carteira, Mentor em envelope metodológico global mínimo;
- Definition Pack OPS-3.0D aprovado.

## Alterações previstas

- migration aditiva para solicitações, mensagens e auditoria de suporte, RLS deny-by-default e RPCs server-side;
- capability interna limitada e verificações de carteira/papel no SQL;
- área do membro para abrir e retomar os próprios atendimentos;
- painel interno de fila para Concierge, Mentor e Admin;
- tipos Supabase, testes de isolamento/validação e documentação.

## Fora do escopo

IA, envio externo, anexos, conteúdo de ferramentas, memória, exportação, automação, alteração metodológica, cobrança e produção.

## Condições de parada

Parar diante de acesso interorganizacional, exposição de conteúdo não previsto, necessidade de provedor externo, mudança de papel FROZEN, risco de retenção não autorizado ou falha de RLS/grants.

## Validação

Revisão da migration, isolamento por função/organização, lint, typecheck, testes relevantes, build e Security Advisor em homologação.
