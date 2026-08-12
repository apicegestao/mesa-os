# Post-Flight — RT-2.26H Termos Únicos e Reaceite Temporal

**Ambiente:** Supabase de homologação `tqpxqevlhfyqnjdrhlhd`  
**Produção:** não alterada  
**Resultado:** PASS

## Entregue

- Um único Termo de Uso `mesa_os_terms` v1, incluindo a autorização para contexto longitudinal do TutorIA.
- Aceite obrigatório no primeiro acesso e antes de áreas autenticadas.
- Recibo por identidade, com versão, hash, data/hora e histórico permanente.
- Política organizacional vinculada à mesma versão aceita pelo owner.
- Retirada da personalização disponível sem apagar registros canônicos.

## Atualização futura

1. Redigir e revisar o novo texto.
2. Publicar uma nova versão com conteúdo e hash no mesmo artefato de mudança.
3. Retirar a versão anterior de publicação, preservando-a para prova e histórico.
4. O sistema passa a exigir aceite da nova versão no próximo acesso.
5. Validar recibos, elegibilidade, RLS e segurança em homologação antes de promoção.

## Validações

- Hash da versão publicada confere com o texto persistido.
- Security Advisor sem alertas.
- 94 testes, lint, typecheck e build aprovados.
