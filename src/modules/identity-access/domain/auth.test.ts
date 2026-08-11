import { describe, expect, it } from "vitest";
import { loginSchema, safeNextPath } from "./auth";

describe("identity access domain", () => {
  it("normalizes a valid email", () => {
    expect(loginSchema.parse({ email: " Rafael@Example.com " }).email).toBe("rafael@example.com");
  });

  it("accepts only internal next paths", () => {
    expect(safeNextPath("/app")).toBe("/app");
    expect(safeNextPath("//attacker.example")).toBe("/app");
    expect(safeNextPath("https://attacker.example")).toBe("/app");
  });
});
