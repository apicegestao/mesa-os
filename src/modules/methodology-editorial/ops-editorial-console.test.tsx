import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OpsEditorialConsole } from "./ops-editorial-console";

describe("editorial release console", () => {
  it("offers an explicit homologation release only for a draft", () => {
    render(<OpsEditorialConsole units={[
      { id: "draft", code: "t1_processes_map", version: 1, status: "draft", title: "Mapa de processo crítico", business_outcome: "Um processo passa a ter fluxo, responsável e controle operacional.", tools: [{ code: "critical_process_map_v1", version: 1, role: "primary", status: "draft" }] },
      { id: "published", code: "t1_finance_dre_dashboard", version: 1, status: "published", title: "DRE gerencial e painel mínimo", business_outcome: "A empresa passa a decidir por resultado, caixa e indicadores essenciais.", tools: [{ code: "dre_management_v1", version: 1, role: "primary", status: "published" }] },
    ]} />);
    expect(screen.getAllByRole("button", { name: "Publicar em homologação" })).toHaveLength(1);
    expect(screen.getByText("DRE gerencial e painel mínimo")).toBeInTheDocument();
  });
});
