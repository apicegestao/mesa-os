import { z } from "zod";

const fieldSchema = z.object({
  code: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  label: z.string().trim().min(3).max(120),
  kind: z.enum(["text", "money", "percentage", "number", "date", "choice"]),
  required: z.boolean(),
  choices: z.array(z.string().trim().min(1).max(80)).min(2).max(12).optional(),
}).strict().superRefine((field, context) => {
  if (field.kind === "choice" && !field.choices) context.addIssue({ code: "custom", message: "choice_requires_options" });
  if (field.kind !== "choice" && field.choices) context.addIssue({ code: "custom", message: "options_only_for_choice" });
});

export const workbenchToolSpecSchema = z.object({
  code: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  version: z.number().int().positive(),
  title: z.string().trim().min(3).max(120),
  methodologyOutcomeCode: z.string().regex(/^t[1-4]_[a-z]+_[a-z0-9_]+$/),
  fields: z.array(fieldSchema).min(1).max(80),
  analysisDimensions: z.array(z.string().trim().min(3).max(100)).min(1).max(12),
  exportFormats: z.array(z.enum(["pdf", "xlsx"])).min(1).max(2),
}).strict().superRefine((spec, context) => {
  const duplicate = spec.fields.find((field, index) => spec.fields.findIndex((candidate) => candidate.code === field.code) !== index);
  if (duplicate) context.addIssue({ code: "custom", message: `duplicate_field:${duplicate.code}` });
});

export type WorkbenchToolSpec = z.infer<typeof workbenchToolSpecSchema>;

export const DRE_WORKBENCH_SPEC: WorkbenchToolSpec = {
  code: "dre_management_v1",
  version: 1,
  title: "DRE gerencial",
  methodologyOutcomeCode: "t1_finance_dre_dashboard",
  fields: [
    { code: "period", label: "Período de referência", kind: "date", required: true },
    { code: "revenue", label: "Receita líquida", kind: "money", required: true },
    { code: "variable_costs", label: "Custos variáveis", kind: "money", required: true },
    { code: "fixed_costs", label: "Custos fixos", kind: "money", required: true },
    { code: "operating_expenses", label: "Despesas operacionais", kind: "money", required: true },
    { code: "financial_result", label: "Resultado financeiro", kind: "money", required: false },
    { code: "taxes", label: "Tributos", kind: "money", required: false },
  ],
  analysisDimensions: ["receita", "margem", "estrutura de custos", "despesas", "resultado", "tendência"],
  exportFormats: ["pdf", "xlsx"],
};

export function validateWorkbenchToolSpec(input: unknown): { valid: true; spec: WorkbenchToolSpec } | { valid: false; reason: string } {
  const parsed = workbenchToolSpecSchema.safeParse(input);
  return parsed.success ? { valid: true, spec: parsed.data } : { valid: false, reason: parsed.error.issues[0]?.message ?? "invalid_tool_spec" };
}
