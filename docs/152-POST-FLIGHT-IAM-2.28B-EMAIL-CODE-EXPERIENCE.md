# Post-Flight — IAM-2.28B Experiência de código por e-mail

**Status:** código integrado em branch; configuração operacional e produção não alteradas.

## Implementado

- A tela de acesso agora prioriza e-mail → código temporário → sessão, sem senha como primeira experiência.
- A solicitação usa `shouldCreateUser: false`; não cria usuário quando o e-mail não estiver pré-provisionado.
- A confirmação exige código numérico de seis a oito dígitos e usa `verifyOtp` com tipo `email`.
- Respostas de solicitação e confirmação são neutras, evitando enumeração de e-mail ou organização.
- GitHub, senha e link por e-mail permanecem alternativas secundárias enquanto a operação completa não é promovida.

## Deliberadamente não implementado

- alteração do template de e-mail do Supabase para `{{ .Token }}`;
- envio de e-mails, segredo, identidade de teste, matrícula real, migration remota ou Google;
- cadastro público, provisionamento em rota pública, produção ou backoffice.

## Verificação

- Fluxo técnico confirmado na documentação atual do Supabase: `signInWithOtp` usa o template para enviar OTP quando `{{ .Token }}` está presente; `verifyOtp` confirma o código de e-mail. A opção `shouldCreateUser: false` impede signup. [Referência oficial](https://supabase.com/docs/reference/javascript/auth-signinwithotp).
- lint aprovado;
- typecheck aprovado;
- 39 arquivos de teste e 106 testes aprovados;
- build aprovado.

## Próximo gate operacional

Aplicar a migration na homologação isolada, ajustar o template de e-mail para `{{ .Token }}`, configurar rate limits, criar uma matrícula/identidade de teste, executar Advisor e realizar smoke. Nenhuma dessas ações foi executada neste bloco.
