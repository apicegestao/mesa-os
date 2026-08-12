import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocumentPreviewCard } from "./document-preview-card";
import { DRE_WORKBENCH_SPEC } from "./tool-spec";

describe("Mesa document preview card", () => {
  it("shows draft provenance before a file can be exported", () => {
    render(<DocumentPreviewCard workspace={{ revisionId: "dre-1", spec: DRE_WORKBENCH_SPEC, payload: { period: "2026-08-01", revenue: 1000 }, updatedAt: null }} />);
    expect(screen.getByText("Rascunho · v1 · Mesa dos Donos")).toBeInTheDocument();
    expect(screen.getByText(/A exportação em PDF\/XLSX/)).toBeInTheDocument();
  });
});
