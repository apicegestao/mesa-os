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
