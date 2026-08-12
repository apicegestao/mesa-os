# Pre-Flight — RT-2.26E Recibos de Aceite e Gate de Automação

**Status:** READY FOR BUILD — infraestrutura técnica sem ativação automática

## Alinhamento

Autoridades consultadas: Constitution, ADR-036, ADR-039, Definition Pack RT-2.26 aprovado, proposta 108 e CP-08. O owner autorizou estruturar o caminho automático, preservando a exigência de proteção e revisão jurídica.

## Escopo

- documentos jurídicos versionados e imutáveis após publicação;
- aceite autenticado, com hash, versão, momento e recibo recuperável pelo membro;
- política por organização que nasce desabilitada;
- contrato server-side que só considera automação elegível após documento publicado, aceite ativo e política explicitamente habilitada por processo administrativo futuro.

## Fora do escopo

- publicação de texto jurídico sem advogado; ativação de captura automática; backoffice; RBAC/MFA; coleta de IP, gravação de chat, uso de dados sensíveis, inteligência interna, produção.

## Riscos e validação

As novas tabelas terão RLS, sem escrita direta por cliente. O recibo terá referência à versão e hash, nunca dependerá de texto mutável. Migration somente em homologação, Security Advisor, testes de elegibilidade, lint, typecheck e build são obrigatórios.
