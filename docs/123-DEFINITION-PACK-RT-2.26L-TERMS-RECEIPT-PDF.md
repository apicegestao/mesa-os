# Definition Pack - RT-2.26L Recibo PDF dos Termos

**Status:** APPROVED FOR HOMOLOGATION

## Objetivo

Permitir que cada membro baixe um comprovante eletrônico do próprio evento de aceite ou retirada de personalização dos Termos de Uso.

## Contrato

- O recibo exibe evento, título e versão do documento, data/hora em horário de Fortaleza, hash SHA-256 e identificador do recibo.
- O PDF é gerado sob demanda no servidor, com resposta privada e sem cache compartilhado.
- O histórico continua disponível após a publicação de uma versão nova dos Termos; versões anteriores não deixam de aparecer nem de baixar quando são retiradas de publicação.
- Uma pessoa autenticada só pode consultar e baixar eventos ligados à sua própria identidade e organização ativa.

## Limites

- Não há assinatura digital qualificada, certificado ICP-Brasil ou afirmação de equivalência a esse tipo de assinatura.
- Não há exposição de e-mail, dados de outros membros, conteúdo de conversa ou informação de outra organização no recibo.
- Não existe edição, exclusão ou reemissão com conteúdo alterado.

## Segurança

As leituras históricas passam por funções privadas com `security definer`, `search_path` vazio, verificação explícita de identidade autenticada e de vínculo ativo. As funções públicas são somente invocadoras, inacessíveis a `anon` e liberadas exclusivamente ao papel autenticado.
