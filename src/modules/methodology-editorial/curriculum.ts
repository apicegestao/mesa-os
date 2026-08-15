import { z } from "zod";

const curriculumUnitSchema = z.object({
  code: z.string().regex(/^t1_[a-z0-9_]+$/),
  title: z.string().min(3),
  businessOutcome: z.string().min(20),
  primaryToolCode: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  metrics: z.array(z.string().min(3)).min(1),
  tutorLimits: z.array(z.string().min(3)).min(1),
}).strict();

export const T1_EDITORIAL_CURRICULUM = [
  { code: "t1_finance_dre_dashboard", title: "DRE gerencial e painel mínimo", businessOutcome: "Decidir com resultado, caixa e indicadores essenciais, e não apenas pelo saldo bancário.", primaryToolCode: "dre_management_v1", metrics: ["dias_para_fechamento", "margem_de_contribuicao", "saldo_de_caixa"], tutorLimits: ["Não inventar números", "Não prestar aconselhamento contábil ou fiscal"] },
  { code: "t1_leadership_roles_org_chart", title: "Papéis, decisões e organograma essencial", businessOutcome: "Tornar explícito quem decide, executa e responde pelos resultados essenciais.", primaryToolCode: "raci_roles_decisions_v1", metrics: ["decisoes_concentradas_no_dono", "responsabilidades_sem_responsavel", "frequencia_de_rituais"], tutorLimits: ["Não criar organograma fictício", "Escalar conflito humano persistente"] },
  { code: "t1_marketing_sales_funnel_value", title: "Funil comercial e proposta de valor", businessOutcome: "Visualizar oportunidades reais, critérios de etapa e a próxima ação que move cada negociação.", primaryToolCode: "sales_funnel_value_v1", metrics: ["oportunidades_por_etapa", "conversao", "ticket_estimado", "acoes_sem_proximo_passo"], tutorLimits: ["Não prometer resultado comercial", "Não contatar leads"] },
  { code: "t1_processes_map", title: "Mapa de processo crítico", businessOutcome: "Fazer um processo crítico deixar de depender de memória, com fluxo, responsável e controle.", primaryToolCode: "critical_process_map_v1", metrics: ["tempo_de_ciclo", "falhas_ou_retrabalho", "etapas_sem_responsavel", "aderencia_ao_checklist"], tutorLimits: ["Não criar procedimento fictício", "Não afirmar melhoria sem fonte"] },
] as const;

export function validateT1EditorialCurriculum(input: unknown) {
  return z.array(curriculumUnitSchema).length(4).safeParse(input);
}
