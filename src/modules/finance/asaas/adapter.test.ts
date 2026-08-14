import { describe, expect, it } from "vitest";
import { createCheckoutPayload, isSandboxAsaasKey } from "./adapter";

describe("Asaas Sandbox adapter", () => {
  it("accepts only a non-empty sandbox key", () => {
    expect(isSandboxAsaasKey("$aact_hmlg_safe")) .toBe(true);
    expect(isSandboxAsaasKey("$aact_prod_live")).toBe(false);
    expect(isSandboxAsaasKey(undefined)).toBe(false);
  });

  it("builds a detached BRL checkout without payment data", () => {
    const payload = createCheckoutPayload({ amount: 1000, currencyCode: "BRL", externalReference: "mesa-fin-123", offerName: "Mesa anual", payerEmail: "membro@example.com", payerName: "Membro", callbackBaseUrl: "https://preview.example.com" });
    expect(payload).toMatchObject({ billingTypes: ["PIX", "CREDIT_CARD"], chargeTypes: ["DETACHED"], externalReference: "mesa-fin-123" });
    expect(payload.callback.successUrl).toBe("https://preview.example.com/ops?checkout=success");
    expect(JSON.stringify(payload)).not.toContain("access_token");
  });
});
