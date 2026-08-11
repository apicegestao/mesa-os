import { z } from "zod";

export type DiagnosticOption = { value: number; label: string };
export type DiagnosticQuestion = { id: string; prompt: string; position: number };
export type DiagnosticDimension = {
  id: string;
  code: string;
  label: string;
  position: number;
  questions: DiagnosticQuestion[];
};

export type DiagnosticResult = {
  ime: number;
  stageCode: string;
  stageLabel: string;
  dimensions: Array<{ code: string; label: string; score: number }>;
};

export type DiagnosticWorkspace = {
  revisionId: string;
  executionId: string | null;
  status: "not_started" | "draft" | "completed";
  dimensions: DiagnosticDimension[];
  options: DiagnosticOption[];
  answers: Record<string, number>;
  result: DiagnosticResult | null;
};

export const answersSchema = z.record(z.string().uuid(), z.number().int().min(1).max(5));

export function answeredCount(answers: Record<string, number>) {
  return Object.values(answers).filter((value) => value >= 1 && value <= 5).length;
}

export function isDimensionComplete(dimension: DiagnosticDimension, answers: Record<string, number>) {
  return dimension.questions.every((question) => {
    const value = answers[question.id] ?? 0;
    return value >= 1 && value <= 5;
  });
}

export function isDiagnosticComplete(workspace: Pick<DiagnosticWorkspace, "dimensions" | "answers">) {
  return workspace.dimensions.every((dimension) => isDimensionComplete(dimension, workspace.answers));
}

export function resultStage(score: number) {
  if (score < 40) return "Empresa Refém";
  if (score < 60) return "Em Transição";
  if (score < 80) return "Em Maturação";
  return "Autogerenciável";
}

export function calculateResult(dimensions: DiagnosticDimension[], answers: Record<string, number>): DiagnosticResult {
  const dimensionResults = dimensions.map((dimension) => {
    const values = dimension.questions.map((question) => answers[question.id] ?? 0);
    const score = Math.round((values.reduce((sum, value) => sum + value, 0) / (values.length * 5)) * 100);
    return { code: dimension.code, label: dimension.label, score };
  });
  const allValues = dimensions.flatMap((dimension) => dimension.questions.map((question) => answers[question.id] ?? 0));
  const ime = Math.round((allValues.reduce((sum, value) => sum + value, 0) / (allValues.length * 5)) * 100);
  return { ime, stageCode: "preview", stageLabel: resultStage(ime), dimensions: dimensionResults };
}
