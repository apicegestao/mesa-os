# Definition Pack — FIN-3.1A Fundação de Receita

**Status:** DRAFT — requer aprovação explícita para BUILD em homologação

## Objetivo

Criar o núcleo canônico e portátil de receita da Mesa dos Donos, separado do CRM, do acesso do membro e de qualquer provedor de pagamento. A equipe interna poderá estruturar oferta, preço versionado, proposta, contrato, cobrança, estado de pagamento e direito de acesso (`entitlement`) com trilha de auditoria.

## Autoridades consultadas

- Constitution 1.1, especialmente menor privilégio, rastreabilidade e não antecipação de produto;
- Construction Protocol 1.2 e ADR-002, ADR-003, ADR-004, ADR-033, ADR-035 e ADR-040;
- fonte histórica `Mesa OS V2`, recuperada e canonizada no Operating Model R2;
- `docs/181-BACKOFFICE-FINANCE-INTELLIGENCE-OPERATING-MODEL-R2.md`;
- Current Scope: FIN ainda não está autorizado para BUILD.

## Decisões de produto e modelo

1. O Mesa OS não armazena cartão, conta bancária, chave PIX ou credenciais de pagamento.
2. A fonte canônica não é o checkout: proposta, contrato, cobrança, pagamento e entitlement são entidades próprias e auditáveis.
3. A liberação de acesso deriva somente de contrato/pagamento confirmado e política aprovada; retorno de navegador, mensagem ou screenshot não libera acesso.
4. Financeiro opera receita; Comercial cria/solicita propostas apenas dentro da própria alçada; Concierge enxerga elegibilidade mínima para onboarding; TI opera saúde técnica sem ler dados por conveniência.
5. Todo ajuste financeiro relevante é um novo fato auditável; não há sobrescrita silenciosa de estado histórico.

## Escopo FIN-3.1A

### Dados canônicos

- catálogo de ofertas e preços versionados, moeda, vigência e elegibilidade;
- proposta comercial e itens, com responsável e estado;
- contrato e itens contratados;
- assinatura/direito contratado;
- cobrança/fatura com vencimento, valor, referência externa opcional e estado;
- pagamento e conciliação manual controlada, sem qualquer dado sensível do meio de pagamento;
- entitlement de acesso, derivado por política e temporalidade;
- eventos e auditoria financeira imutável.

### Backoffice e permissões

- incluir o papel interno **Financeiro** e capabilities mínimas por função;
- Admin aprova exceções e atribui função;
- Financeiro cria e atualiza os fatos previstos, dentro de política;
- Comercial cria ou solicita proposta na carteira permitida e enxerga apenas seu status;
- Concierge vê somente a elegibilidade necessária para concluir onboarding;
- nenhuma tela é exposta ao membro neste bloco.

### Interface inicial

- visão interna de proposta/contrato/cobrança, sem dashboard executivo;
- estados claros: rascunho, pendente, confirmado, vencido, cancelado, ajustado;
- histórico por item e ações permitidas pelo papel;
- CRM apenas recebe um status de receita mínimo e não ganha dados de pagamento.

## Fora do escopo

- checkout público/real, cartão, PIX, provedor, token, segredo, webhook ou integração externa;
- geração de nota fiscal, contabilidade, fiscal, estorno automatizado, boleto ou múltiplos provedores;
- cobrança automática, comunicação por e-mail/WhatsApp/Instagram, campanhas ou automações;
- acesso de membro a informações financeiras;
- dados metodológicos, TutorIA, chat, IA, Intelligence, recomendação de preço ou dados de membros fora da finalidade de acesso contratado;
- produção e promoção automática.

## Segurança e privacidade

- migrations aditivas e versionadas; RLS deny-by-default e RPC/API com capability explícita;
- nenhum segredo ou dado de pagamento no browser, log, Git ou banco Mesa OS;
- identificadores externos são minimizados e não autorizam estado por si só;
- transições financeiras são validadas no servidor e auditadas com ator, data, recurso, ação e motivo;
- retenção, exportação e exclusão serão definidos antes de qualquer uso real em produção;
- testes de escopo: Comercial não vê carteira alheia; Concierge não vê valores/dados financeiros; TI não vê dados de negócio.

## Critérios de aceite

1. Uma oferta e preço versionados podem sustentar proposta, contrato e cobrança sem depender de checkout.
2. Um pagamento confirmado por ação Financeiro autorizada cria ou atualiza entitlement conforme política explícita e auditável.
3. Nenhuma confirmação visual, URL ou entrada do cliente libera acesso.
4. Permissões de Admin, Financeiro, Comercial e Concierge são verificadas no banco e no servidor.
5. Não há dados sensíveis de pagamento, canais externos, IA ou dados metodológicos no diff.
6. RLS, autorização, estados inválidos, auditoria, lint, typecheck, testes e build passam em homologação.

## Sequência posterior

Somente após FIN-3.1A homologado, o FIN-3.1B poderá definir um provedor de checkout, assinatura de webhook, idempotência, reconciliação automática, segredos e plano de rollback.

## Decisão solicitada ao owner

**“Aprovo o Definition Pack FIN-3.1A”** autoriza Change Request do Current Scope, Pre-Flight e BUILD exclusivamente em homologação. Não autoriza checkout, integração financeira, pagamento real, comunicação externa, Intelligence nem produção.
