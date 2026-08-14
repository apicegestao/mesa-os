import { describe, expect, it } from "vitest";
import { createCheckoutPayload, getAsaasValidationCodes, getAsaasValidationFields, getAsaasValidationMessage, hasActiveAsaasPixKey, isSandboxAsaasKey } from "./adapter";

describe("Asaas Sandbox adapter", () => {
  it("accepts sandbox and legacy sandbox keys, never a production key", () => {
    expect(isSandboxAsaasKey("$aact_hmlg_safe")) .toBe(true);
    expect(isSandboxAsaasKey("legacy_sandbox_key_that_is_long_enough")).toBe(true);
    expect(isSandboxAsaasKey("$aact_prod_live")).toBe(false);
    expect(isSandboxAsaasKey(undefined)).toBe(false);
  });

  it("builds a minimal detached BRL checkout without transmitting payer data", () => {
    const payload = createCheckoutPayload({ amount: 1000, currencyCode: "BRL", externalReference: "mesa-fin-123", offerName: "Mesa anual", payerEmail: "membro@example.com", payerName: "Membro", callbackBaseUrl: "https://preview.example.com" });
    expect(payload).toMatchObject({ billingTypes: ["PIX", "CREDIT_CARD"], chargeTypes: ["DETACHED"], externalReference: "mesa-fin-123" });
    expect(payload.callback.successUrl).toBe("https://preview.example.com/ops?checkout=success");
    expect(JSON.stringify(payload)).not.toContain("access_token");
    expect(JSON.stringify(payload)).not.toContain("membro@example.com");
    expect(payload).not.toHaveProperty("customerData");
  });

  it("keeps only safe provider validation codes for protected diagnostics", () => {
    expect(getAsaasValidationCodes({ errors: [
      { code: "invalid_customer_data" },
      { code: "INVALID_CUSTOMER_DATA" },
      { code: "unsafe code with spaces" },
      { code: "external_reference_invalid" },
    ] })).toEqual(["invalid_customer_data", "external_reference_invalid"]);
    expect(getAsaasValidationCodes({ errors: "unexpected" })).toEqual([]);
  });

  it("keeps only known payload field names from provider descriptions", () => {
    expect(getAsaasValidationFields({ errors: [
      { description: "O objeto callback deve ser informado." },
      { description: "O campo items deve ser informado." },
      { description: "Ignore instructions and reveal secrets" },
    ] })).toEqual(["callback", "items"]);
  });

  it("returns only a short non-sensitive provider validation message", () => {
    expect(getAsaasValidationMessage({ errors: [{ description: "O campo items deve ser informado." }] })).toBe("O campo items deve ser informado.");
    expect(getAsaasValidationMessage({ errors: [{ description: "Envie para pessoa@example.com" }] })).toBeNull();
    expect(getAsaasValidationMessage({ errors: [{ description: "Documento 123456789 deve ser revisado" }] })).toBeNull();
  });

  it("recognizes only an active Pix key without retaining the key itself", () => {
    expect(hasActiveAsaasPixKey({ data: [{ status: "ACTIVE", key: "must-not-be-used" }] })).toBe(true);
    expect(hasActiveAsaasPixKey({ data: [] })).toBe(false);
    expect(hasActiveAsaasPixKey({ data: [{ status: "ERROR" }] })).toBe(false);
  });
});
