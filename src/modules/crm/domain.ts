export const internalRoles = ["admin", "commercial", "concierge", "finance"] as const;
export type InternalRole = (typeof internalRoles)[number];

export type CrmOpportunity = {
  account_id: string;
  account_name: string;
  contact_email: string | null;
  contact_name: string | null;
  currency_code: string;
  expected_value: number | null;
  id: string;
  last_activity_at: string | null;
  next_action: string;
  next_action_due_on: string | null;
  open_task_count: number;
  owner_identity_id: string;
  recent_activities: { kind: string; occurred_at: string; summary: string }[];
  stage: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  tasks: { due_on: string | null; status: string; title: string }[];
  title: string;
};

export type CrmHandoff = {
  account_name: string;
  created_at: string;
  id: string;
  opportunity_title: string;
  status: "pending" | "accepted" | "enrollment_requested" | "completed" | "cancelled";
};

export type CrmWorkspace = { opportunities: CrmOpportunity[]; handoffs: CrmHandoff[] };

export type CrmClientCard = {
  accountId: string;
  accountName: string;
  opportunities: CrmOpportunity[];
  primary: CrmOpportunity;
  stage: CrmOpportunity["stage"];
};

const stageOrder: Record<CrmOpportunity["stage"], number> = { new: 0, qualified: 1, proposal: 2, negotiation: 3, won: 4, lost: 5 };

export function clientCardsForKanban(opportunities: CrmOpportunity[]): CrmClientCard[] {
  const grouped = new Map<string, CrmOpportunity[]>();
  opportunities.forEach((opportunity) => grouped.set(opportunity.account_id, [...(grouped.get(opportunity.account_id) ?? []), opportunity]));
  return [...grouped.entries()].map(([accountId, accountOpportunities]) => {
    const active = accountOpportunities.filter((opportunity) => opportunity.stage !== "lost");
    const candidates = active.length ? active : accountOpportunities;
    const primary = [...candidates].sort((left, right) => {
      const stageDifference = stageOrder[right.stage] - stageOrder[left.stage];
      if (stageDifference !== 0) return stageDifference;
      return (left.next_action_due_on ?? "9999-12-31").localeCompare(right.next_action_due_on ?? "9999-12-31");
    })[0]!;
    return { accountId, accountName: primary.account_name, opportunities: accountOpportunities, primary, stage: primary.stage };
  }).sort((left, right) => (left.primary.next_action_due_on ?? "9999-12-31").localeCompare(right.primary.next_action_due_on ?? "9999-12-31"));
}

export function canManageEnrollments(roles: readonly InternalRole[]) {
  return roles.includes("admin") || roles.includes("concierge");
}

export function canCreateOpportunities(roles: readonly InternalRole[]) {
  return roles.includes("admin") || roles.includes("commercial");
}

export function canManageRoles(roles: readonly InternalRole[]) {
  return roles.includes("admin");
}
