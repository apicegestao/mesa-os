import type { PublishedMethodologyMap } from "@/modules/methodology";

/**
 * The only data contracts this increment permits a future TutorIA runtime to
 * request. They are deliberately derived, compact and read-only: raw evidence,
 * tool answers and free-form member content cannot be added by a caller.
 */
export const TUTORIA_READ_TOOL_CATALOG = {
  read_member_state: {
    risk: "low",
    purpose: "Situar a orientação na jornada do próprio membro.",
    output: "TutorIAMemberState",
  },
  read_methodology_map: {
    risk: "low",
    purpose: "Situar a orientação no mapa metodológico publicado.",
    output: "TutorIAMethodologySummary",
  },
  read_workbench_tool: {
    risk: "moderate",
    purpose: "Analisar apenas os dados estruturados da ferramenta do próprio membro.",
    output: "TutorIAWorkbenchContext",
  },
  read_longitudinal_context: {
    risk: "low",
    purpose: "Situar a orientação em fatos automáticos autorizados da própria jornada.",
    output: "TutorIALongitudinalContext",
  },
} as const;

export type TutorIATool = keyof typeof TUTORIA_READ_TOOL_CATALOG;

export function isTutorIATool(value: string): value is TutorIATool {
  return value in TUTORIA_READ_TOOL_CATALOG;
}

export type TutorIAMemberState = {
  diagnosticWorkspace: "available" | "absent";
  priority: "defined" | "absent";
  cycle: "active" | "absent";
  availableMission: "available" | "absent";
  evidence: "submitted" | "absent";
};

export type TutorIAMethodologySummary = {
  status: "published" | "absent";
  stageCount: number;
  pillarCount: number;
  outcomeCount: number;
};

export function buildTutorIAMemberState(input: {
  hasDiagnosticWorkspace: boolean;
  hasPriority: boolean;
  hasActiveCycle: boolean;
  hasAvailableMission: boolean;
  hasSubmittedEvidence: boolean;
}): TutorIAMemberState {
  return {
    diagnosticWorkspace: input.hasDiagnosticWorkspace ? "available" : "absent",
    priority: input.hasPriority ? "defined" : "absent",
    cycle: input.hasActiveCycle ? "active" : "absent",
    availableMission: input.hasAvailableMission ? "available" : "absent",
    evidence: input.hasSubmittedEvidence ? "submitted" : "absent",
  };
}

export function buildTutorIAMethodologySummary(map: PublishedMethodologyMap | null): TutorIAMethodologySummary {
  if (!map) return { status: "absent", stageCount: 0, pillarCount: 0, outcomeCount: 0 };
  return {
    status: "published",
    stageCount: map.stages.length,
    pillarCount: map.pillars.length,
    outcomeCount: map.pillars.reduce((total, pillar) => total + pillar.outcomes.length, 0),
  };
}
