import { describe, expect, it } from "vitest";
import { canCreateOpportunities, canManageEnrollments, canManageRoles, clientCardsForKanban, type CrmOpportunity } from "./domain";

const opportunity = (id: string, accountId: string, stage: CrmOpportunity["stage"], dueOn: string | null): CrmOpportunity => ({ id, account_id: accountId, account_name: accountId === "a" ? "Ápice" : "Mesa", contact_email: null, contact_name: null, currency_code: "BRL", expected_value: null, last_activity_at: null, next_action: "Retornar", next_action_due_on: dueOn, open_task_count: 0, owner_identity_id: "owner", recent_activities: [], stage, tasks: [], title: `Negócio ${id}` });

describe("internal CRM capabilities", () => {
  it("keeps commercial limited to CRM work", () => {
    expect(canCreateOpportunities(["commercial"])).toBe(true);
    expect(canManageEnrollments(["commercial"])).toBe(false);
    expect(canManageRoles(["commercial"])).toBe(false);
  });

  it("gives Concierge the controlled enrollment capability", () => {
    expect(canManageEnrollments(["concierge"])).toBe(true);
    expect(canCreateOpportunities(["concierge"])).toBe(false);
  });

  it("keeps role administration with admins", () => {
    expect(canManageRoles(["admin"])).toBe(true);
    expect(canCreateOpportunities(["admin"])).toBe(true);
  });

  it("keeps one Kanban card per account and selects the furthest active opportunity", () => {
    const cards = clientCardsForKanban([opportunity("1", "a", "qualified", "2026-08-18"), opportunity("2", "a", "negotiation", "2026-08-22"), opportunity("3", "b", "new", null)]);
    expect(cards).toHaveLength(2);
    expect(cards.find((card) => card.accountId === "a")?.primary.id).toBe("2");
    expect(cards.find((card) => card.accountId === "a")?.opportunities).toHaveLength(2);
  });
});
