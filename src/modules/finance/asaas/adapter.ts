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
  ) {
    super(`asaas_checkout_${status}`);
  }
}

export function getAsaasValidationCodes(payload: unknown) {
  const parsed = z.object({
    errors: z.array(z.object({ code: z.string().trim() })).max(10).optional(),
  }).safeParse(payload);

  if (!parsed.success) return [];
  return [...new Set((parsed.data.errors ?? [])
    .map(({ code }) => code.toLowerCase())
    .filter((code) => /^[a-z0-9_]{1,80}$/.test(code)))];
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
      externalReference: input.externalReference,
      name: input.offerName,
      description: "Mesa dos Donos",
      quantity: 1,
      value: input.amount,
    }],
    customerData: { name: input.payerName, email: input.payerEmail },
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
  if (!response.ok) throw new AsaasCheckoutError(response.status, getAsaasValidationCodes(payload));
  return responseSchema.parse(payload);
}
