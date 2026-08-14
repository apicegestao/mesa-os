import { z } from "zod";

const sandboxKeyPrefix = "$aact_hmlg_";
const apiBaseUrl = "https://api-sandbox.asaas.com/v3";

const responseSchema = z.object({
  id: z.string().min(2).max(160),
  link: z.string().url().max(2048),
  status: z.string().min(2).max(80),
});

export type AsaasCheckoutRequest = {
  apiKey: string;
  amount: number;
  currencyCode: string;
  externalReference: string;
  offerName: string;
  payerEmail: string;
  payerName: string;
  callbackBaseUrl: string;
};

export type AsaasCheckout = { id: string; link: string; status: string };

export class AsaasCheckoutError extends Error {
  constructor(
    public readonly status: number,
    public readonly validationCodes: string[],
    public readonly validationFields: string[],
    public readonly validationMessage: string | null,
  ) {
    super(`asaas_checkout_${status}`);
  }
}

const validationErrorSchema = z.object({
  errors: z.array(z.object({ code: z.string().trim().optional(), description: z.string().optional() })).max(10).optional(),
});

export function getAsaasValidationCodes(payload: unknown) {
  const parsed = validationErrorSchema.safeParse(payload);

  if (!parsed.success) return [];
  return [...new Set((parsed.data.errors ?? [])
    .flatMap(({ code }) => code ? [code.toLowerCase()] : [])
    .filter((code) => /^[a-z0-9_]{1,80}$/.test(code)))];
}

export function getAsaasValidationFields(payload: unknown) {
  const parsed = validationErrorSchema.safeParse(payload);
  if (!parsed.success) return [];
  const allowedFields = ["billingTypes", "chargeTypes", "minutesToExpire", "externalReference", "callback", "items", "customerData"];
  const descriptions = (parsed.data.errors ?? []).flatMap(({ description }) => description ? [description] : []);
  return allowedFields.filter((field) => descriptions.some((description) => new RegExp(`\\b${field}\\b`, "i").test(description)));
}

export function getAsaasValidationMessage(payload: unknown) {
  const parsed = validationErrorSchema.safeParse(payload);
  const description = parsed.success ? parsed.data.errors?.[0]?.description?.trim() : null;
  if (!description || description.length > 240) return null;
  if (/@|\b\d{8,}\b/.test(description)) return null;
  return /^[\p{L}\p{N} .,:;_'-]+$/u.test(description) ? description : null;
}

export function isSandboxAsaasKey(value: string | undefined) {
  if (typeof value !== "string") return false;
  const key = value.trim();
  if (key.startsWith("$aact_prod_")) return false;
  if (key.startsWith(sandboxKeyPrefix)) return key.length > sandboxKeyPrefix.length;
  // Asaas continues to support legacy API keys created before environment
  // prefixes. They are only sent to the sandbox endpoint below, where Asaas
  // validates their environment before any checkout can be created.
  return key.length >= 20;
}

export function createCheckoutPayload(input: Omit<AsaasCheckoutRequest, "apiKey">) {
  if (input.currencyCode !== "BRL") throw new Error("unsupported_currency");
  const callbackBaseUrl = new URL(input.callbackBaseUrl);
  return {
    billingTypes: ["PIX", "CREDIT_CARD"],
    chargeTypes: ["DETACHED"],
    minutesToExpire: 60,
    externalReference: input.externalReference,
    callback: {
      successUrl: new URL("/ops?checkout=success", callbackBaseUrl).toString(),
      cancelUrl: new URL("/ops?checkout=cancel", callbackBaseUrl).toString(),
      expiredUrl: new URL("/ops?checkout=expired", callbackBaseUrl).toString(),
    },
    items: [{
      name: input.offerName,
      description: "Mesa dos Donos",
      quantity: 1,
      value: input.amount,
    }],
  };
}

export async function createAsaasSandboxCheckout(input: AsaasCheckoutRequest): Promise<AsaasCheckout> {
  if (!isSandboxAsaasKey(input.apiKey)) throw new Error("sandbox_key_required");
  const response = await fetch(`${apiBaseUrl}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "MesaOS/FIN-3.1B (sandbox)",
      access_token: input.apiKey,
    },
    body: JSON.stringify(createCheckoutPayload(input)),
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new AsaasCheckoutError(response.status, getAsaasValidationCodes(payload), getAsaasValidationFields(payload), getAsaasValidationMessage(payload));
  return responseSchema.parse(payload);
}
