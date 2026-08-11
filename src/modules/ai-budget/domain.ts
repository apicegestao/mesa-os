import { z } from "zod";

export const aiBudgetFormSchema = z.object({ monthlyLimitBrl: z.coerce.number().finite().min(0).max(1_000_000), usdPerBrl: z.coerce.number().finite().positive().max(10) });
export type AIBudgetFormState = { status: "idle" | "success" | "error"; message?: string };
export function toBudgetPolicyValues(input: z.infer<typeof aiBudgetFormSchema>) { return { monthly_limit_brl_cents: Math.round(input.monthlyLimitBrl * 100), usd_micros_per_brl: Math.round(input.usdPerBrl * 1_000_000) }; }
