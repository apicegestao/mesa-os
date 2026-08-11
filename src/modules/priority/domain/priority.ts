import { z } from "zod";
import type { DiagnosticResult } from "@/modules/diagnostic/domain/diagnostic";

export type Priority = { id: string; dimension_label: string; source_score: number; rationale: string; confirmed_at: string };
export const rationaleSchema = z.string().trim().min(10).max(500);

export function lowestCandidates(result: DiagnosticResult) {
  const minimum = Math.min(...result.dimensions.map((dimension) => dimension.score));
  return result.dimensions.filter((dimension) => dimension.score === minimum);
}
