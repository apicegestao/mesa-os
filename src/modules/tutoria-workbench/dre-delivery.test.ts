import { describe, expect, it } from "vitest";
import { buildDreExpertDelivery } from "./dre-delivery";

describe("DRE expert delivery", () => {
  it("grounds a financial reading in reported fields and declared calculations", () => {
    const delivery = buildDreExpertDelivery({ period: "2026-08-01", revenue: 10000, variable_costs: 4000, fixed_costs: 2000, operating_expenses: 1500, financial_result: -100, taxes: 400 });
    expect(delivery?.items.some((item) => item.title === "gross profit" && item.evidence[0]?.kind === "calculated")).toBe(true);
    expect(delivery?.escalationRequired).toBe(false);
  });

  it("does not pretend a partial DRE is complete", () => {
    const delivery = buildDreExpertDelivery({ period: "2026-08-01", revenue: 10000, variable_costs: 4000, fixed_costs: 2000, operating_expenses: 1500 });
    expect(delivery?.escalationRequired).toBe(true);
    expect(delivery?.limitations[0]).toContain("resultado financeiro");
  });

  it("refuses an incomplete required payload", () => {
    expect(buildDreExpertDelivery({ revenue: 1000 })).toBeNull();
  });
});
