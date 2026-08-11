import { describe, expect, it } from "vitest";
import { authRedirectBaseUrl, loginSchema, safeNextPath } from "./auth";

describe("identity access domain", () => {
  it("normalizes a valid email", () => {
    expect(loginSchema.parse({ email: " Rafael@Example.com " }).email).toBe("rafael@example.com");
  });

  it("accepts only internal next paths", () => {
    expect(safeNextPath("/app")).toBe("/app");
    expect(safeNextPath("//attacker.example")).toBe("/app");
    expect(safeNextPath("https://attacker.example")).toBe("/app");
  });

  it("uses only an approved Mesa OS Netlify URL for preview auth", () => {
    const production = "https://mesa-os.netlify.app";
    expect(authRedirectBaseUrl(production, "https://deploy-preview-8--mesa-os.netlify.app", "deploy-preview")).toBe("https://deploy-preview-8--mesa-os.netlify.app");
    expect(authRedirectBaseUrl(production, "https://attacker.example", "deploy-preview")).toBe(production);
    expect(authRedirectBaseUrl(production, "https://deploy-preview-8--mesa-os.netlify.app", "production")).toBe(production);
  });
});
