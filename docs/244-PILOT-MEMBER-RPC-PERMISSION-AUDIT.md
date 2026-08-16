# 244 — Auditoria de permissões dos fluxos ativos do membro

**Status:** concluída em homologação (`pjkfifjcaezspwessaem`)  
**Data:** 16 de agosto de 2026  
**Escopo:** validação pré-smoke do piloto T1; não altera produção.

## Objetivo

Confirmar que cada ação ativa da jornada do membro possui a permissão técnica
necessária sem criar um caminho anônimo, transorganizacional ou sem identidade.

## Cobertura verificada

Foram conferidos os 17 fluxos ativos de:

- diagnóstico, prioridade, ciclo, Missões, ferramenta, implementação e Evidência;
- Termos e contexto longitudinal;
- conversa, memória e workspace do TutorIA.

Para cada implementação privada correspondente, a auditoria confirmou:

1. execução permitida para `authenticated`;
2. execução negada para `anon`;
3. presença de validação de identidade autenticada;
4. presença de validação de escopo organizacional.

Não houve ação pendente de correção. As permissões específicas adicionadas na
correção 243 completam os três fluxos que impediam o membro de salvar rascunho
de ferramenta ou manter a memória do TutorIA.

## Segurança

O Security Advisor não encontrou nova exposição. O único aviso mantido é o
controle de senhas vazadas desabilitado, que não participa do fluxo atual de
acesso por código temporário. Sua ativação continua uma decisão de endurecimento
para o momento em que autenticação por senha for considerada.

## Resultado para o piloto

A camada de permissões não é mais um bloqueio conhecido para o smoke consolidado.
O próximo gate permanece funcional: executar a jornada T1 completa com uma conta
de membro de homologação, registrando apenas falhas reais de experiência ou
integração.
