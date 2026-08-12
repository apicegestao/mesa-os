# Post-Flight — IAM-2.28 Onboarding controlado

**Status:** BUILD concluído em branch; não aplicado a banco, homologação ou produção.

## Implementado

- Schema aditivo para matrículas de acesso com organização, e-mail normalizado, papel permitido, expiração, estado e vínculo de provisionamento.
- Auditoria imutável de criação, provisionamento, rejeição, revogação e expiração.
- RLS ativo e ausência de grants a `anon` e `authenticated` nas tabelas operacionais.
- Contrato de domínio que só permite provisionar matrícula pendente e ainda válida.
- Serviço server-side por portas injetadas: não contém segredo, não cria rota pública e não é acessível ao TutorIA.
- Testes de normalização, expiração, matrícula consumida e negação antes de chamar o provisionador.

## Deliberadamente não implementado

- aplicar a migration, criar matrícula, identidade, usuário, convite ou membership real;
- qualquer uso de service role, e-mail, código OTP, template de Auth, Google ou GitHub;
- cadastro público, vínculo automático, backoffice, MFA, SSO ou promoção de produção.

## Validação

- lint aprovado;
- typecheck aprovado;
- 38 arquivos de teste e 104 testes aprovados;
- build Next.js aprovado;
- a migration permanece local e exige revisão de Security Advisor após aplicação em ambiente seguro.

## Gate seguinte

Um incremento operacional separado precisa decidir e configurar, fora de código e sem segredo no chat:

1. como a operação interna cria uma matrícula;
2. qual canal transacional entrega o código OTP;
3. as credenciais isoladas por ambiente;
4. smoke com identidade de teste autorizada;
5. aplicação da migration, Advisor e promoção em Release Train.
