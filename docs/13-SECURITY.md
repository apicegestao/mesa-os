# Security Baseline

- Segredos são mantidos fora do Git e validados no runtime apropriado.
- Apenas URL e publishable key podem chegar ao browser.
- Tabelas futuras em schemas expostos terão grants explícitos, RLS e políticas de autorização por ownership/tenant.
- `TO authenticated` sozinho não é autorização.
- Views futuras usarão `security_invoker` quando expostas.
- Funções `security definer` são proibidas por padrão e exigem revisão específica.
- Logs não devem incluir tokens, cookies, payloads sensíveis ou dados empresariais.
- Headers básicos de proteção são configurados no Next.js e Netlify.
- Dependências ficam fixadas no lockfile e são verificadas no CI.

## Identity & Access

- Magic link usa `shouldCreateUser: false`; a aplicação não oferece cadastro público.
- Sessões SSR usam cookies e PKCE por meio de `@supabase/ssr`.
- Rotas autenticadas validam claims; autorização organizacional permanece no RLS.
- Vínculos são negados por padrão e uma identidade possui no máximo uma organização no primeiro release.
- Funções `security definer` ficam no schema privado, usam `search_path` vazio, validam `auth.uid()` e têm execução revogada de `PUBLIC`.
- Respostas de solicitação de login não revelam se um e-mail existe.
- Callback aceita apenas destinos internos para evitar open redirect.
