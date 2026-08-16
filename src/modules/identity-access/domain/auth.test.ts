import { describe, expect, it } from "vitest";
import { loginSchema } from "./auth";

describe("identity access domain", () => {
  it("normalizes a valid email", () => {
    expect(loginSchema.parse({ email: " Rafael@Example.com " }).email).toBe("rafael@example.com");
  });

});
