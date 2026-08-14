# Definition Pack — OPS‑3.0C Visão Metodológica Global do Mentor

**Status:** DRAFT — requer aprovação explícita para BUILD em homologação.

## Objetivo

Corrigir a fronteira operacional: Concierge permanece organizado por carteira; Mentor passa a consultar a comunidade de membros para orientar, priorizar apoio e preparar encontros, sob um envelope metodológico mínimo, leitura auditada e sem acesso a conteúdo sensível.

## Escopo proposto

- capability exclusiva de Mentor para listar organizações com vínculo ativo, em visão metodológica global;
- campos permitidos: organização, ciclo atual, prioridade confirmada, próxima ação derivada, progresso canônico, pedido de apoio estruturado e contagem de marcos aprovados;
- filtros por período, estágio metodológico e sinal de atenção; nenhum filtro ou ordenação por dado sensível;
- cada consulta e detalhe acessado geram trilha de auditoria;
- Concierge permanece limitado a atribuições ativas próprias e ao seu envelope operacional;
- a Intelligence pode gerar sinais agregados para o Mentor, mas não entrega dados de outra organização além do envelope já permitido.

## Dados proibidos

- chat bruto, memória TutorIA, anexos, texto de Evidência, notas privadas, conteúdo de ferramentas, dados financeiros, dados comerciais, termos, recibos ou informações pessoais desnecessárias;
- comparações públicas entre membros, ranking, perfil comportamental ou decisão automatizada;
- edição de ciclo, Missão, prioridade, ferramenta, Evidência, contexto ou acesso de membro.

## Controles

1. RLS deny-by-default; apenas RPCs com identidade, capability e auditoria.
2. Envelope definido no SQL: o frontend não escolhe colunas, organização ou escopo.
3. Revogação do papel Mentor remove acesso imediatamente.
4. Consultas paginadas, com limitação de taxa e sem exportação neste bloco.
5. Testes comprovam que Mentor não obtém campos proibidos e Concierge não obtém visão global.

## Fora do escopo

Modelo de IA ativo, sugestão individual automatizada, comunicação externa, WhatsApp, calendário, acesso a conversa, exportação, alteração metodológica, produção e qualquer ação em nome do membro.

## Critérios de aceite

- Mentor autorizado visualiza toda a comunidade somente pelo envelope mínimo.
- Mentor sem papel ativo e Concierge não visualizam esse conjunto.
- Toda leitura gera auditoria sem registrar conteúdo sensível.
- Nenhuma função de escrita metodológica é exposta ao Mentor.
- lint, typecheck, testes de isolamento, build e Security Advisor passam em homologação.

## Decisão solicitada ao owner

**“Aprovo o Definition Pack OPS‑3.0C”** autoriza Change Request, Pre‑Flight e BUILD somente em homologação. Não autoriza acesso a conteúdo bruto, dados financeiros/comerciais, IA ativa, automação, comunicação externa ou produção.
