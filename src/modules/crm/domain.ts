export const internalRoles = ["admin", "commercial", "concierge"] as const;
export type InternalRole = (typeof internalRoles)[number];

export type CrmOpportunity = {
  account_name: string;
  currency_code: string;
  expected_value: number | null;
  id: string;
  next_action: string;
  next_action_due_on: string | null;
  owner_identity_id: string;
  stage: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
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

export function canManageEnrollments(roles: readonly InternalRole[]) {
  return roles.includes("admin") || roles.includes("concierge");
}

export function canCreateOpportunities(roles: readonly InternalRole[]) {
  return roles.includes("admin") || roles.includes("commercial");
}

export function canManageRoles(roles: readonly InternalRole[]) {
  return roles.includes("admin");
}
