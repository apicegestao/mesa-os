# Ambientes e Operações

| Ambiente | Uso | Netlify | Supabase |
|---|---|---|---|
| development | trabalho local | `netlify dev` opcional | projeto local via CLI ou projeto dev dedicado |
| staging | validação de PR/deploy preview | deploy preview | projeto staging dedicado antes de dados de teste persistentes |
| production | operação real | site `mesa-os` (`828bc672-0a57-4e63-a9a9-03fa259a86b1`) | `vlkkokjbtmdeoxewsbiy`, `sa-east-1` |

## Variáveis

- `NEXT_PUBLIC_SUPABASE_URL`: pública.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: pública e limitada por grants/RLS.
- Chaves `sb_secret`/service-role: nunca recebem prefixo `NEXT_PUBLIC_` e não são necessárias no bootstrap.
- `LOG_LEVEL`: nível mínimo do logger server-side.

Valores reais ficam no provedor e em `.env.local`, nunca no Git. Deploy previews não devem herdar secrets de produção sem necessidade explícita.

## Deploy

O repositório está preparado para vinculação ao site Netlify existente. Publicação de produção exige CI verde e autorização explícita do release; o bootstrap não publica automaticamente.

O pnpm usa hoisting público (`.npmrc`) para compatibilidade com o adapter automático de Next.js da Netlify. O adapter não é fixado no projeto e permanece atualizado pela plataforma.
