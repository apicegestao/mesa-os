import { z } from "zod";

const entryFieldSchema = z.object({
  code: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  label: z.string().trim().min(3).max(120),
  required: z.boolean(),
  maxLength: z.number().int().min(3).max(1_000),
}).strict();

const fieldSchema = z.object({
  code: z.string().regex(/^[a-z][a-z0-9_]{2,63}$/),
  label: z.string().trim().min(3).max(120),
  kind: z.enum(["text", "money", "percentage", "number", "date", "choice", "entries"]),
  required: z.boolean(),
  choices: z.array(z.string().trim().min(1).max(80)).min(2).max(12).optional(),
  entryFields: z.array(entryFieldSchema).min(1).max(12).optional(),
  minEntries: z.number().int().min(1).max(20).optional(),
  maxEntries: z.number().int().min(1).max(20).optional(),
}).strict().superRefine((field, context) => {
  if (field.kind === "choice" && !field.choices) context.addIssue({ code: "custom", message: "choice_requires_options" });
  if (field.kind !== "choice" && field.choices) context.addIssue({ code: "custom", message: "options_only_for_choice" });
  if (field.kind === "entries" && (!field.entryFields || !field.minEntries || !field.maxEntries || field.minEntries > field.maxEntries)) context.addIssue({ code: "custom", message: "entries_requires_schema" });
  if (field.kind !== "entries" && (field.entryFields || field.minEntries || field.maxEntries)) context.addIssue({ code: "custom", message: "entry_schema_only_for_entries" });
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
export type WorkbenchEntry = Record<string, string>;
export type WorkbenchPayload = Record<string, string | number | null | WorkbenchEntry[]>;

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

export const RACI_WORKBENCH_SPEC: WorkbenchToolSpec = {
  code: "raci_roles_decisions_v1", version: 1, title: "Mapa de papéis e decisões", methodologyOutcomeCode: "t1_leadership_roles_org_chart",
  fields: [{ code: "roles", label: "Papéis e decisões essenciais", kind: "entries", required: true, minEntries: 1, maxEntries: 20, entryFields: [
    { code: "role_name", label: "Papel ou área", required: true, maxLength: 80 }, { code: "expected_result", label: "Resultado esperado", required: true, maxLength: 300 },
    { code: "responsibilities", label: "Responsabilidades essenciais", required: true, maxLength: 1_000 }, { code: "decision_rights", label: "Decisões sem escalar", required: true, maxLength: 1_000 },
  ] }],
  analysisDimensions: ["clareza de papéis", "responsabilidade", "direitos de decisão", "dependência do dono"], exportFormats: ["pdf", "xlsx"],
};

export const SWOT_WORKBENCH_SPEC: WorkbenchToolSpec = {
  code: "swot_strategic_reading_v1", version: 1, title: "Leitura estratégica SWOT", methodologyOutcomeCode: "t1_marketing_sales_funnel_value",
  fields: [
    { code: "strengths", label: "Forças", kind: "entries", required: true, minEntries: 1, maxEntries: 12, entryFields: [{ code: "insight", label: "Força observável", required: true, maxLength: 300 }, { code: "evidence", label: "Evidência ou exemplo", required: true, maxLength: 600 }] },
    { code: "weaknesses", label: "Fraquezas", kind: "entries", required: true, minEntries: 1, maxEntries: 12, entryFields: [{ code: "insight", label: "Fragilidade observável", required: true, maxLength: 300 }, { code: "evidence", label: "Evidência ou exemplo", required: true, maxLength: 600 }] },
    { code: "opportunities", label: "Oportunidades", kind: "entries", required: true, minEntries: 1, maxEntries: 12, entryFields: [{ code: "insight", label: "Oportunidade concreta", required: true, maxLength: 300 }, { code: "evidence", label: "Sinal ou fonte", required: true, maxLength: 600 }] },
    { code: "threats", label: "Ameaças", kind: "entries", required: true, minEntries: 1, maxEntries: 12, entryFields: [{ code: "insight", label: "Risco externo", required: true, maxLength: 300 }, { code: "evidence", label: "Sinal ou fonte", required: true, maxLength: 600 }] },
  ], analysisDimensions: ["ambiente interno", "ambiente externo", "prioridades estratégicas", "riscos"], exportFormats: ["pdf", "xlsx"],
};

export function validateWorkbenchToolSpec(input: unknown): { valid: true; spec: WorkbenchToolSpec } | { valid: false; reason: string } {
  const parsed = workbenchToolSpecSchema.safeParse(input);
  return parsed.success ? { valid: true, spec: parsed.data } : { valid: false, reason: parsed.error.issues[0]?.message ?? "invalid_tool_spec" };
}

export function validateWorkbenchPayload(spec: WorkbenchToolSpec, input: unknown): { valid: true; payload: WorkbenchPayload } | { valid: false; reason: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { valid: false, reason: "invalid_payload" };
  const payload = input as Record<string, unknown>;
  const allowed = new Map(spec.fields.map((field) => [field.code, field]));
  for (const [code, value] of Object.entries(payload)) {
    const field = allowed.get(code);
    if (!field) return { valid: false, reason: `unsupported_field:${code}` };
    if (field.kind === "entries") {
      if (!Array.isArray(value) || value.length < (field.minEntries ?? 1) || value.length > (field.maxEntries ?? 20)) return { valid: false, reason: `entries_count_required:${code}` };
      for (const entry of value) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return { valid: false, reason: `invalid_entry:${code}` };
        const allowedEntryFields = new Map(field.entryFields?.map((entryField) => [entryField.code, entryField]) ?? []);
        for (const [entryCode, entryValue] of Object.entries(entry)) {
          const entryField = allowedEntryFields.get(entryCode);
          if (!entryField || typeof entryValue !== "string" || entryValue.trim().length > entryField.maxLength) return { valid: false, reason: `invalid_entry_value:${code}` };
        }
        for (const entryField of field.entryFields ?? []) if (entryField.required && (!entry[entryField.code] || !entry[entryField.code].trim())) return { valid: false, reason: `required_entry_field:${entryField.code}` };
      }
      continue;
    }
    if (value !== null && typeof value !== "string" && typeof value !== "number") return { valid: false, reason: `invalid_value:${code}` };
    if (["money", "percentage", "number"].includes(field.kind) && value !== null && (typeof value !== "number" || !Number.isFinite(value))) return { valid: false, reason: `numeric_value_required:${code}` };
    if (field.kind === "date" && value !== null && (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))) return { valid: false, reason: `date_value_required:${code}` };
    if (field.kind === "choice" && value !== null && (typeof value !== "string" || !field.choices?.includes(value))) return { valid: false, reason: `choice_value_required:${code}` };
  }
  for (const field of spec.fields) if (field.required && (payload[field.code] === undefined || payload[field.code] === null || payload[field.code] === "")) return { valid: false, reason: `required_field:${field.code}` };
  return { valid: true, payload: payload as WorkbenchPayload };
}
