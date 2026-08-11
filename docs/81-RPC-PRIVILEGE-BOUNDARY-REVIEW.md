# Revisão de Segurança — Fronteira de privilégios dos RPCs

**Escopo:** RT-2.20 / ambiente isolado de teste

## Problema encontrado

O advisor do Supabase sinalizou funções `SECURITY DEFINER` executáveis pelo papel `authenticated` no esquema público. Embora as funções validassem identidade, owner ativo e parâmetros, a lógica privilegiada continuava exposta como endpoint RPC.

## Correção aplicada

- A lógica de domínio privilegiada foi movida do esquema exposto `public` para `private`.
- Cada endpoint em `public` agora é uma função SQL `SECURITY INVOKER`, sem privilégios elevados e com assinatura compatível com a aplicação atual.
- As funções internas mantêm busca com caminho vazio, validação de autenticação e validação de owner ativo.
- Privilégios de execução para `anon` e `PUBLIC` foram revogados; somente `authenticated` pode chamar as portas públicas e os contratos internos necessários à delegação.

## Funções protegidas

Diagnóstico, prioridade, ciclo, provisionamento de Missões, rascunho de Ferramenta, Implementação, submissão de Evidência e correção de Evidência.

## Verificação

- O advisor de segurança retornou **zero alertas** no branch de teste.
- Consulta de catálogo confirmou: todas as portas públicas são `SECURITY INVOKER`; somente as implementações no esquema `private` são `SECURITY DEFINER`.
- Uma chamada autenticada sem sessão atravessou a porta pública e foi rejeitada pela verificação interna de autenticação, comprovando que não há bypass de autorização.

## Limites

Esta correção não libera produção por si só. O merge ainda exige revisão de migrations, CI, pré-release, promoção do branch Supabase, deploy consolidado e smoke autenticado.
