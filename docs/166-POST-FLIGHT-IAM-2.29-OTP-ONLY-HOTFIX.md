# Post-Flight — IAM-2.29 OTP-only

**Status:** BUILD concluído; homologação de entrega aguardando disponibilidade do provedor  
**Produção:** inalterada  
**Migration:** nenhuma

## Implementado

- `/login` e `/ops/login` passaram a oferecer exclusivamente e-mail + código
  temporário.
- GitHub OAuth, senha, configuração de senha, links mágicos e a rota de
  callback associada foram removidos das superfícies de acesso.
- A flag pública que podia esconder o único caminho de login foi removida.
- Após um pedido de código, a tela de confirmação aparece mesmo diante de
  falha transitória do provedor, sempre com resposta não enumerável.
- A validação exige código de seis dígitos e conserva `shouldCreateUser: false`.

## Verificações

- lint: aprovado
- typecheck: aprovado
- testes: 107 aprovados
- build de produção: aprovado
- `git diff --check`: aprovado

## Diagnóstico de infraestrutura

Os registros de Auth da homologação confirmaram pedidos OTP aceitos e, em
seguida, rejeições por limite de envio de e-mail do serviço padrão. Isso não
é uma falha de autorização, RLS ou interface; é um limite operacional do
remetente gratuito de homologação.

## Próximo gate obrigatório antes da promoção

Configurar SMTP transacional próprio no Supabase para o ambiente de produção,
com domínio autenticado (SPF, DKIM e DMARC), rate limit apropriado e segredo
somente no provedor/Supabase. A escolha do fornecedor e a criação de uma
conta externa exigem autorização específica do owner. Até lá, homologação
deve evitar múltiplas solicitações consecutivas para não esgotar o limite
temporário do provedor padrão.
