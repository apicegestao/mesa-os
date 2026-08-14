import { describe, expect, it } from "vitest";
import { formatMemberDate } from "./format-member-date";

describe("formatMemberDate", () => {
  it("formats a canonical date in Portuguese without timezone drift", () => {
    expect(formatMemberDate("2026-08-11")).toBe("11 ago. 2026");
  });

  it("preserves an invalid value instead of inventing a date", () => {
    expect(formatMemberDate("not-a-date")).toBe("not-a-date");
  });
});
