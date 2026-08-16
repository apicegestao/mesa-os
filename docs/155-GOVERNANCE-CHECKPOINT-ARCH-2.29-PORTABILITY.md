# Governance Checkpoint — ARCH-2.29 Portabilidade

**Status:** registrado no BUILD; sem mudança de escopo de produto ou promoção.

## Objetivo

Preservar a possibilidade de trocar provedor de hospedagem ou de dados sem tratar essa troca como uma promessa de migração imediata. A preocupação recuperada da conversa `Mesa OS V2` é autonomia operacional e continuidade do produto, não uma reescrita prematura.

## Autoridades consultadas

- `00-CONSTITUTION.md` — segurança, continuidade e decisões rastreáveis.
- `02-V2-SCOPE.md` — fundação modular e fontes canônicas.
- `08-ADR-DECISION-LOG.md` — isolamento organizacional, autenticação e operação em nuvem.
- `09-CONSTRUCTION-PROTOCOL.md` — YAGNI, não antecipar infraestrutura e não ampliar escopo sem Definition Pack.
- `10-CURRENT-SCOPE.md` — IAM-2.28, sem mudança de provedor autorizada.

## Estado atual verificável

| Camada | Estado | Leitura de portabilidade |
| --- | --- | --- |
| Aplicação | Next.js/TypeScript, módulos e CI no repositório | Pode ser hospedada fora do Netlify; não há regra de negócio crítica em função proprietária do host. |
| Banco | PostgreSQL, migrations versionadas | Exportável e migrável para PostgreSQL gerenciado compatível. RLS e papéis exigem validação na plataforma destino. |
| Autenticação | Supabase Auth via infraestrutura compartilhada | É o principal ponto de acoplamento atual; deve permanecer atrás de adaptadores e contratos de aplicação. |
| Deploy | Git + CI + configuração de ambiente | Netlify é um destino de deploy, não a fonte de verdade do produto. |

Firebase não é uma troca direta de Supabase: Firestore, Security Rules e o modelo documental representam uma replatformação, não uma simples mudança de hospedagem.

## Guardrails a partir deste checkpoint

1. Dados de domínio novos continuam em PostgreSQL com migrations aditivas e exportáveis.
2. Código de domínio não recebe APIs de host; integrações de deploy, e-mail, IA e autenticação ficam em adaptadores de infraestrutura.
3. Nenhum segredo é persistido no repositório; a configuração é declarada por ambiente.
4. Antes de qualquer migração futura de provedor, será aberto um Definition Pack específico com inventário de dados, plano de exportação, teste de restauração, plano de rollback e custo.
5. Backups, exportação e recuperação são requisitos operacionais futuros; não são simulados como capacidade já entregue.

## Fora do escopo deste checkpoint

- Trocar Netlify, Supabase ou banco agora.
- Introduzir Firebase, outra dependência de nuvem ou duplicação de dados.
- Alterar produção, credenciais, RLS ou fluxo de entrada.
- Refatoração ampla do acesso a dados durante IAM-2.28.

## Correção de migration relacionada

A migration-base de IAM-2.28 permaneceu somente com estrutura, RLS e revogação de privilégios. As políticas explícitas de negação vivem exclusivamente na migration incremental de hardening. Isso conserva a ordem aplicável do histórico e evita recriar policies ao levantar um ambiente novo.

## Critério de validação

- A cadeia de migrations pode ser aplicada em ordem sem colisão de nomes de policy.
- A branch de homologação continua com RLS, revogação de privilégios e políticas explícitas de negação já verificadas pelo Security Advisor.
- Nenhuma promoção é autorizada por este registro.
