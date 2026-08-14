# Definition Pack — FIN-3.1C Matrícula Automática após Pagamento

**Status:** DRAFT — requer aprovação explícita do owner.

## Decisão necessária

O FIN-3.1B confirmou o pagamento e o entitlement de forma segura. Para concluir a experiência prometida — usar no Mesa OS o mesmo e-mail informado no checkout e receber o código OTP — falta uma origem canônica para a organização do novo cliente.

O CRM atual conhece conta, contato e oportunidade, mas não possui um vínculo persistente entre a conta comercial e uma organização Mesa OS. O webhook não pode escolher ou criar esse vínculo por inferência.

## Proposta recomendada

1. Cada conta CRM elegível pode ter no máximo uma organização Mesa OS vinculada.
2. No primeiro pagamento confirmado de uma conta sem organização vinculada, um provisionador server-side cria uma organização com o nome da conta e a vincula atomicamente à conta CRM.
3. O contato principal pagador recebe matrícula `owner`, somente quando seu e-mail normalizado é válido e não conflita com identidade ou organização existente.
4. O provisionador cria a identidade/membership por meio da porta IAM já existente, com auditoria financeira e de matrícula. O primeiro acesso é sempre por OTP; URL de retorno do checkout nunca concede sessão.
5. Repetições do webhook reutilizam a mesma organização, matrícula e entitlement. Conflito de e-mail, compra para terceiro, múltiplas organizações, ausência de contato ou revogação prévia não são automatizados: entram em fila Concierge auditada.

## Segurança e privacidade

- execução exclusiva de serviço; nenhuma RPC nova para `anon` ou `authenticated`;
- RLS deny-by-default, `search_path` vazio e idempotência por contrato/pagamento;
- e-mail usado somente para a matrícula autorizada e nunca exposto em logs, resposta do webhook ou interface pública;
- nenhum cartão, PIX, payload bruto do provedor ou segredo é persistido;
- não há criação pública: a única causa automática é o evento assinado de pagamento confirmado, já reconciliado para um contrato canônico.

## Fora do escopo

Múltiplos usuários por compra, equipes, divisão de acesso, troca automática de e-mail, recuperação de conflito, comunicação transacional, produção, pagamento real, renovação e suspensão automatizada por inadimplência.

## Critérios de aceite

1. Primeiro pagamento válido cria uma única organização, matrícula e entitlement elegível.
2. Mesmo evento repetido não duplica nenhum registro.
3. O e-mail do checkout consegue solicitar OTP e acessar somente a organização vinculada.
4. Conflitos são bloqueados, auditados e encaminhados à Concierge sem criar acesso parcial.
5. Testes, RLS, lint, typecheck, build e smoke de homologação passam antes de qualquer promoção.

## Decisão solicitada

**“Aprovo o FIN-3.1C”** autoriza Change Request, migration aditiva, Pre-Flight e BUILD exclusivamente em homologação. Não autoriza produção.
