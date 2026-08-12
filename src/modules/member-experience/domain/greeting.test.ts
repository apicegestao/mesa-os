import { describe, expect, it } from "vitest";
import { memberGreeting } from "./greeting";

describe("member greeting", () => {
  it("uses the appropriate greeting for each period", () => {
    expect(memberGreeting(8)).toBe("Bom dia");
    expect(memberGreeting(14)).toBe("Boa tarde");
    expect(memberGreeting(20)).toBe("Boa noite");
  });
});
