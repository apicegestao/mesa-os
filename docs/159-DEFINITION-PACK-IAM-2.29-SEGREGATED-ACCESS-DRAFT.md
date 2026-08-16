# Definition Pack IAM-2.29 — Acesso simples do membro e backoffice segregado

**Status:** APPROVED FOR BUILD — owner aprovou em 2026-08-13.

## Problema

O acesso de homologação e a autorização de novos membros não podem depender de service keys, SQL manual ou convites difíceis de repetir. O membro precisa de entrada simples; a equipe Mesa precisa de uma superfície interna separada, sem misturar operação, suporte e dados de membro.

## Decisão proposta

Manter a regra de matrícula prévia e criar duas experiências de autenticação, com a mesma infraestrutura de código temporário por e-mail:

```mermaid
flowchart LR
  M[Login do membro] --> C[Código por e-mail]
  C --> V{Identidade previamente autorizada?}
  V -- não --> N[Resposta neutra; nenhum cadastro]
  V -- membro --> A[/app — ambiente do membro]
  E[Login da equipe] --> CE[Código por e-mail]
  CE --> S{Identidade da equipe ativa?}
  S -- não --> NS[Sem acesso interno]
  S -- sim --> O[/ops — backoffice separado]
```

## Escopo proposto

### 1. Entrada simples do membro

- `/login` permanece a única porta do membro: e-mail autorizado, código temporário e resposta não enumerável.
- O código não cria usuário, organização, membership ou matrícula.
- Após sessão válida, a aplicação identifica o membership ativo e entrega somente `/app` no escopo daquela organização.
- O login usa exclusivamente código temporário por e-mail; senha, link mágico, cadastro público e login social não fazem parte deste incremento.

### 2. Área interna da Mesa

- Nova rota segregada `/ops/login` e `/ops`, visualmente e logicamente fora da área de membros.
- Registro mínimo `internal_staff_access`: identidade individual, estado `active`/`revoked`, data de ativação, auditoria e nenhum dado de empresa de membro.
- Uma única capability inicial: `internal_operator`. Não cria uma matriz ampla de papéis nem altera os papéis de negócio `owner` e `member`.
- A elegibilidade de equipe é conferida no servidor e no banco; URL direta não concede acesso.
- A equipe não recebe acesso global aos dados dos membros. Consulta, suporte ou impersonação exigem incremento próprio, auditado e com escopo explícito.

### 3. Bootstrap e operação

- Dois e-mails internos, fornecidos pelo owner em etapa própria, serão provisionados uma única vez em homologação como identidades de equipe.
- Depois do bootstrap, `/ops` permite apenas criar, revogar e reenviar a matrícula de acesso de membro; não permite criar organizações, alterar metodologia, alterar dados de negócio, governança de IA ou acessar conversas.
- Matrículas mantêm expiração, organização e papel previstos. Provisionamento continua server-side, idempotente e auditado.

### 4. Segurança e confiabilidade

- Sem `service_role` no browser, Git, logs ou interface da equipe.
- Sem cadastro público, vínculo automático, enumeração de e-mail ou fallback que contorne a matrícula.
- RLS e grants separados para `internal_staff_access`; membros não podem ler, criar nem inferir registros internos.
- Auditoria de operações internas contém IDs, ação e temporalidade; não inclui códigos OTP, chaves, conteúdos de conversa ou dados sensíveis desnecessários.
- Rate limit por e-mail/IP para pedidos de código e limite de tentativas de verificação; bloqueios têm mensagem neutra e recuperável.

## Critérios de aceite

1. Um membro previamente autorizado entra por e-mail + código e só acessa sua organização.
2. E-mail não autorizado recebe resposta neutra e não cria nenhum registro.
3. Uma identidade interna ativa entra por `/ops/login`; uma identidade de membro não entra em `/ops`.
4. `/ops` permite criar/revogar matrícula sem expor segredo ou dados de outras organizações.
5. Nenhuma conta interna tem leitura global de dados de membros por padrão.
6. Testes cobrem negação de rota, isolamento de organização, expiração/revogação de matrícula, rate limit e ausência de enumeração.
7. Homologação completa os dois smoke tests antes de qualquer promoção; produção não muda durante BUILD.

## Fora do escopo

- Cadastro público, senha, Google, GitHub, MFA, SSO, WhatsApp e checkout.
- Novo papel de negócio além de `owner` e `member`; `internal_operator` é somente uma capability de infraestrutura interna, não um papel de membro.
- Backoffice completo, CRM, suporte com impersonação, dashboard de negócio, administração da metodologia, governança de IA, Concierge ou TutorIA interno.
- Acesso ou cruzamento automático de informações de membros pela equipe.
- Alteração da produção ou disponibilização de `/ops` antes de homologação e promoção autorizada.

## Impacto em governança

O incremento cria uma fronteira interna de autorização adicional e, por isso, exige Change Request no `10-CURRENT-SCOPE.md` após a aprovação deste pack. Mantém ADR-027: entrada de membros é por autorização prévia, não por signup público.

## Plano de entrega acelerado, sem perder controles

1. Alignment/Pre-Flight e migration isolada para staff access e auditoria.
2. Bootstrap dos dois e-mails internos somente na branch Supabase de homologação.
3. `/login` e `/ops/login` com código de e-mail, respostas neutras e rate limit.
4. `/ops` mínimo para matrícula/revogação; sem leitura de dados de negócio.
5. CI, Security Advisor, smoke membro + equipe, Post-Flight e somente então decisão de promoção.

## Decisão solicitada ao owner

Aprovar IAM-2.29 autoriza construir o acesso segregado e o backoffice mínimo de matrículas, exclusivamente em branch/homologação. Não autoriza produção, acesso global a dados, novas integrações de login ou cadastro público.
